import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Lock, ArrowLeft, ShoppingBag } from 'lucide-react';
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

    const isLocked = book.isPremium && (!isAuthenticated || user?.subscriptionStatus !== 'active');

    if (isLocked) {
        return (
            <div className="min-h-screen pt-20 pb-12 px-4 bg-slate-50 flex flex-col items-center justify-center text-center">
                <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg border border-slate-100 relative overflow-hidden">
                    {/* Blurry Background Preview (Simulated) */}
                    <div className="absolute inset-0 bg-cover bg-center opacity-10 blur-sm" style={{ backgroundImage: `url(${book.coverImage})` }}></div>

                    <div className="relative z-10">
                        <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Lock size={32} className="text-slate-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">Premium Content</h2>
                        <p className="text-slate-600 mb-8">
                            Subscribe to GlanceRead Premium to unlock this infographic and hundreds more.
                        </p>
                        <Link to="/pricing" className="block w-full mb-4">
                            <Button variant="accent" className="w-full">
                                Subscribe to Unlock
                            </Button>
                        </Link>
                        <Link to="/" className="text-sm text-slate-500 hover:text-slate-900">
                            Back to Library
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen flex flex-col bg-slate-900">
            <div className="h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-4">
                <Link to="/" className="text-slate-400 hover:text-white flex items-center space-x-2">
                    <ArrowLeft size={20} />
                    <span>Back</span>
                </Link>
                <h1 className="text-white font-medium truncate max-w-md">{book.title}</h1>
                {book.affiliateLink ? (
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
                ) : (
                    <div className="w-16"></div>
                )}
            </div>
            <div className="flex-1 relative">
                <InfographicViewer
                    imageSrc={book.infographicImage}
                    images={book.infographicImages}
                    title={book.title}
                />
            </div>
        </div>
    );
};

export default ReadBook;
