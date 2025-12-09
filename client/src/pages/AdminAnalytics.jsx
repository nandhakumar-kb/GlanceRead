import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config';
import { TrendingUp, MousePointerClick, DollarSign, BookOpen, BarChart3, Eye, ShoppingBag } from 'lucide-react';

const AdminAnalytics = () => {
    const [books, setBooks] = useState([]);
    const [analytics, setAnalytics] = useState({});
    const [loading, setLoading] = useState(true);
    const [totalRevenue, setTotalRevenue] = useState(0);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            
            // Get all books
            const booksRes = await axios.get(`${API_URL}/api/books`);
            const booksData = booksRes.data;
            
            // Get analytics for books with affiliate links
            const analyticsPromises = booksData
                .filter(book => book.affiliateLink)
                .map(async (book) => {
                    try {
                        const res = await axios.get(
                            `${API_URL}/api/books/${book._id}/affiliate-analytics`,
                            { headers: { 'x-auth-token': token } }
                        );
                        return { bookId: book._id, data: res.data };
                    } catch (err) {
                        return { bookId: book._id, data: null };
                    }
                });

            const analyticsResults = await Promise.all(analyticsPromises);
            const analyticsMap = {};
            analyticsResults.forEach(result => {
                if (result.data) {
                    analyticsMap[result.bookId] = result.data;
                }
            });

            setBooks(booksData);
            setAnalytics(analyticsMap);

            // Calculate estimated revenue (assuming 3% conversion, avg ₹600 book, 6% commission)
            const totalClicks = Object.values(analyticsMap).reduce((sum, a) => sum + (a.totalClicks || 0), 0);
            const estimatedPurchases = totalClicks * 0.03;
            const estimatedRevenue = estimatedPurchases * 600 * 0.06;
            setTotalRevenue(estimatedRevenue);

            setLoading(false);
        } catch (err) {
            console.error('Failed to fetch analytics', err);
            setLoading(false);
        }
    };

    // Sort books by click count
    const topBooks = books
        .filter(book => book.affiliateLink && analytics[book._id])
        .map(book => ({
            ...book,
            clickCount: analytics[book._id]?.totalClicks || 0
        }))
        .sort((a, b) => b.clickCount - a.clickCount);

    const totalClicks = Object.values(analytics).reduce((sum, a) => sum + (a.totalClicks || 0), 0);
    const booksWithLinks = books.filter(b => b.affiliateLink).length;
    const avgClicksPerBook = booksWithLinks > 0 ? (totalClicks / booksWithLinks).toFixed(1) : 0;

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="text-xl text-text-main">Loading analytics...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-text-main mb-2">Affiliate Analytics</h1>
                    <p className="text-text-muted">Track your affiliate link performance and revenue</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-surface rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                            <div className="text-text-muted text-sm font-medium">Total Clicks</div>
                            <MousePointerClick className="text-blue-500" size={20} />
                        </div>
                        <div className="text-3xl font-bold text-text-main">{totalClicks.toLocaleString()}</div>
                        <div className="text-xs text-text-muted mt-1">All-time affiliate clicks</div>
                    </div>

                    <div className="bg-surface rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                            <div className="text-text-muted text-sm font-medium">Books with Links</div>
                            <ShoppingBag className="text-green-500" size={20} />
                        </div>
                        <div className="text-3xl font-bold text-text-main">{booksWithLinks}</div>
                        <div className="text-xs text-text-muted mt-1">Out of {books.length} total books</div>
                    </div>

                    <div className="bg-surface rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                            <div className="text-text-muted text-sm font-medium">Avg Clicks/Book</div>
                            <BarChart3 className="text-purple-500" size={20} />
                        </div>
                        <div className="text-3xl font-bold text-text-main">{avgClicksPerBook}</div>
                        <div className="text-xs text-text-muted mt-1">Average performance</div>
                    </div>

                    <div className="bg-gradient-to-br from-orange-500 to-pink-600 rounded-2xl p-6 shadow-lg">
                        <div className="flex items-center justify-between mb-2">
                            <div className="text-white text-sm font-medium">Est. Revenue</div>
                            <DollarSign className="text-white" size={20} />
                        </div>
                        <div className="text-3xl font-bold text-white">₹{Math.round(totalRevenue).toLocaleString()}</div>
                        <div className="text-xs text-white/80 mt-1">Based on 3% conversion</div>
                    </div>
                </div>

                {/* Top Performing Books */}
                <div className="bg-surface rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-text-main flex items-center gap-2">
                            <TrendingUp className="text-primary-500" />
                            Top Performing Books
                        </h2>
                        <Link 
                            to="/admin/upload" 
                            className="text-sm text-primary-500 hover:text-primary-600 font-medium"
                        >
                            Manage Books →
                        </Link>
                    </div>

                    {topBooks.length === 0 ? (
                        <div className="text-center py-12">
                            <BookOpen size={48} className="mx-auto text-slate-400 mb-4" />
                            <p className="text-text-muted mb-4">No affiliate links added yet</p>
                            <Link 
                                to="/admin/upload" 
                                className="inline-block bg-primary-500 text-white px-6 py-2 rounded-lg hover:bg-primary-600 transition-colors"
                            >
                                Add Affiliate Links
                            </Link>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-slate-200 dark:border-slate-700">
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-text-muted">Rank</th>
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-text-muted">Book</th>
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-text-muted">Category</th>
                                        <th className="text-right py-3 px-4 text-sm font-semibold text-text-muted">Clicks</th>
                                        <th className="text-right py-3 px-4 text-sm font-semibold text-text-muted">Est. Sales</th>
                                        <th className="text-right py-3 px-4 text-sm font-semibold text-text-muted">Est. Revenue</th>
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-text-muted">Link</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {topBooks.slice(0, 10).map((book, index) => {
                                        const clicks = book.clickCount;
                                        const estSales = (clicks * 0.03).toFixed(1);
                                        const estRevenue = (clicks * 0.03 * 600 * 0.06).toFixed(0);
                                        
                                        return (
                                            <tr 
                                                key={book._id} 
                                                className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                                            >
                                                <td className="py-4 px-4">
                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                                                        index === 0 ? 'bg-yellow-100 text-yellow-700' :
                                                        index === 1 ? 'bg-slate-100 text-slate-700' :
                                                        index === 2 ? 'bg-orange-100 text-orange-700' :
                                                        'bg-slate-50 text-slate-600'
                                                    }`}>
                                                        {index + 1}
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <div className="flex items-center space-x-3">
                                                        <img 
                                                            src={book.coverImage} 
                                                            alt={book.title}
                                                            className="w-12 h-16 object-cover rounded"
                                                        />
                                                        <div>
                                                            <div className="font-semibold text-text-main line-clamp-1">
                                                                {book.title}
                                                            </div>
                                                            <div className="text-sm text-text-muted">
                                                                {book.author}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <span className="text-sm text-text-muted">{book.category}</span>
                                                </td>
                                                <td className="py-4 px-4 text-right">
                                                    <span className="font-bold text-text-main">{clicks}</span>
                                                </td>
                                                <td className="py-4 px-4 text-right">
                                                    <span className="text-text-muted">{estSales}</span>
                                                </td>
                                                <td className="py-4 px-4 text-right">
                                                    <span className="font-semibold text-green-600">₹{estRevenue}</span>
                                                </td>
                                                <td className="py-4 px-4">
                                                    {book.affiliateLink && (
                                                        <a 
                                                            href={book.affiliateLink}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-blue-500 hover:text-blue-600 text-sm flex items-center gap-1"
                                                        >
                                                            <Eye size={14} />
                                                            View
                                                        </a>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Click Source Distribution */}
                {topBooks.length > 0 && analytics[topBooks[0]._id]?.clicksBySource && (
                    <div className="bg-surface rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
                        <h2 className="text-2xl font-bold text-text-main mb-6">Click Sources</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {Object.values(analytics).flatMap(a => a.clicksBySource || [])
                                .reduce((acc, item) => {
                                    const existing = acc.find(x => x._id === item._id);
                                    if (existing) {
                                        existing.count += item.count;
                                    } else {
                                        acc.push({ ...item });
                                    }
                                    return acc;
                                }, [])
                                .sort((a, b) => b.count - a.count)
                                .map(source => (
                                    <div key={source._id} className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4">
                                        <div className="text-sm text-text-muted mb-1 capitalize">
                                            {source._id.replace(/-/g, ' ')}
                                        </div>
                                        <div className="text-2xl font-bold text-text-main">
                                            {source.count}
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                )}

                {/* Tips */}
                <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800">
                    <h3 className="text-lg font-bold text-text-main mb-3">💡 Tips to Boost Affiliate Revenue</h3>
                    <ul className="space-y-2 text-sm text-text-muted">
                        <li className="flex items-start">
                            <span className="mr-2">•</span>
                            <span>Add affiliate links to your most popular books first</span>
                        </li>
                        <li className="flex items-start">
                            <span className="mr-2">•</span>
                            <span>Focus on high-ticket items (₹1000+ books) for better commissions</span>
                        </li>
                        <li className="flex items-start">
                            <span className="mr-2">•</span>
                            <span>Test different CTA placements - floating button performs best after page 2</span>
                        </li>
                        <li className="flex items-start">
                            <span className="mr-2">•</span>
                            <span>Join Amazon Associates India for 4-8% commission on book sales</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default AdminAnalytics;
