import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../config';
import { Users, CreditCard, TrendingUp, DollarSign, Activity, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminAnalytics = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        premiumUsers: 0,
        revenue: 0,
        recentUsers: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(`${API_URL}/api/users`, {
                    headers: { 'x-auth-token': token }
                });

                const users = res.data;
                const premium = users.filter(u => u.subscriptionStatus === 'active').length;
                // Mock revenue calc: 499 for annual, 49 for monthly. 
                // In real app, sum actual transaction amounts.
                const revenue = premium * 499;

                setStats({
                    totalUsers: users.length,
                    premiumUsers: premium,
                    revenue: revenue,
                    recentUsers: users.slice(0, 5)
                });
            } catch (err) {
                // Failed to fetch analytics
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, []);

    const statCards = [
        { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
        { label: 'Premium Subscribers', value: stats.premiumUsers, icon: CreditCard, color: 'text-purple-600', bg: 'bg-purple-100' },
        { label: 'Est. Revenue', value: `₹${stats.revenue}`, icon: DollarSign, color: 'text-green-600', bg: 'bg-green-100' },
        { label: 'Conversion Rate', value: `${((stats.premiumUsers / (stats.totalUsers || 1)) * 100).toFixed(1)}%`, icon: TrendingUp, color: 'text-orange-600', bg: 'bg-orange-100' },
    ];

    if (loading) return <div className="min-h-screen pt-24 flex justify-center text-text-main">Loading Analytics...</div>;

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-black transition-colors duration-300">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Activity className="text-primary-500" />
                        Analytics Dashboard
                    </h1>
                    <span className="text-sm text-slate-500 bg-white dark:bg-slate-900 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-800">
                        Live Data
                    </span>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {statCards.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className={`p-3 rounded-xl ${stat.bg}`}>
                                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                                </div>
                            </div>
                            <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">{stat.value}</h3>
                            <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
                        </motion.div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Recent Users Table */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Recent Signups</h2>
                            <button className="text-sm text-primary-500 font-medium hover:text-primary-600">View All</button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 dark:bg-slate-800/50">
                                    <tr>
                                        <th className="p-4 text-xs font-bold text-slate-500 uppercase">User</th>
                                        <th className="p-4 text-xs font-bold text-slate-500 uppercase">Status</th>
                                        <th className="p-4 text-xs font-bold text-slate-500 uppercase">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {stats.recentUsers.map((user) => (
                                        <tr key={user._id}>
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-xs">
                                                        {user.username.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-slate-900 dark:text-white text-sm">{user.username}</p>
                                                        <p className="text-xs text-slate-500">{user.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-bold ${user.subscriptionStatus === 'active'
                                                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                                        : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
                                                    }`}>
                                                    {user.subscriptionStatus === 'active' ? 'Premium' : 'Free'}
                                                </span>
                                            </td>
                                            <td className="p-4 text-sm text-slate-500">
                                                {new Date(user.createdAt).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Growth Chart Placeholder (Since Recharts might be missing) */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 flex flex-col justify-center items-center text-center">
                        <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-4">
                            <TrendingUp className="w-8 h-8 text-blue-500" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Growth Charts Coming Soon</h3>
                        <p className="text-slate-500 max-w-sm">
                            Detailed visual charts for user acquisition and revenue retention will be available in the next update.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminAnalytics;
