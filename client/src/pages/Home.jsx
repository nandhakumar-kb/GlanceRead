import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Check, Star, ArrowUpDown } from 'lucide-react';
import axios from 'axios';
import { API_URL } from '../config';
import BookCard from '../components/cards/BookCard';
import useBookSearch from '../hooks/useBookSearch';
import Button from '../components/common/Button';
import SkeletonBookCard from '../components/cards/SkeletonBookCard';


const Home = () => {
    const { books, loading, error, query, setQuery, category, setCategory, sort, setSort } = useBookSearch();
    const [popularBooks, setPopularBooks] = useState([]);
    const [popularLoading, setPopularLoading] = useState(true);

    // Fetch Popular Books
    React.useEffect(() => {
        const fetchPopular = async () => {
            try {
                const res = await axios.get(`${API_URL}/api/books?sort=popular&limit=4`);
                setPopularBooks(res.data);
            } catch (err) {
                console.error("Failed to fetch popular books", err);
            } finally {
                setPopularLoading(false);
            }
        };
        fetchPopular();
    }, []);

    React.useEffect(() => {
        document.title = 'Library | GlanceRead';
    }, []);

    const categories = ['All', 'Finance', 'Productivity', 'Psychology', 'Business', 'Biography'];

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div className="min-h-screen pt-20 pb-12">
            {/* Hero Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                    {/* Left: Content */}
                    <div className="flex-1 w-full text-center lg:text-left space-y-8">
                        <div className="space-y-4">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="inline-flex items-center space-x-2 px-3 py-1 bg-primary-50 dark:bg-primary-900/10 text-primary-600 dark:text-primary-400 rounded-full text-sm font-medium border border-primary-100 dark:border-primary-900/20"
                            >
                                <span className="flex h-2 w-2 rounded-full bg-primary-500 animate-pulse"></span>
                                <span>Discover your next read</span>
                            </motion.div>

                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 leading-tight"
                            >
                                Explore the world's best <br className="hidden lg:block" />
                                <span className="text-primary-600 dark:text-primary-500">knowledge</span>
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="text-lg text-text-muted max-w-2xl mx-auto lg:mx-0 leading-relaxed"
                            >
                                Access thousands of book summaries, audiobooks, and guides.
                                Learn faster and smarter with GlanceRead's curated library.
                            </motion.p>
                        </div>

                        {/* Search & Filter */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-white dark:bg-slate-900 p-2 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-black/20 border border-slate-200 dark:border-slate-800"
                        >
                            <div className="relative mb-2">
                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-muted h-5 w-5" />
                                <input
                                    type="text"
                                    placeholder="Search by title, author, or category..."
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border-none focus:ring-2 focus:ring-primary-500 text-text-main placeholder-text-muted"
                                />
                            </div>

                            <div className="flex flex-wrap gap-2 px-1">
                                {categories.map((cat) => (
                                    <button
                                        key={cat}
                                        onClick={() => setCategory(cat)}
                                        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 border ${category === cat
                                            ? 'bg-primary-600 border-primary-600 text-white shadow-lg shadow-primary-500/25 transform scale-105'
                                            : 'bg-surface/50 border-slate-200 dark:border-slate-800 text-text-muted hover:border-primary-400 hover:text-primary-500'
                                            }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    {/* Right: 3D Visuals */}
                    <div className="flex-1 w-full max-w-xl lg:max-w-none perspective-1000 group">
                        <motion.div
                            className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 bg-surface transform-gpu"
                            initial={{ opacity: 0, rotateY: 15, x: 20 }}
                            animate={{ opacity: 1, rotateY: 0, x: 0 }}
                            transition={{ duration: 1, delay: 0.2, type: "spring" }}
                            whileHover={{ rotateY: -2, rotateX: 2, scale: 1.02 }}
                        >
                            {/* Reflection Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent z-10 pointer-events-none"></div>

                            <video
                                autoPlay
                                loop
                                muted
                                playsInline
                                className="w-full h-auto object-cover scale-105"
                            >
                                <source src="/assets/animation_video.mp4" type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Most Popular Section */}
            {!query && category === 'All' && (
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
                    <div className="flex items-center space-x-2 mb-8">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/30">
                            <Star className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                        </span>
                        <h2 className="text-2xl font-bold text-text-main">Most Popular</h2>
                    </div>

                    {popularLoading ? (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {[...Array(4)].map((_, i) => (
                                <SkeletonBookCard key={`pop-${i}`} />
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {popularBooks.map(book => (
                                <BookCard key={book._id} book={book} />
                            ))}
                        </div>
                    )}
                </section>
            )}

            {/* Book Grid */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <h2 className="text-2xl font-bold text-text-main">Explore Library</h2>

                    <div className="flex items-center space-x-4">
                        <div className="relative">
                            <ArrowUpDown className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                            <select
                                value={sort}
                                onChange={(e) => setSort(e.target.value)}
                                className="pl-10 pr-8 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-surface text-sm font-medium text-text-main focus:outline-none focus:ring-2 focus:ring-primary-500 appearance-none cursor-pointer"
                            >
                                <option value="newest">Newest First</option>
                                <option value="oldest">Oldest First</option>
                                <option value="a-z">Title (A-Z)</option>
                                <option value="z-a">Title (Z-A)</option>
                            </select>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
                        {[...Array(8)].map((_, i) => (
                            <SkeletonBookCard key={i} />
                        ))}
                    </div>
                ) : (
                    <motion.div
                        variants={container}
                        initial="hidden"
                        animate="show"
                        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8"
                    >
                        {/* Error State - Show message but keep UI active */}
                        {error && (
                            <div className="col-span-full mb-4 px-4 py-3 rounded-lg bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400 text-sm">
                                <span>Unable to connect to server. Showing local demo content.</span>
                            </div>
                        )}

                        {books.map((book) => (
                            <motion.div key={book._id} variants={item}>
                                <BookCard book={book} />
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </section>
        </div>
    );
};

export default Home;
