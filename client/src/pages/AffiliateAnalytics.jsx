import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config';
import { TrendingUp, MousePointerClick, DollarSign, BookOpen, BarChart3, Eye, ShoppingBag, ExternalLink, Star, Target, Award } from 'lucide-react';

const AffiliateAnalytics = () => {
    const [books, setBooks] = useState([]);
    const [analytics, setAnalytics] = useState({});
    const [loading, setLoading] = useState(true);
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [timeRange, setTimeRange] = useState('all'); // 'all', '7d', '30d'

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

    // Calculate click sources
    const clickSources = Object.values(analytics).flatMap(a => a.clicksBySource || [])
        .reduce((acc, item) => {
            const existing = acc.find(x => x._id === item._id);
            if (existing) {
                existing.count += item.count;
            } else {
                acc.push({ ...item });
            }
            return acc;
        }, [])
        .sort((a, b) => b.count - a.count);

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
                    <h1 className="text-4xl font-bold text-text-main mb-2">📊 Affiliate Analytics</h1>
                    <p className="text-text-muted">Track your affiliate link performance and optimize for maximum revenue</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-surface rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-2">
                            <div className="text-text-muted text-sm font-medium">Total Clicks</div>
                            <MousePointerClick className="text-blue-500" size={20} />
                        </div>
                        <div className="text-3xl font-bold text-text-main">{totalClicks.toLocaleString()}</div>
                        <div className="text-xs text-text-muted mt-1">All-time affiliate clicks</div>
                    </div>

                    <div className="bg-surface rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-2">
                            <div className="text-text-muted text-sm font-medium">Books with Links</div>
                            <ShoppingBag className="text-green-500" size={20} />
                        </div>
                        <div className="text-3xl font-bold text-text-main">{booksWithLinks}</div>
                        <div className="text-xs text-text-muted mt-1">Out of {books.length} total books</div>
                    </div>

                    <div className="bg-surface rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-2">
                            <div className="text-text-muted text-sm font-medium">Avg Clicks/Book</div>
                            <BarChart3 className="text-purple-500" size={20} />
                        </div>
                        <div className="text-3xl font-bold text-text-main">{avgClicksPerBook}</div>
                        <div className="text-xs text-text-muted mt-1">Average performance</div>
                    </div>

                    <div className="bg-gradient-to-br from-orange-500 to-pink-600 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                        <div className="flex items-center justify-between mb-2">
                            <div className="text-white text-sm font-medium">Est. Revenue</div>
                            <DollarSign className="text-white" size={20} />
                        </div>
                        <div className="text-3xl font-bold text-white">₹{Math.round(totalRevenue).toLocaleString()}</div>
                        <div className="text-xs text-white/80 mt-1">3% conversion @ 6% commission</div>
                    </div>
                </div>

                {/* Click Sources */}
                {clickSources.length > 0 && (
                    <div className="bg-surface rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm mb-8">
                        <h2 className="text-2xl font-bold text-text-main mb-6 flex items-center gap-2">
                            <Target className="text-primary-500" />
                            Click Source Performance
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {clickSources.map((source, index) => {
                                const percentage = ((source.count / totalClicks) * 100).toFixed(1);
                                return (
                                    <div key={source._id} className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                                        <div className="text-sm text-text-muted mb-1 capitalize flex items-center justify-between">
                                            <span>{source._id.replace(/-/g, ' ')}</span>
                                            {index === 0 && <Award className="text-yellow-500" size={16} />}
                                        </div>
                                        <div className="text-2xl font-bold text-text-main mb-1">
                                            {source.count}
                                        </div>
                                        <div className="text-xs text-text-muted">{percentage}% of total</div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Top Performing Books */}
                <div className="bg-surface rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-text-main flex items-center gap-2">
                            <TrendingUp className="text-primary-500" />
                            Top Performing Books
                        </h2>
                        <Link 
                            to="/admin/upload" 
                            className="text-sm text-primary-500 hover:text-primary-600 font-medium transition-colors"
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
                                        <th className="text-center py-3 px-4 text-sm font-semibold text-text-muted">Link</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {topBooks.slice(0, 15).map((book, index) => {
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
                                                            className="w-12 h-16 object-cover rounded shadow-sm"
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
                                                    <span className="font-semibold text-green-600 dark:text-green-400">₹{estRevenue}</span>
                                                </td>
                                                <td className="py-4 px-4 text-center">
                                                    {book.affiliateLink && (
                                                        <a 
                                                            href={book.affiliateLink}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center gap-1 text-blue-500 hover:text-blue-600 text-sm transition-colors"
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

                {/* Revenue Projection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800">
                        <h3 className="text-lg font-bold text-text-main mb-4 flex items-center gap-2">
                            <DollarSign className="text-blue-600" />
                            Revenue Scaling Potential
                        </h3>
                        <div className="space-y-3">
                            {[
                                { users: '10K', clicks: 500, revenue: 540 },
                                { users: '100K', clicks: 5000, revenue: 5400 },
                                { users: '1M', clicks: 50000, revenue: 54000 }
                            ].map((item) => (
                                <div key={item.users} className="flex items-center justify-between bg-white/50 dark:bg-slate-800/50 rounded-lg p-3">
                                    <div>
                                        <div className="font-semibold text-text-main">{item.users} Users/month</div>
                                        <div className="text-xs text-text-muted">{item.clicks.toLocaleString()} clicks • 3% conv.</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-bold text-green-600 dark:text-green-400">₹{item.revenue.toLocaleString()}/mo</div>
                                        <div className="text-xs text-text-muted">₹{(item.revenue * 12 / 100000).toFixed(1)}L/year</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-6 border border-purple-200 dark:border-purple-800">
                        <h3 className="text-lg font-bold text-text-main mb-4 flex items-center gap-2">
                            <Target className="text-purple-600" />
                            Optimization Tips
                        </h3>
                        <ul className="space-y-2 text-sm text-text-muted">
                            <li className="flex items-start gap-2">
                                <span className="text-green-500 mt-0.5">✓</span>
                                <span><strong>Focus on high-ticket books:</strong> ₹1000+ items earn 10× more per sale</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-green-500 mt-0.5">✓</span>
                                <span><strong>Best CTA placement:</strong> End-of-book popup converts highest</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-green-500 mt-0.5">✓</span>
                                <span><strong>Add urgency:</strong> "Limited time 40% OFF" increases clicks 30%</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-green-500 mt-0.5">✓</span>
                                <span><strong>Test categories:</strong> Self-help & business books perform best</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Action Items */}
                <div className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-2xl p-6 border border-orange-200 dark:border-orange-800">
                    <h3 className="text-lg font-bold text-text-main mb-3 flex items-center gap-2">
                        <Star className="text-orange-600" fill="currentColor" />
                        Quick Wins to Boost Revenue
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white/50 dark:bg-slate-800/50 rounded-lg p-4">
                            <div className="font-semibold text-text-main mb-2">1. Add More Links</div>
                            <div className="text-sm text-text-muted mb-3">
                                Only {booksWithLinks}/{books.length} books have affiliate links
                            </div>
                            <Link 
                                to="/admin/upload"
                                className="text-xs bg-orange-500 text-white px-3 py-1.5 rounded-lg hover:bg-orange-600 transition-colors inline-block"
                            >
                                Add Links Now
                            </Link>
                        </div>
                        <div className="bg-white/50 dark:bg-slate-800/50 rounded-lg p-4">
                            <div className="font-semibold text-text-main mb-2">2. Join More Programs</div>
                            <div className="text-sm text-text-muted mb-3">
                                Sign up for Flipkart & Audible for 2-3× more commissions
                            </div>
                            <a 
                                href="https://affiliate.flipkart.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs bg-orange-500 text-white px-3 py-1.5 rounded-lg hover:bg-orange-600 transition-colors inline-flex items-center gap-1"
                            >
                                Apply Now <ExternalLink size={12} />
                            </a>
                        </div>
                        <div className="bg-white/50 dark:bg-slate-800/50 rounded-lg p-4">
                            <div className="font-semibold text-text-main mb-2">3. A/B Test CTAs</div>
                            <div className="text-sm text-text-muted mb-3">
                                Test different button text and placement for higher conversion
                            </div>
                            <button className="text-xs bg-orange-500 text-white px-3 py-1.5 rounded-lg hover:bg-orange-600 transition-colors">
                                View Guide
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AffiliateAnalytics;
