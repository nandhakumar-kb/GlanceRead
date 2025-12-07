import React from 'react';
import { Link } from 'react-router-dom';
import { Lock, Star, Bookmark, ShoppingBag } from 'lucide-react';
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
            <Link to={`/read/${_id}`} className="block h-full" style={{ transformStyle: "preserve-3d" }}>
                {/* Image Container */}
                <div className="aspect-[2/3] relative overflow-hidden bg-slate-100 dark:bg-slate-800 rounded-t-2xl" style={{ transform: "translateZ(20px)" }}>
                    <img
                        src={coverImage}
                        alt={title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        loading="lazy"
                    />

                    {/* Overlays */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300" />

                    {/* Badges & Actions */}
                    <div className="absolute top-3 right-3 flex flex-col gap-2" style={{ transform: "translateZ(30px)" }}>
                        {isPremium && (
                            <div className="bg-accent-500 text-white p-1.5 rounded-lg shadow-lg" title="Premium">
                                <Star size={16} fill="currentColor" />
                            </div>
                        )}
                        {/* Save Button */}
                        <button
                            onClick={handleSaveToggle}
                            className={`backdrop-blur-md p-1.5 rounded-lg transition-all shadow-lg hover:scale-110 ${isSaved
                                ? 'bg-primary-500 text-white shadow-primary-500/30'
                                : 'bg-white/90 dark:bg-black/60 text-slate-700 dark:text-slate-200 hover:text-primary-500'
                                }`}
                            title={isSaved ? "Unsave Book" : "Save Book"}
                        >
                            <Bookmark size={16} fill={isSaved ? "currentColor" : "none"} />
                        </button>
                    </div>
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
                        {affiliateLink && (
                            <a
                                href={affiliateLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="shrink-0 p-1.5 rounded-lg bg-primary-50 text-primary-600 hover:bg-primary-100 transition-colors"
                                title="Buy Book"
                            >
                                <ShoppingBag size={18} />
                            </a>
                        )}
                    </div>
                    <p className="text-sm text-text-muted font-medium">
                        {author}
                    </p>
                </div>
            </Link>
        </motion.div >
    );
};

export default BookCard;
