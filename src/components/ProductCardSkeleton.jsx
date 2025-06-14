import React from 'react';

export default function ProductCardSkeleton() {
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
            <div className="relative h-64 bg-slate-200"></div>
            <div className="p-4">
                <div className="h-4 bg-slate-200 rounded w-1/3 mb-2"></div>
                <div className="h-5 bg-slate-200 rounded w-full mb-3"></div>
                <div className="h-6 bg-slate-200 rounded w-1/4"></div>
            </div>
            <div className="h-11 bg-slate-100"></div>
        </div>
    );
}