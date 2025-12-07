import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';
import logoLight from '../assets/logo_black.png';
import logoDark from '../assets/logo_white.png';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();
    const { theme } = useTheme();
    const { addToast } = useToast();

    React.useEffect(() => {
        document.title = 'Login | GlanceRead';
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await login(email, password);
        if (result.success) {
            addToast('Welcome back!', 'success');
            navigate('/');
        } else {
            addToast(result.message, 'error');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
            <div className="max-w-md w-full space-y-8 bg-surface p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
                <div className="text-center">
                    <Link to="/" className="inline-flex items-center space-x-2 mb-6">
                        <img
                            src={theme === 'dark' ? logoDark : logoLight}
                            alt="GlanceRead Logo"
                            className="h-16 w-auto object-contain"
                        />
                        <span className="text-3xl font-brand tracking-wider transform -skew-x-6 ml-2">
                            <span className="text-accent-500">Glance</span>
                            <span className="text-primary-500">Read</span>
                        </span>
                    </Link>
                    <h2 className="text-3xl font-bold text-slate-900">Welcome back</h2>
                    <p className="mt-2 text-sm text-slate-600">
                        Sign in to access your library
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>

                    <div className="space-y-4">
                        <div>
                            <label htmlFor="email" className="sr-only">Email address</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                className="appearance-none relative block w-full px-3 py-3 border border-slate-300 placeholder-slate-500 text-slate-900 rounded-xl focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">Password</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="appearance-none relative block w-full px-3 py-3 border border-slate-300 placeholder-slate-500 text-slate-900 rounded-xl focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <Button type="submit" variant="primary" className="w-full py-3">
                            Sign in
                        </Button>
                    </div>
                </form>

                <div className="text-center text-sm">
                    <span className="text-slate-600">Don't have an account? </span>
                    <Link to="/register" className="font-medium text-primary-600 hover:text-primary-500">
                        Sign up for free
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
