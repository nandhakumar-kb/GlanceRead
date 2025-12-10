import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { BookOpen, Flame, Star, Clock } from 'lucide-react';
import { API_URL } from '../config';

const Dashboard = () => {
    const { user: contextUser } = useAuth();
    const [user, setUser] = useState(contextUser);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    const res = await axios.get(`${API_URL}/api/auth/user`, {
                        headers: { 'x-auth-token': token }
                    });
                    setUser(res.data);
                }
            } catch (err) {
                // Failed to refresh stats
            }
        };
        fetchUserData();
    }, []);

    // Helper to format minutes
    const formatTime = (minutes) => {
        if (!minutes) return '0m';
        if (minutes < 60) return `${Math.floor(minutes)}m`;
        const hrs = Math.floor(minutes / 60);
        const mins = Math.floor(minutes % 60);
        return `${hrs}h ${mins}m`;
    };

    const booksReadCount = user?.readingProgress?.filter(p => p.progress >= 90).length || 0;

    const stats = [
        { label: 'Books Read', value: booksReadCount.toString(), icon: BookOpen, color: 'text-blue-500' },
        { label: 'Current Streak', value: '1 Day', icon: Flame, color: 'text-orange-500' },
        { label: 'Saved Books', value: user?.savedBooks?.length || 0, icon: Star, color: 'text-yellow-500' },
        { label: 'Time Read', value: formatTime(user?.totalReadTime), icon: Clock, color: 'text-purple-500' },
    ];

    return (
        <div className="min-h-screen pt-24 px-4 bg-slate-50 dark:bg-black transition-colors duration-300">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                        Welcome back, {user?.username}!
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 mt-2">
                        Here's your reading overview.
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {stats.map((stat, index) => (
                        <div key={index} className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`p-3 bg-slate-50 dark:bg-slate-800 rounded-xl ${stat.color}`}>
                                    <stat.icon size={24} />
                                </div>
                                <span className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</span>
                            </div>
                            <h3 className="text-slate-600 dark:text-slate-400 font-medium">{stat.label}</h3>
                        </div>
                    ))}
                </div>

                {/* Badges Section */}
                <div className="mb-12">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Your Achievements</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {user?.badges?.length > 0 ? (
                            user.badges.map((badge, index) => (
                                <div key={index} className="bg-white dark:bg-gray-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center gap-4 shadow-sm">
                                    <span className="text-3xl">{badge.icon}</span>
                                    <div>
                                        <p className="font-bold text-slate-900 dark:text-white">{badge.name}</p>
                                        <p className="text-xs text-slate-500">Earned {new Date(badge.date).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-4 text-center py-8 text-slate-500 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
                                <p>No badges yet. Read your first book to unlock one!</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Account Status & Referral Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Account Status */}
                    <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm h-full">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Account Status</h2>
                        <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                            <div>
                                <p className="font-semibold text-slate-900 dark:text-white">Membership Plan</p>
                                <p className="text-sm text-slate-600 dark:text-slate-400 capitalize">
                                    {user?.subscriptionStatus === 'active' ? 'Premium Member 🌟' : 'Free Plan'}
                                </p>
                            </div>
                            {user?.subscriptionStatus !== 'active' && (
                                <button className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-500 transition-colors">
                                    Upgrade Now
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Referral Section (Placeholder) */}
                    <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-8 shadow-lg text-white h-full relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-3 opacity-10">
                            <Flame size={120} />
                        </div>
                        <h2 className="text-xl font-bold mb-2 relative z-10">Refer & Earn</h2>
                        <p className="text-indigo-100 mb-6 text-sm relative z-10">
                            Invite friends and get 1 month of Premium for free when they sign up!
                        </p>

                        <div className="bg-white/10 backdrop-blur-sm p-1 rounded-xl flex items-center border border-white/20 relative z-10">
                            <code className="flex-1 px-3 text-sm font-mono text-indigo-100 truncate">
                                glanceread.com/ref/{user?.username || 'user'}
                            </code>
                            <button
                                onClick={() => alert('Link copied!')}
                                className="px-3 py-1.5 bg-white text-indigo-600 rounded-lg text-xs font-bold hover:bg-indigo-50 transition-colors"
                            >
                                Copy
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
