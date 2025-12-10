import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';
import logoLight from '../assets/logo_black.png';
import logoDark from '../assets/logo_white.png';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';
import { ArrowRight, Check } from 'lucide-react';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();
    const { theme } = useTheme();
    const { addToast } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    React.useEffect(() => {
        document.title = 'Join | GlanceRead';
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const result = await register(username, email, password);
        setIsLoading(false);
        if (result.success) {
            addToast('Account created successfully!', 'success');
            navigate('/');
        } else {
            addToast(result.message, 'error');
        }
    };

    const benefits = [
        "Unlimited summary access",
        "Personalized recommendations",
        "Audio summaries (Beta)",
        "Sync across devices"
    ];

    return (
        <div className="min-h-screen flex items-center justify-center bg-background transition-colors duration-300 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 z-0">
                <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl opacity-50 animate-blob"></div>
                <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
            </div>

            {/* Form Container */}
            <div className="w-full max-w-md p-8 relative z-10">
                <div className="bg-surface/50 backdrop-blur-xl rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-2xl">
                    <div className="mb-10 text-center">
                        <Link to="/" className="inline-flex items-center space-x-2 mb-8 group justify-center w-full">
                            <div className="relative">
                                <div className="absolute -inset-1 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full blur opacity-20 group-hover:opacity-40 transition duration-200"></div>
                                <img
                                    src={theme === 'dark' ? logoDark : logoLight}
                                    alt="GlanceRead Logo"
                                    className="h-10 w-auto object-contain relative"
                                />
                            </div>
                            <span className="text-2xl font-brand tracking-wider transform -skew-x-6 ml-2">
                                <span className="text-accent-500">Glance</span>
                                <span className="text-primary-500">Read</span>
                            </span>
                        </Link>
                        <h2 className="text-3xl font-bold text-text-main mb-3">Create your account</h2>
                        <p className="text-text-muted">
                            Join thousands of smart readers today.
                        </p>
                    </div>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-text-main mb-1">
                                Username
                            </label>
                            <div className="mt-1">
                                <input
                                    id="username"
                                    name="username"
                                    type="text"
                                    required
                                    className="appearance-none block w-full px-4 py-3 border border-slate-300 dark:border-slate-700 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-slate-900 text-text-main sm:text-sm transition-all duration-200"
                                    placeholder="johndoe"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-text-main mb-1">
                                Email address
                            </label>
                            <div className="mt-1">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="appearance-none block w-full px-4 py-3 border border-slate-300 dark:border-slate-700 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-slate-900 text-text-main sm:text-sm transition-all duration-200"
                                    placeholder="john@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-text-main mb-1">
                                Password
                            </label>
                            <div className="mt-1">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="new-password"
                                    required
                                    className="appearance-none block w-full px-4 py-3 border border-slate-300 dark:border-slate-700 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-slate-900 text-text-main sm:text-sm transition-all duration-200"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                            <p className="mt-2 text-xs text-text-muted">
                                Must be at least 8 characters long.
                            </p>
                        </div>

                        <div>
                            <Button
                                type="submit"
                                variant="primary"
                                className="w-full py-3 flex justify-center items-center gap-2 group shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Creating Account...' : 'Get Started'}
                                {!isLoading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                            </Button>
                        </div>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-sm text-text-muted">
                            Already have an account?{' '}
                            <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500 transition-colors">
                                Sign in instead
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
