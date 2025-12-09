import React from 'react';
import { motion } from 'framer-motion';
import { Search, Check, Star } from 'lucide-react';
import BookCard from '../components/cards/BookCard';
import useBookSearch from '../hooks/useBookSearch';
import Button from '../components/common/Button';
import SkeletonBookCard from '../components/cards/SkeletonBookCard';


const Home = () => {
    const { books, loading, error, query, setQuery, category, setCategory } = useBookSearch();

    React.useEffect(() => {
        document.title = 'Library | GlanceRead';
    }, []);

    const categories = ['All', 'Wealth', 'Productivity', 'Psychology', 'Business', 'Biography'];

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
            <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24 pt-12">
                {/* Background Blobs */}
                <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob dark:opacity-10"></div>
                <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000 dark:opacity-10"></div>
                <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000 dark:opacity-10"></div>

                <div className="flex flex-col lg:flex-row items-center gap-16 relative z-10">
                    {/* Left: Content */}
                    <motion.div
                        className="flex-1 text-center lg:text-left"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 dark:bg-green-900/20 rounded-full text-green-600 dark:text-green-400 text-sm font-semibold mb-6 border border-green-100 dark:border-green-800 backdrop-blur-sm"
                        >
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                            </span>
                            12,341 books read this month
                        </motion.div>

                        <h1 className="text-6xl md:text-8xl font-extrabold text-text-main mb-6 tracking-tight leading-none">
                            Master Business <br /> Books in
                            <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 animate-gradient-x">
                                5 Minutes
                            </span>
                        </h1>
                        <p className="text-xl md:text-2xl text-text-muted mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                            Unlock key insights from the world's best non-fiction through beautiful, high-resolution infographics.
                        </p>

                        <div className="flex flex-wrap justify-center lg:justify-start gap-4 md:gap-8 text-sm font-medium text-slate-600 dark:text-slate-400 mb-10">
                            <div className="flex items-center gap-2 bg-white/50 dark:bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-100 dark:border-slate-700">
                                <Check className="w-5 h-5 text-green-500" />
                                <span>1000+ Summaries</span>
                            </div>
                            <div className="flex items-center gap-2 bg-white/50 dark:bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-100 dark:border-slate-700">
                                <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                                <span>4.9/5 Rating</span>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 mb-12">
                            <div className="max-w-md w-full relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Search className="h-5 w-5 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
                                </div>
                                <input
                                    type="text"
                                    className="block w-full pl-11 pr-4 py-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-surface/50 backdrop-blur-sm text-text-main placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50 shadow-sm transition-all hover:shadow-md hover:border-primary-300 dark:hover:border-primary-700"
                                    placeholder="Search specific titles..."
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                />
                            </div>

                        </div>

                        {/* Category Pills */}
                        <div className="flex flex-wrap justify-center lg:justify-start gap-2">
                            <span className="text-sm font-semibold text-text-muted mr-2 flex items-center">Trending:</span>
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

            {/* Book Grid */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
