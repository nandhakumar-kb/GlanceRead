import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const Button = ({
    children,
    onClick,
    type = 'button',
    variant = 'primary',
    className,
    disabled = false,
    ...props
}) => {
    const baseStyles = 'inline-flex items-center justify-center px-4 py-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
        primary: 'bg-primary-600 text-white hover:bg-primary-500 focus:ring-primary-500 shadow-sm hover:shadow-md',
        secondary: 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 focus:ring-slate-200',
        accent: 'bg-accent-500 text-white hover:bg-accent-400 focus:ring-accent-500 shadow-sm hover:shadow-md',
        ghost: 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
        danger: 'bg-red-600 text-white hover:bg-red-500 focus:ring-red-500',
    };

    return (
        <button
            type={type}
            className={twMerge(clsx(baseStyles, variants[variant], className))}
            onClick={onClick}
            disabled={disabled}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
