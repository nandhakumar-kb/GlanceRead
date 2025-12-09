import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';
import logoLight from '../assets/logo_black.png';
import logoDark from '../assets/logo_white.png';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();
    const { theme } = useTheme();
    const { addToast } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    React.useEffect(() => {
        document.title = 'Login | GlanceRead';
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const result = await login(email, password);
        setIsLoading(false);
        if (result.success) {
            addToast('Welcome back!', 'success');
            navigate('/');
        } else {
            addToast(result.message, 'error');
        }
    };

    return (
        <div className="min-h-screen flex bg-background transition-colors duration-300">
            {/* Left Side - Form */}
            <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24 relative z-10">
                <div className="mx-auto w-full max-w-sm lg:w-96">
                    <div className="mb-10">
                        <Link to="/" className="inline-flex items-center space-x-2 mb-8 group">
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
                        <h2 className="text-4xl font-bold text-text-main mb-3">Welcome back</h2>
                        <p className="text-text-muted">
                            Start your day with a 5-minute summary.
                        </p>
                    </div>

                    <form className="space-y-6" onSubmit={handleSubmit}>
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
                                    autoComplete="current-password"
                                    required
                                    className="appearance-none block w-full px-4 py-3 border border-slate-300 dark:border-slate-700 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-slate-900 text-text-main sm:text-sm transition-all duration-200"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-text-muted">
                                    Remember me
                                </label>
                            </div>

                            <div className="text-sm">
                                <a href="#" className="font-medium text-primary-600 hover:text-primary-500">
                                    Forgot password?
                                </a>
                            </div>
                        </div>

                        <div>
                            <Button
                                type="submit"
                                variant="primary"
                                className="w-full py-3 flex justify-center items-center gap-2 group shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Signing in...' : 'Sign in'}
                                {!isLoading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                            </Button>
                        </div>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-sm text-text-muted">
                            Don't have an account?{' '}
                            <Link to="/register" className="font-medium text-primary-600 hover:text-primary-500 transition-colors">
                                Create free account
                            </Link>
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Side - Decorative */}
            <div className="hidden lg:block relative flex-1 bg-slate-900">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-900 via-slate-900 to-black opacity-90"></div>
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')] bg-cover bg-center mix-blend-overlay opacity-50"></div>

                <div className="relative h-full flex flex-col justify-end p-16 text-white">
                    <div className="mb-8">
                        <div className="flex gap-1 mb-4">
                            {[...Array(5)].map((_, i) => (
                                <svg key={i} className="w-5 h-5 text-yellow-500 fill-current" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                            ))}
                        </div>
                        <blockquote className="text-2xl font-medium leading-relaxed mb-6">
                            "GlanceRead has completely transformed how I consume information. The 5-minute summaries are a game changer for my busy schedule."
                        </blockquote>
                        <div className="flex items-center gap-4">
                            <img
                                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                alt="User"
                                className="w-12 h-12 rounded-full border-2 border-white/20"
                            />
                            <div>
                                <div className="font-bold">Sarah Chen</div>
                                <div className="text-white/60 text-sm">Product Designer</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
