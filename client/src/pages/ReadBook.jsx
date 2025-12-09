import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Lock, ArrowLeft, ShoppingBag, Download } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../config';
import InfographicViewer from '../components/reader/InfographicViewer';
import Button from '../components/common/Button';

const ReadBook = () => {
    const { id } = useParams();
    const { user, isAuthenticated } = useAuth();
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const startTimeRef = React.useRef(Date.now());

    useEffect(() => {
        const fetchBook = async () => {
            try {
                const res = await axios.get(`${API_URL}/api/books/${id}`);
                setBook(res.data);
            } catch (err) {
                setError('Failed to load book');
            } finally {
                setLoading(false);
            }
        };
        fetchBook();
    }, [id]);

    // Track Reading Progress
    useEffect(() => {
        if (!book || !isAuthenticated) return;

        const interval = setInterval(async () => {
            const now = Date.now();
            const timeDiff = (now - startTimeRef.current) / 1000 / 60; // in minutes
            startTimeRef.current = now; // Reset for next tick

            if (timeDiff > 0) {
                try {
                    // Simple logic: If in reader for > 1 min total (approx), mark complete
                    // We aren't tracking total cumulative here, just session chunks.
                    // The backend adds time. The progress % is static for now.
                    await axios.put(`${API_URL}/api/users/progress`, {
                        bookId: id,
                        progress: 100, // Mark as read if they are here
                        sessionTime: timeDiff
                    }, {
                        headers: { 'x-auth-token': localStorage.getItem('token') }
                    });
                } catch (err) {
                    console.error("Progress sync failed", err);
                }
            }
        }, 10000); // Sync every 10 seconds

        return () => clearInterval(interval);
    }, [book, id, isAuthenticated]);

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    if (error) return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;
    if (!book) return <div className="min-h-screen flex items-center justify-center">Book not found</div>;

    const isLocked = book.isPremium && !book.isFree && (!isAuthenticated || user?.subscriptionStatus !== 'active');

    // If locked, we allow THREE pages as a teaser (was 1)
    const viewableImages = isLocked
        ? (book.infographicImages?.length ? book.infographicImages.slice(0, 3) : [book.infographicImage])
        : (book.infographicImages?.length ? book.infographicImages : [book.infographicImage]);

    return (
        <div className="h-screen flex flex-col bg-slate-900">
            <div className="h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-4">
                <Link to="/" className="text-slate-400 hover:text-white flex items-center space-x-2">
                    <ArrowLeft size={20} />
                    <span>Back</span>
                </Link>
                <h1 className="text-white font-medium truncate max-w-md">{book.title}</h1>
                <div className="flex items-center space-x-4">
                    {user?.subscriptionStatus === 'active' && (
                        <button
                            onClick={async () => {
                                try {
                                    const images = book.infographicImages?.length > 0
                                        ? book.infographicImages
                                        : [book.infographicImage];

                                    // Identify current image index or download all?
                                    // For now, download all matches user intent of "high res download"
                                    for (let i = 0; i < images.length; i++) {
                                        const imgUrl = images[i];
                                        const response = await fetch(imgUrl);
                                        const blob = await response.blob();
                                        const url = window.URL.createObjectURL(blob);
                                        const link = document.createElement('a');
                                        link.href = url;
                                        link.download = `${book.title}_page_${i + 1}.jpg`;
                                        document.body.appendChild(link);
                                        link.click();
                                        document.body.removeChild(link);
                                        window.URL.revokeObjectURL(url);
                                    }
                                } catch (e) {
                                    console.error("Download failed", e);
                                    alert("Download failed. Please try again.");
                                }
                            }}
                            className="flex items-center space-x-2 text-slate-400 hover:text-white transition-colors"
                            title="Download High-Res"
                        >
                            <span className="hidden sm:inline text-sm font-medium">Download</span>
                            <Download size={20} />
                        </button>
                    )}

                    {book.affiliateLink && (
                        <a
                            href={book.affiliateLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-2 text-primary-400 hover:text-primary-300 transition-colors"
                            title="Buy original book"
                        >
                            <span className="hidden sm:inline text-sm font-medium">Get Book</span>
                            <ShoppingBag size={20} />
                        </a>
                    )}
                </div>
            </div>
            <div className="flex-1 relative">
                <InfographicViewer
                    images={viewableImages}
                    title={book.title}
                    isLocked={isLocked}
                />
            </div>
        </div>
    );
};

export default ReadBook;
