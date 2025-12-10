import React, { useState, useEffect } from 'react';
import { ZoomIn, ZoomOut, RotateCcw, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

const InfographicViewer = ({ imageSrc, images = [], title, isLocked, onPageChange }) => {
    // Combine to ensure we have an array to loop over. Priority: images array > single imageSrc > empty
    const allImages = (images && images.length > 0) ? images : (imageSrc ? [imageSrc] : []);

    const [scale, setScale] = useState(1);
    const [currentVisiblePage, setCurrentVisiblePage] = useState(0);

    // Track scroll position to determine current page
    useEffect(() => {
        const handleScroll = (e) => {
            const scrollTop = e.target.scrollTop;
            const pageHeight = e.target.scrollHeight / allImages.length;
            const page = Math.floor(scrollTop / pageHeight);
            setCurrentVisiblePage(page);
            if (onPageChange) {
                onPageChange(page);
            }
        };

        const container = document.getElementById('infographic-container');
        if (container) {
            container.addEventListener('scroll', handleScroll);
            return () => container.removeEventListener('scroll', handleScroll);
        }
    }, [allImages.length, onPageChange]);

    const handleZoomIn = () => setScale(prev => Math.min(prev + 0.25, 3));
    const handleZoomOut = () => setScale(prev => Math.max(prev - 0.25, 0.5));
    const handleReset = () => setScale(1);

    return (
        <div id="infographic-container" className="relative w-full h-[calc(100vh-64px)] bg-slate-900 overflow-y-auto flex flex-col items-center">
            {/* Controls Overlay */}
            <div className="fixed bottom-8 right-8 z-50 flex gap-2 bg-slate-800/80 backdrop-blur p-2 rounded-xl border border-slate-700 shadow-2xl">
                <button
                    onClick={handleZoomOut}
                    className="p-2 text-slate-200 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors"
                    title="Zoom Out"
                >
                    <ZoomOut size={20} />
                </button>
                <button
                    onClick={handleReset}
                    className="p-2 text-slate-200 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors"
                    title="Reset Zoom"
                >
                    <RotateCcw size={20} />
                </button>
                <button
                    onClick={handleZoomIn}
                    className="p-2 text-slate-200 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors"
                    title="Zoom In"
                >
                    <ZoomIn size={20} />
                </button>
            </div>

            {/* Scrollable Content */}
            <div
                className="w-full min-h-full flex flex-col items-center py-8 transition-transform duration-200 ease-out origin-top"
                style={{
                    // We map scale to width percentage or max-width? 
                    // Better: standard scaling, but verify if it messes up scroll width.
                    // Safer: Increase max-width based on scale.
                    // Default max-width is 4xl (56rem ~ 900px).
                    // Let's use CSS transform scale on the CONTAINER of images? No, that can crop.
                    // Best: Just change the width of the images directly.
                }}
            >
                <div className="flex flex-col gap-0 shadow-2xl transition-all duration-300 ease-out"
                    style={{
                        width: `${Math.min(100 * scale, 300)}%`, // Allows growing beyond 100% of container
                        maxWidth: `${60 * scale}rem` // Base 4xl is ~56rem. Adjust dynamically.
                    }}
                >
                    {allImages.map((src, index) => (
                        <img
                            key={index}
                            src={src}
                            alt={`${title} - Page ${index + 1}`}
                            className="w-full h-auto object-contain bg-white mb-0 block"
                            draggable={false}
                        />
                    ))}

                    {isLocked && (
                        <div className="w-full bg-slate-800 p-8 flex flex-col items-center justify-center text-center border-t border-slate-700">
                            <div className="bg-slate-700 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                                <Lock size={32} className="text-slate-400" />
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-2">Continue Reading</h2>
                            <p className="text-slate-400 mb-8 max-w-md">
                                You've reached the end of the preview. Sign up for a free account to unlock the full potential of GlanceRead.
                            </p>
                            <Link to="/register" className="inline-block">
                                <button className="px-8 py-3 bg-primary-500 hover:bg-primary-600 text-white font-bold rounded-xl transition-colors">
                                    Create Free Account
                                </button>
                            </Link>
                            <p className="mt-4 text-sm text-slate-500">
                                Already have an account? <Link to="/login" className="text-primary-400 hover:text-primary-300">Sign in</Link>
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default InfographicViewer;
