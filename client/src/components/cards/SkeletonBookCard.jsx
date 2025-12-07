import React from 'react';

const SkeletonBookCard = () => {
    return (
        <div className="bg-surface rounded-2xl shadow-sm overflow-hidden border border-slate-200 dark:border-slate-800 animate-pulse">
            {/* Image Placeholder */}
            <div className="aspect-[2/3] bg-slate-200 dark:bg-slate-800" />

            {/* Content Placeholder */}
            <div className="p-5 space-y-3">
                {/* Category Badge */}
                <div className="h-3 w-16 bg-slate-200 dark:bg-slate-800 rounded-full" />

                {/* Title Lines */}
                <div className="space-y-2">
                    <div className="h-5 w-full bg-slate-200 dark:bg-slate-800 rounded" />
                    <div className="h-5 w-2/3 bg-slate-200 dark:bg-slate-800 rounded" />
                </div>

                {/* Author */}
                <div className="h-4 w-1/2 bg-slate-200 dark:bg-slate-800 rounded pt-2" />
            </div>
        </div>
    );
};

export default SkeletonBookCard;
