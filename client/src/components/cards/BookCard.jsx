import React from 'react';
import { Link } from 'react-router-dom';
import { Lock, Star, Bookmark, ShoppingBag, Eye, Crown } from 'lucide-react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const BookCard = ({ book }) => {
    const { _id, title, author, coverImage, category, isPremium, affiliateLink } = book;
    const { user, saveBook, unsaveBook } = useAuth();
    const { showToast } = useToast();

    // Check if user has saved this book (safe check)
    const isSaved = user?.savedBooks?.includes(_id);

    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const rotateX = useTransform(y, [0, 1], [0, -10]);
    const rotateY = useTransform(x, [0, 1], [0, 10]);

    function handleMouse(event) {
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

    function handleMouseLeave() {
        x.set(0);
        y.set(0);
    }

    const handleSaveToggle = async (e) => {
        e.preventDefault(); // Prevent navigation
        if (!user) {
            showToast('Please login to save books', 'error');
            return;
        }

        if (isSaved) {
            await unsaveBook(_id);
            showToast('Book removed from library', 'info');
        } else {
            await saveBook(_id);
            showToast('Book saved to library!', 'success');
        }
    };

    return (
        <motion.div
            style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d"
            }}
            onMouseMove={handleMouse}
            onMouseLeave={handleMouseLeave}
            initial={{ scale: 1 }}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="group relative bg-surface rounded-2xl shadow-sm hover:shadow-2xl transition-shadow duration-300 border border-slate-200 dark:border-slate-800 perspective-1000"
        >
            {/* Hover Glow Effect */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500" />

            <Link to={`/read/${_id}`} className="block h-full relative bg-surface rounded-2xl overflow-hidden" style={{ transformStyle: "preserve-3d" }}>
                {/* Image Container */}
                <div className="aspect-[2/3] relative overflow-hidden bg-slate-100 dark:bg-slate-800 rounded-t-2xl" style={{ transform: "translateZ(20px)" }}>
                    <img
                        src={coverImage}
                        alt={title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        loading="lazy"
                    />

                    {/* Gradient Overlay & Hover Reveal */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                        <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-300 flex items-center justify-center gap-4">
                            <button className="flex items-center gap-2 bg-white text-slate-900 px-4 py-2 rounded-full font-bold shadow-lg hover:scale-105 transition-transform">
                                <Eye size={18} />
                                Read Now
                            </button>
                        </div>
                    </div>

                    {/* Badge */}
                    {isPremium && (
                        <div className="absolute top-3 left-3 bg-gradient-to-r from-yellow-400 to-orange-500 px-3 py-1 rounded-full text-xs font-bold text-white flex items-center gap-1 shadow-lg z-10" title="Premium">
                            <Crown size={12} fill="currentColor" />
                            Premium
                        </div>
                    )}

                    {/* Quick Save (Always Visible) */}
                    <button
                        onClick={handleSaveToggle}
                        className={`absolute top-3 right-3 p-2 rounded-full transition-all shadow-lg hover:scale-110 z-10 ${isSaved
                            ? 'bg-primary-500 text-white shadow-primary-500/30'
                            : 'bg-white/20 backdrop-blur-md text-white hover:bg-white hover:text-primary-500'
                            }`}
                        title={isSaved ? "Unsave Book" : "Save Book"}
                    >
                        <Bookmark size={18} fill={isSaved ? "currentColor" : "none"} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-5" style={{ transform: "translateZ(10px)" }}>
                    <div className="text-xs font-semibold text-primary-600 mb-2 uppercase tracking-wider">
                        {category}
                    </div>

                    <div className="flex justify-between items-start mb-1">
                        <h3 className="text-lg font-bold text-text-main leading-tight line-clamp-2 group-hover:text-primary-500 transition-colors pr-2">
                            {title}
                        </h3>
                    </div>
                    <p className="text-sm text-text-muted font-medium mb-3">
                        {author}
                    </p>

                    {/* Affiliate CTA - Centered & Large */}
                    {affiliateLink && (
                        <div className="mt-4 flex justify-center">
                            <a
                                href={affiliateLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="w-full text-center bg-gradient-to-r from-orange-500 to-pink-600 hover:from-green-500 hover:to-green-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-md hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 transform hover:-translate-y-0.5"
                                title="Buy Book"
                            >
                                <ShoppingBag size={16} />
                                Buy Now
                            </a>
                        </div>
                    )}
                </div>
            </Link>
        </motion.div >
    );
};

export default BookCard;
