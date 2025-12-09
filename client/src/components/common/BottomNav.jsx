import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Search, type User, BookOpen } from 'lucide-react';

const BottomNav = () => {
    const navItems = [
        { icon: Home, label: 'Home', path: '/' },
        { icon: Search, label: 'Search', path: '/library' }, // Assuming library is search or create a search route? Using Lib for now.
        { icon: User, label: 'Profile', path: '/dashboard' },
    ];

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 px-6 py-3 z-50 pb-safe">
            <div className="flex justify-around items-center">
                {navItems.map((item) => (
                    <NavLink
                        key={item.label}
                        to={item.path}
                        className={({ isActive }) => `flex flex-col items-center gap-1 transition-colors duration-200 ${isActive
                                ? 'text-primary-600 dark:text-primary-400'
                                : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
                            }`}
                    >
                        <item.icon className="w-6 h-6" />
                        <span className="text-[10px] font-medium">{item.label}</span>
                    </NavLink>
                ))}
            </div>
        </div>
    );
};

export default BottomNav;
