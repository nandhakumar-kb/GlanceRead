/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                primary: {
                    50: 'rgb(var(--color-primary-50) / <alpha-value>)',
                    500: 'rgb(var(--color-primary-500) / <alpha-value>)',
                    600: 'rgb(var(--color-primary-600) / <alpha-value>)',
                },
                accent: {
                    400: 'rgb(var(--color-accent-400) / <alpha-value>)',
                    500: 'rgb(var(--color-accent-500) / <alpha-value>)',
                },
                slate: {
                    50: 'rgb(var(--color-slate-50) / <alpha-value>)',
                    100: 'rgb(var(--color-slate-100) / <alpha-value>)',
                    200: 'rgb(var(--color-slate-200) / <alpha-value>)',
                    300: 'rgb(var(--color-slate-300) / <alpha-value>)',
                    400: 'rgb(var(--color-slate-400) / <alpha-value>)',
                    500: 'rgb(var(--color-slate-500) / <alpha-value>)',
                    600: 'rgb(var(--color-slate-600) / <alpha-value>)',
                    700: 'rgb(var(--color-slate-700) / <alpha-value>)',
                    800: 'rgb(var(--color-slate-800) / <alpha-value>)',
                    900: 'rgb(var(--color-slate-900) / <alpha-value>)',
                },
                background: 'rgb(var(--color-background) / <alpha-value>)',
                surface: 'rgb(var(--color-surface) / <alpha-value>)',
                text: {
                    main: 'rgb(var(--color-text-main) / <alpha-value>)',
                    muted: 'rgb(var(--color-text-muted) / <alpha-value>)',
                },
                success: '#10B981',
                locked: '#64748B',
            },
            fontFamily: {
                sans: ['Outfit', 'sans-serif'],
                brand: ['"Kaushan Script"', 'cursive'],
                hand: ['Caveat', 'cursive'],
            },
        },
    },
    plugins: [],
}
