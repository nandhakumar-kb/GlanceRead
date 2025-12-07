import React from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
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
                            className="inline-block mb-4 px-4 py-1.5 rounded-full bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-300 font-medium text-sm border border-primary-100 dark:border-primary-800"
                        >
                            ✨ Reimagine your reading list
                        </motion.div>

                        <h1 className="text-5xl md:text-7xl font-extrabold text-text-main mb-6 tracking-tight leading-1.1">
                            Learn a book in <br className="hidden md:block" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-accent-500 animate-gradient-x">
                                5 minutes
                            </span>.
                        </h1>
                        <p className="text-xl md:text-2xl text-text-muted mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                            Unlock key insights from the world's best non-fiction through beautiful, high-resolution infographics.
                        </p>

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
