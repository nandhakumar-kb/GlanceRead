import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Button from '../components/common/Button';
import { API_URL } from '../config';

const Settings = () => {
    const { user, login } = useAuth(); // Assuming login or a setUser method can update context
    // Actually AuthContext might not expose a direct "updateUser" method easily.
    // We can just rely on the next refresh or manually update if we exposed setUser.
    // For MVP, just update backend and show toast.

    const [formData, setFormData] = useState({
        username: user?.username || '',
        password: '',
        confirmPassword: ''
    });

    const { showToast } = useToast();

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();

        if (formData.password && formData.password !== formData.confirmPassword) {
            return showToast('Passwords do not match', 'error');
        }

        try {
            const token = localStorage.getItem('token');
            const res = await axios.put(`${API_URL}/api/users/profile`,
                { username: formData.username, password: formData.password },
                { headers: { 'x-auth-token': token } }
            );

            showToast('Profile Updated Successfully', 'success');
            // Ideally update context here, but reloading page handles it for MVP
            setTimeout(() => window.location.reload(), 1000);

        } catch (err) {
            showToast('Update Failed', 'error');
        }
    };

    return (
        <div className="min-h-screen pt-24 px-4 bg-slate-50 dark:bg-black transition-colors duration-300">
            <div className="max-w-md mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800 p-8">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Account Settings</h1>

                <form onSubmit={onSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Username
                        </label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={onChange}
                            className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            New Password (Optional)
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={onChange}
                            placeholder="Leave blank to keep current"
                            className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Confirm New Password
                        </label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={onChange}
                            className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                        />
                    </div>

                    <Button variant="primary" className="w-full" type="submit">
                        Save Changes
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default Settings;
