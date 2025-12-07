import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Heart, Send } from 'lucide-react';
import logoLight from '../../assets/logo_black.png';
import logoDark from '../../assets/logo_white.png';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import Button from './Button';

const Footer = () => {
    const { theme } = useTheme();
    const { addToast } = useToast();

    const footerLinks = {
        Product: [
            { name: 'Library', path: '/' },
            { name: 'Pricing', path: '/pricing' },
            { name: 'Features', path: '#' },
            { name: 'FAQ', path: '#' },
        ],
        Legal: [
            { name: 'Privacy Policy', path: '#' },
            { name: 'Terms of Service', path: '#' },
            { name: 'Cookie Policy', path: '#' },
        ],
    };

    return (
        <footer className="relative bg-background pt-20 pb-10 transition-colors duration-300 overflow-hidden">
            {/* Premium Gradient Top Border */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-800 to-transparent" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand Column */}
                    <div className="space-y-6">
                        <Link to="/" className="flex items-center space-x-2 group w-fit">
                            <img
                                src={theme === 'dark' ? logoDark : logoLight}
                                alt="GlanceRead Logo"
                                className="h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                            />
                            <span className="text-2xl font-brand tracking-wider transform -skew-x-6 ml-2">
                                <span className="text-accent-500">Glance</span>
                                <span className="text-primary-500">Read</span>
                            </span>
                        </Link>
                        <p className="text-text-muted text-sm leading-relaxed max-w-xs">
                            Transforming heavy books into beautiful, bite-sized visual summaries. Learn faster, remember more.
                        </p>
                    </div>

                    {/* Links Columns */}
                    <div>
                        <h3 className="font-bold text-text-main mb-6">Product</h3>
                        <ul className="space-y-4">
                            {footerLinks.Product.map((link) => (
                                <li key={link.name}>
                                    <Link to={link.path} className="text-sm text-text-muted hover:text-primary-500 transition-colors">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-bold text-text-main mb-6">Legal</h3>
                        <ul className="space-y-4">
                            {footerLinks.Legal.map((link) => (
                                <li key={link.name}>
                                    <a href={link.path} className="text-sm text-text-muted hover:text-primary-500 transition-colors">
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Newsletter Column */}
                    <div>
                        <h3 className="font-bold text-text-main mb-6">Stay Updated</h3>
                        <p className="text-sm text-text-muted mb-4">
                            Get the latest summaries delivered to your inbox weekly.
                        </p>
                        <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all text-text-main placeholder-slate-400"
                                />
                            </div>
                            <Button variant="primary" className="w-full justify-center group">
                                <span>Subscribe</span>
                                <Send size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </form>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-slate-200 dark:border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-sm text-text-muted">
                    <p>&copy; {new Date().getFullYear()} GlanceRead. All rights reserved.</p>
                    <p className="flex items-center">
                        Made with <Heart size={14} className="mx-1 text-red-500 fill-red-500 animate-pulse" /> by GlanceRead Team
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
