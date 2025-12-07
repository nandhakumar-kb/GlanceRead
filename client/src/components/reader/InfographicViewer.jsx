import React, { useState } from 'react';
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

const InfographicViewer = ({ imageSrc, images = [], title }) => {
    // Combine to ensure we have an array to loop over. Priority: images array > single imageSrc > empty
    const allImages = (images && images.length > 0) ? images : (imageSrc ? [imageSrc] : []);

    const [scale, setScale] = useState(1);

    const handleZoomIn = () => setScale(prev => Math.min(prev + 0.25, 3));
    const handleZoomOut = () => setScale(prev => Math.max(prev - 0.25, 0.5));
    const handleReset = () => setScale(1);

    return (
        <div className="relative w-full h-[calc(100vh-64px)] bg-slate-900 overflow-y-auto flex flex-col items-center">
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
                </div>
            </div>
        </div>
    );
};

export default InfographicViewer;
