import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Sun, Moon, Flame } from 'lucide-react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import Button from './Button';
import { clsx } from 'clsx';
import { useTheme } from '../../context/ThemeContext';
// Import logo directly if possible, or refer by path if in public/src (Vite handles src imports well)
import logoLight from '../../assets/logo_black.png'; // Black logo for Light Mode
import logoDark from '../../assets/logo_white.png';  // White logo for Dark Mode

import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();
    const { theme, toggleTheme } = useTheme();
    const { user, logout } = useAuth();

    // 3D Tilt Logic for Logo
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const rotateX = useTransform(y, [0, 1], [0, -15]);
    const rotateY = useTransform(x, [0, 1], [0, 15]);

    function handleLogoMouse(event) {
        const rect = event.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;
        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;
        x.set(xPct);
        y.set(yPct);
    }

    function handleLogoLeave() {
        x.set(0);
        y.set(0);
    }

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Library', path: '/' },
        { name: 'Shop', path: '/products' },
        { name: 'Pricing', path: '/pricing' },
    ];

    const handleLogout = () => {
        logout();
        setIsMobileMenuOpen(false);
    };

    return (
        <nav
            className={clsx(
                'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
                isScrolled
                    ? 'bg-background/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 shadow-lg shadow-slate-200/5 dark:shadow-black/20'
                    : 'bg-transparent border-b border-transparent'
            )}
        >
            {/* Gradient Border Line (Premium Touch) */}
            <div className={clsx("absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary-500/50 to-transparent transition-opacity duration-300", isScrolled ? "opacity-100" : "opacity-0")} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* 3D Magnetic Logo */}
                    <div className="perspective-1000">
                        <Link to="/"
                            onMouseMove={handleLogoMouse}
                            onMouseLeave={handleLogoLeave}
                        >
                            <motion.div
                                style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                className="flex items-center space-x-2 group cursor-pointer"
                            >
                                <img
                                    src={theme === 'dark' ? logoDark : logoLight}
                                    alt="GlanceRead Logo"
                                    className="h-10 w-auto object-contain transition-transform duration-200"
                                    style={{ transform: "translateZ(20px)" }}
                                />
                                <span className="text-2xl font-brand tracking-wider transform -skew-x-6 ml-2" style={{ transform: "translateZ(10px)" }}>
                                    <span className="text-accent-500">Glance</span>
                                    <span className="text-primary-500">Read</span>
                                </span>
                            </motion.div>
                        </Link>
                    </div>

                    {/* Desktop Navigation with Active Pill Animation */}
                    <div className="hidden md:flex items-center space-x-2">
                        {navLinks.map((link) => {
                            const isActive = location.pathname === link.path;
                            return (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    className={clsx(
                                        'relative px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200',
                                        isActive ? 'text-white' : 'text-text-muted hover:text-text-main'
                                    )}
                                >
                                    {isActive && (
                                        <motion.div
                                            layoutId="navbar-active"
                                            className="absolute inset-0 bg-primary-600 rounded-full"
                                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                            style={{ zIndex: -1 }}
                                        />
                                    )}
                                    <span className="relative z-10">{link.name}</span>
                                </Link>
                            );
                        })}

                        <div className="w-4" /> {/* Spacer */}

                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-text-main relative overflow-hidden group"
                            aria-label="Toggle Theme"
                        >
                            <motion.div
                                initial={false}
                                animate={{ rotate: theme === 'dark' ? 180 : 0 }}
                                transition={{ duration: 0.5, type: "spring" }}
                            >
                                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                            </motion.div>
                        </button>

                        {/* Streak Counter - Habit Loop */}
                        <div className="flex items-center space-x-1 bg-orange-100 dark:bg-orange-900/30 px-3 py-1 rounded-full border border-orange-200 dark:border-orange-800 cursor-help transition-transform hover:scale-105" title="Daily Reading Streak">
                            <Flame size={18} className="text-orange-500 fill-orange-500 animate-pulse" />
                            <span className="text-sm font-bold text-orange-600 dark:text-orange-400">1</span>
                        </div>

                        <div className="w-2" /> {/* Spacer */}

                        {user ? (
                            <div className="flex items-center space-x-4">
                                <span className="text-sm font-medium text-text-main">
                                    <Link to="/settings" className="hover:text-primary-500 transition-colors">
                                        Hi, {user.username}
                                    </Link>
                                </span>
                                {user.role === 'admin' && (
                                    <>
                                        <Link to="/admin/upload">
                                            <Button variant="ghost" size="sm">Upload</Button>
                                        </Link>
                                        <Link to="/admin/users">
                                            <Button variant="ghost" size="sm">Users</Button>
                                        </Link>
                                        <Link to="/admin/analytics">
                                            <Button variant="ghost" size="sm">Analytics</Button>
                                        </Link>
                                        <Link to="/admin/affiliate">
                                            <Button variant="ghost" size="sm">Affiliate</Button>
                                        </Link>
                                        <Link to="/admin/products">
                                            <Button variant="ghost" size="sm">Products</Button>
                                        </Link>
                                    </>
                                )}
                                <Button variant="outline" size="sm" onClick={logout}>
                                    Logout
                                </Button>
                                <Link to="/dashboard">
                                    <Button variant="primary" size="sm">Dashboard</Button>
                                </Link>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Link to="/login" className="text-sm font-medium text-text-muted hover:text-text-main">
                                    Login
                                </Link>
                                <Link to="/register">
                                    <motion.div
                                        animate={{ scale: [1, 1.05, 1] }}
                                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                    >
                                        <Button variant="primary" size="sm" className="shadow-lg shadow-primary-500/30">
                                            Get Started
                                        </Button>
                                    </motion.div>
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="p-2 rounded-md text-text-muted hover:text-text-main focus:outline-none"
                        >
                            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-surface border-b border-slate-200 dark:border-slate-800 overflow-hidden"
                    >
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    className={clsx(
                                        'block px-3 py-2 rounded-md text-base font-medium',
                                        location.pathname === link.path
                                            ? 'text-primary-600 bg-primary-50 dark:bg-primary-900/10'
                                            : 'text-text-muted hover:text-text-main hover:bg-slate-50 dark:hover:bg-slate-800'
                                    )}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <div className="pt-4 flex flex-col space-y-2">
                                {user ? (
                                    <>
                                        <div className="px-3 py-2 text-sm font-medium text-text-main">
                                            Signed in as {user.username}
                                        </div>
                                        {user.role === 'admin' && (
                                            <>
                                                <Link to="/admin/upload" onClick={() => setIsMobileMenuOpen(false)}>
                                                    <Button variant="ghost" className="w-full justify-start">Admin Upload</Button>
                                                </Link>
                                                <Link to="/admin/users" onClick={() => setIsMobileMenuOpen(false)}>
                                                    <Button variant="ghost" className="w-full justify-start">Manage Users</Button>
                                                </Link>
                                                <Link to="/admin/analytics" onClick={() => setIsMobileMenuOpen(false)}>
                                                    <Button variant="ghost" className="w-full justify-start">User Analytics</Button>
                                                </Link>
                                                <Link to="/admin/affiliate" onClick={() => setIsMobileMenuOpen(false)}>
                                                    <Button variant="ghost" className="w-full justify-start">Affiliate Analytics</Button>
                                                </Link>
                                                <Link to="/admin/products" onClick={() => setIsMobileMenuOpen(false)}>
                                                    <Button variant="ghost" className="w-full justify-start">Manage Products</Button>
                                                </Link>
                                            </>
                                        )}
                                        <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                                            <Button variant="primary" className="w-full">Dashboard</Button>
                                        </Link>
                                        <Button variant="outline" className="w-full" onClick={handleLogout}>Logout</Button>
                                    </>
                                ) : (
                                    <>
                                        <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                                            <Button variant="ghost" className="w-full justify-start">Login</Button>
                                        </Link>
                                        <Link to="/register" onClick={() => setIsMobileMenuOpen(false)}>
                                            <Button variant="primary" className="w-full">Get Started</Button>
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
