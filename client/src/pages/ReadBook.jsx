import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Lock, ArrowLeft, ShoppingBag, Download, Star, TrendingUp, ExternalLink } from 'lucide-react';
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
    const [currentPage, setCurrentPage] = useState(0);
    const [showAffiliateCTA, setShowAffiliateCTA] = useState(false);
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

    // Show floating CTA after viewing 2+ pages
    useEffect(() => {
        if (currentPage >= 2 && book?.affiliateLink) {
            setShowAffiliateCTA(true);
        }
    }, [currentPage, book]);

    const handleAffiliateClick = async (source) => {
        if (!book?.affiliateLink) return;
        
        // Track click for analytics
        try {
            await axios.post(`${API_URL}/api/books/${id}/affiliate-click`, {
                source, // 'floating-button', 'header', 'end-book'
                userId: user?._id
            });
        } catch (err) {
            console.error('Tracking failed', err);
        }
        
        window.open(book.affiliateLink, '_blank');
    };

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
                        <button
                            onClick={() => handleAffiliateClick('header')}
                            className="flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-pink-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all font-medium"
                            title="Buy original book"
                        >
                            <ShoppingBag size={18} />
                            <span className="hidden sm:inline text-sm">Buy Book</span>
                        </button>
                    )}
                </div>
            </div>
            <div className="flex-1 relative">
                <InfographicViewer
                    images={viewableImages}
                    title={book.title}
                    isLocked={isLocked}
                    onPageChange={setCurrentPage}
                />

                {/* Floating Affiliate CTA - Shows after 2 pages */}
                {showAffiliateCTA && book.affiliateLink && (
                    <div className="fixed bottom-6 right-6 z-50 animate-bounce">
                        <button
                            onClick={() => handleAffiliateClick('floating-button')}
                            className="bg-gradient-to-r from-orange-500 to-pink-600 text-white px-6 py-3 rounded-full shadow-2xl hover:shadow-orange-500/50 transition-all font-bold flex items-center space-x-2 group"
                        >
                            <ShoppingBag size={20} className="group-hover:scale-110 transition-transform" />
                            <div className="text-left">
                                <div className="text-sm">📚 Get Full Book</div>
                                <div className="text-xs opacity-90">Limited Offer!</div>
                            </div>
                        </button>
                    </div>
                )}

                {/* End-of-Book CTA - Shows when reaching last page */}
                {currentPage >= viewableImages.length - 1 && book.affiliateLink && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 flex items-center justify-center p-4">
                        <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 max-w-md w-full shadow-2xl">
                            <div className="text-center">
                                <div className="text-4xl mb-4">🎉</div>
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                                    You've Finished the Summary!
                                </h3>
                                <p className="text-slate-600 dark:text-slate-400 mb-6">
                                    Want to dive deeper? Get the complete book and unlock all the insights.
                                </p>
                                
                                <div className="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-4 mb-6">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-semibold text-orange-700 dark:text-orange-400">Full Book Available</span>
                                        <div className="flex items-center space-x-1 text-orange-600">
                                            <Star size={14} fill="currentColor" />
                                            <span className="text-xs font-bold">4.5/5</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-orange-600 dark:text-orange-400">2,341+ readers purchased</span>
                                        <TrendingUp size={14} className="text-orange-600" />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <button
                                        onClick={() => handleAffiliateClick('end-book-popup')}
                                        className="w-full bg-gradient-to-r from-orange-500 to-pink-600 text-white px-6 py-3 rounded-lg font-bold hover:shadow-lg transition-all flex items-center justify-center space-x-2"
                                    >
                                        <ShoppingBag size={20} />
                                        <span>Get Full Book Now</span>
                                        <ExternalLink size={16} />
                                    </button>
                                    <button
                                        onClick={() => setCurrentPage(0)}
                                        className="w-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-6 py-2 rounded-lg font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition-all"
                                    >
                                        Read Again
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReadBook;
