import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Check, X, Shield, Star, Trash2 } from 'lucide-react';
import { API_URL } from '../config';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth(); // Current logged in admin
    const { showToast } = useToast();

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/users`);
            setUsers(res.data);
            setLoading(false);
        } catch (err) {
            showToast('Failed to fetch users', 'error');
            setLoading(false);
        }
    };

    const deleteUser = async (userId) => {
        if (!window.confirm("Are you sure you want to delete this user? This cannot be undone.")) return;

        try {
            await axios.delete(`${API_URL}/api/users/${userId}`);
            setUsers(users.filter(u => u._id !== userId));
            showToast('User deleted successfully', 'success');
        } catch (err) {
            showToast(err.response?.data?.msg || 'Failed to delete user', 'error');
        }
    };

    const toggleSubscription = async (userId, currentStatus) => {
        const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
        try {
            await axios.put(`${API_URL}/api/users/${userId}/subscription`, { status: newStatus });

            // Optimistic update
            setUsers(users.map(u =>
                u._id === userId ? { ...u, subscriptionStatus: newStatus } : u
            ));

            showToast(`User set to ${newStatus}`, 'success');
        } catch (err) {
            showToast('Failed to update status', 'error');
        }
    };

    if (loading) return <div className="p-8 text-center text-slate-500">Loading users...</div>;

    return (
        <div className="min-h-screen pt-24 px-4 bg-slate-50 dark:bg-black transition-colors duration-300">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">User Management</h1>
                    <div className="bg-white dark:bg-gray-900 px-4 py-2 rounded-lg shadow border border-slate-200 dark:border-slate-800">
                        <span className="text-slate-500 dark:text-slate-400 font-medium">Total Users: </span>
                        <span className="font-bold text-slate-900 dark:text-white">{users.length}</span>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-800">
                                <tr>
                                    <th className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-200">User</th>
                                    <th className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-200">Email</th>
                                    <th className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-200">Role</th>
                                    <th className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-200">Txn ID</th>
                                    <th className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-200">Status</th>
                                    <th className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-200">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {users.map((u) => (
                                    <tr key={u._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-slate-900 dark:text-white">{u.username}</div>
                                            <div className="text-xs text-slate-400">ID: {u._id.slice(-6)}</div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{u.email}</td>
                                        <td className="px-6 py-4">
                                            {u.role === 'admin' ? (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                                                    <Shield size={12} className="mr-1" /> Admin
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300">
                                                    User
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 font-mono text-sm text-slate-600 dark:text-slate-400">
                                            {u.transactionId || '-'}
                                        </td>
                                        <td className="px-6 py-4">
                                            {u.subscriptionStatus === 'active' ? (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                                                    <Star size={12} className="mr-1 fill-current" /> Premium
                                                </span>
                                            ) : (
                                                <span className="text-slate-400 text-sm">Free</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            {u.role !== 'admin' && (
                                                <div className="flex items-center space-x-2">
                                                    <button
                                                        onClick={() => toggleSubscription(u._id, u.subscriptionStatus)}
                                                        className={`p-2 rounded-lg transition-colors ${u.subscriptionStatus === 'active'
                                                            ? 'text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
                                                            : 'text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20'
                                                            }`}
                                                        title={u.subscriptionStatus === 'active' ? "Revoke Premium" : "Grant Premium"}
                                                    >
                                                        {u.subscriptionStatus === 'active' ? <X size={20} /> : <Check size={20} />}
                                                    </button>

                                                    <button
                                                        onClick={() => deleteUser(u._id)}
                                                        className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                                        title="Delete User"
                                                    >
                                                        <Trash2 size={20} />
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminUsers;
