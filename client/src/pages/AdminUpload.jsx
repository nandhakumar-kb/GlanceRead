import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ArrowUp, ArrowDown, X } from 'lucide-react';
import Button from '../components/common/Button';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../config';

const AdminUpload = () => {
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [category, setCategory] = useState('');
    const [affiliateLink, setAffiliateLink] = useState('');
    const [isPremium, setIsPremium] = useState(true); // Default to Premium
    const [coverImage, setCoverImage] = useState(null);
    const [infographicImages, setInfographicImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Manage Books State
    const [books, setBooks] = useState([]);

    // Page Reordering State
    const [showPagesModal, setShowPagesModal] = useState(false);
    const [selectedBookForPages, setSelectedBookForPages] = useState(null);
    const [orderedPages, setOrderedPages] = useState([]);

    const navigate = useNavigate();
    const { user } = useAuth();

    // Redirect if not admin (client-side check, server also checks)
    if (user?.role !== 'admin') {
        return <div className="p-8 text-center">Access Denied</div>;
    }

    React.useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/books`);
            setBooks(res.data);
        } catch (err) {
            setError('Failed to fetch books');
        }
    };

    const handleFileChange = (e, setter, isMultiple = false) => {
        if (isMultiple) {
            setter(Array.from(e.target.files));
        } else {
            setter(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const formData = new FormData();
        formData.append('title', title);
        formData.append('author', author);
        formData.append('category', category);
        formData.append('affiliateLink', affiliateLink || ''); // Optional
        formData.append('isPremium', isPremium);
        formData.append('coverImage', coverImage);
        infographicImages.forEach((file) => {
            formData.append('infographicImages', file);
        });

        try {
            await axios.post(`${API_URL}/api/books`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'x-auth-token': localStorage.getItem('token') // Ensure token is sent
                },
            });
            // Reset form
            setTitle('');
            setAuthor('');
            setCategory('');
            setAffiliateLink('');
            setCoverImage(null);
            setInfographicImages([]);
            fetchBooks(); // Refresh list
            alert("Book Uploaded Successfully!");
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to upload book');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (bookId) => {
        if (!window.confirm("Are you sure you want to delete this book?")) return;
        try {
            await axios.delete(`${API_URL}/api/books/${bookId}`, {
                headers: { 'x-auth-token': localStorage.getItem('token') }
            });
            setBooks(books.filter(b => b._id !== bookId));
        } catch (err) {
            alert("Failed to delete book");
        }
    };

    const handleManagePages = (book) => {
        setSelectedBookForPages(book);
        // Ensure we have an array, even if it's mixed with single infographicImage
        let pages = [];
        if (book.infographicImages && book.infographicImages.length > 0) {
            pages = [...book.infographicImages];
        } else if (book.infographicImage) {
            pages = [book.infographicImage];
        }
        setOrderedPages(pages);
        setShowPagesModal(true);
    };

    const movePage = (index, direction) => {
        const newPages = [...orderedPages];
        if (direction === 'up' && index > 0) {
            [newPages[index], newPages[index - 1]] = [newPages[index - 1], newPages[index]];
        } else if (direction === 'down' && index < newPages.length - 1) {
            [newPages[index], newPages[index + 1]] = [newPages[index + 1], newPages[index]];
        }
        setOrderedPages(newPages);
    };

    const savePageOrder = async () => {
        if (!selectedBookForPages) return;
        try {
            await axios.put(`${API_URL}/api/books/${selectedBookForPages._id}`,
                { infographicImages: orderedPages },
                { headers: { 'x-auth-token': localStorage.getItem('token') } }
            );

            // Update local state
            setBooks(books.map(b => b._id === selectedBookForPages._id ? { ...b, infographicImages: orderedPages } : b));

            alert("Page order saved!");
            setShowPagesModal(false);
        } catch (err) {
            console.error(err);
            alert("Failed to save order");
        }
    };

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
            <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                <h1 className="text-2xl font-bold text-slate-900 mb-6">Upload New Book</h1>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-6">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Book Title</label>
                        <input
                            type="text"
                            required
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Author</label>
                        <input
                            type="text"
                            required
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                            value={author}
                            onChange={(e) => setAuthor(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                        <select
                            required
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        >
                            <option value="">Select a category</option>
                            <option value="Wealth">Wealth</option>
                            <option value="Productivity">Productivity</option>
                            <option value="Psychology">Psychology</option>
                            <option value="Business">Business</option>
                            <option value="Biography">Biography</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Affiliate Book Link (Optional)</label>
                        <input
                            type="url"
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                            placeholder="https://amazon.com/..."
                            value={affiliateLink}
                            onChange={(e) => setAffiliateLink(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Cover Image (Small)</label>
                        <input
                            type="file"
                            required
                            accept="image/*"
                            className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                            onChange={(e) => handleFileChange(e, setCoverImage)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Infographics (Multiple Pages Supported)</label>
                        <input
                            type="file"
                            required
                            accept="image/*"
                            multiple
                            className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                            onChange={(e) => handleFileChange(e, setInfographicImages, true)}
                        />
                    </div>


                    <div>
                        <label className="flex items-center space-x-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={isPremium}
                                onChange={(e) => setIsPremium(e.target.checked)}
                                className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                            />
                            <span className="text-slate-700 font-medium">Is Premium Content?</span>
                        </label>
                        <p className="text-xs text-slate-500 mt-1 ml-8">Checked = Locked for Free Users. Unchecked = Free for everyone.</p>
                    </div>

                    <Button type="submit" variant="primary" className="w-full" disabled={loading}>
                        {loading ? 'Uploading...' : 'Upload Book'}
                    </Button>
                </form>

                <div className="mt-16 pt-8 border-t border-slate-200">
                    <h2 className="text-xl font-bold text-slate-900 mb-6">Manage Library ({books.length})</h2>
                    <div className="space-y-4">
                        {books.map(book => (
                            <div key={book._id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                                <div className="flex items-center space-x-4">
                                    <img src={book.coverImage} alt="" className="w-12 h-16 object-cover rounded shadow-sm" />
                                    <div>
                                        <p className="font-bold text-slate-900">{book.title}</p>
                                        <p className="text-sm text-slate-500">{book.author}</p>
                                        <span className={`text-xs px-2 py-0.5 rounded-full ${book.isPremium ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'}`}>
                                            {book.isPremium ? 'Premium' : 'Free'}
                                        </span>
                                        {book.affiliateLink && (
                                            <a href={book.affiliateLink} target="_blank" rel="noopener noreferrer" className="ml-2 text-xs text-blue-500 hover:underline truncate max-w-[150px] inline-block align-bottom">
                                                Link Configured
                                            </a>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => handleManagePages(book)}
                                        className="text-slate-600 hover:text-slate-800 text-sm font-medium px-3 py-1 bg-slate-200 hover:bg-slate-300 rounded-lg transition-colors"
                                    >
                                        Reorder Pages
                                    </button>
                                    <button
                                        onClick={async () => {
                                            const newLink = prompt("Enter new Affiliate Link:", book.affiliateLink || "");
                                            if (newLink !== null) {
                                                try {
                                                    const res = await axios.put(`${API_URL}/api/books/${book._id}`,
                                                        { affiliateLink: newLink },
                                                        { headers: { 'x-auth-token': localStorage.getItem('token') } }
                                                    );
                                                    // Update local state
                                                    setBooks(books.map(b => b._id === book._id ? { ...b, affiliateLink: newLink } : b));
                                                    alert("Link Updated!");
                                                } catch (err) {
                                                    console.error(err);
                                                    alert("Failed to update link");
                                                }
                                            }
                                        }}
                                        className="text-primary-600 hover:text-primary-800 text-sm font-medium px-3 py-1 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors"
                                    >
                                        Edit Link
                                    </button>
                                    <button
                                        onClick={() => handleDelete(book._id)}
                                        className="text-red-500 hover:text-red-700 text-sm font-medium px-3 py-1 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Manage Pages Modal */}
            {showPagesModal && selectedBookForPages && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
                        <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                            <h3 className="font-bold text-lg text-slate-800">Reorder Pages: {selectedBookForPages.title}</h3>
                            <button onClick={() => setShowPagesModal(false)} className="p-1 hover:bg-slate-200 rounded-full text-slate-500">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-4 overflow-y-auto flex-1 space-y-3">
                            {orderedPages.length === 0 ? (
                                <p className="text-center text-slate-500 py-8">No pages found.</p>
                            ) : (
                                orderedPages.map((pageUrl, index) => (
                                    <div key={index} className="flex items-center gap-4 p-3 border border-slate-200 rounded-lg bg-white hover:border-primary-300 transition-colors">
                                        <span className="font-mono text-slate-400 w-6">{index + 1}</span>
                                        <img src={pageUrl} alt={`Page ${index + 1}`} className="w-16 h-28 object-cover rounded border border-slate-100 bg-slate-100" />
                                        <div className="flex-1 truncate text-xs text-slate-400">{pageUrl.split('/').pop()}</div>
                                        <div className="flex flex-col gap-1">
                                            <button
                                                onClick={() => movePage(index, 'up')}
                                                disabled={index === 0}
                                                className="p-1.5 hover:bg-slate-100 rounded text-slate-600 disabled:opacity-30"
                                                title="Move Up"
                                            >
                                                <ArrowUp size={16} />
                                            </button>
                                            <button
                                                onClick={() => movePage(index, 'down')}
                                                disabled={index === orderedPages.length - 1}
                                                className="p-1.5 hover:bg-slate-100 rounded text-slate-600 disabled:opacity-30"
                                                title="Move Down"
                                            >
                                                <ArrowDown size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-3">
                            <button
                                onClick={() => setShowPagesModal(false)}
                                className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-200 font-medium transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={savePageOrder}
                                className="px-4 py-2 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-medium shadow-lg shadow-primary-500/30 transition-all"
                            >
                                Save Order
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div >
    );
};

export default AdminUpload;
