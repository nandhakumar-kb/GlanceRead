import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { ExternalLink, ShoppingBag, Tag } from 'lucide-react';
import { API_URL } from '../config';
import Button from '../components/common/Button';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await axios.get(`${API_URL}/api/products`);
                setProducts(res.data);
            } catch (err) {
                console.error('Error fetching products:', err);
                setError('Failed to load products');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const handleProductClick = async (productId, link) => {
        try {
            // Track click in background
            await axios.post(`${API_URL}/api/products/${productId}/click`);
        } catch (err) {
            console.error('Error tracking click:', err);
        }
        // Open link
        window.open(link, '_blank');
    };

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    if (loading) {
        return (
            <div className="min-h-screen pt-24 px-4 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="bg-surface rounded-2xl h-80 animate-pulse bg-slate-200 dark:bg-slate-800" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-black transition-colors duration-300">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-12 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 mb-4"
                    >
                        Curated Art & Gear
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-lg text-text-muted max-w-2xl mx-auto"
                    >
                        Hand-picked products to enhance your reading and creative experience.
                    </motion.p>
                </div>

                {error && (
                    <div className="text-center py-10 text-red-500 bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-100 dark:border-red-900/30">
                        {error}
                    </div>
                )}

                {/* Grid */}
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                >
                    {products.map((product) => (
                        <motion.div
                            key={product._id}
                            variants={item}
                            whileHover={{ y: -5 }}
                            className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-300 flex flex-col group"
                        >
                            {/* Image */}
                            <div className="relative aspect-square overflow-hidden bg-slate-100 dark:bg-slate-800">
                                <img
                                    src={product.image}
                                    alt={product.title}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute top-3 right-3">
                                    <span className="bg-black/70 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                                        <Tag size={12} />
                                        {product.category}
                                    </span>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-5 flex-1 flex flex-col">
                                <h3 className="text-xl font-bold text-text-main mb-2 line-clamp-2" title={product.title}>
                                    {product.title}
                                </h3>

                                <p className="text-text-muted text-sm line-clamp-3 mb-4 flex-1">
                                    {product.description}
                                </p>

                                <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100 dark:border-slate-800">
                                    <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                                        {product.price}
                                    </span>

                                    <button
                                        onClick={() => handleProductClick(product._id, product.link)}
                                        className="bg-slate-900 dark:bg-white text-white dark:text-black px-4 py-2 rounded-xl font-bold text-sm hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                                    >
                                        Buy Now
                                        <ExternalLink size={16} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {products.length === 0 && !loading && !error && (
                    <div className="text-center py-20 text-text-muted">
                        No products found yet. Check back soon!
                    </div>
                )}
            </div>
        </div>
    );
};

export default Products;
