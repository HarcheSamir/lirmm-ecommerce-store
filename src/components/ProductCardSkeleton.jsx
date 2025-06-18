import React from 'react';

export default function ProductCardSkeleton({ index = 0 }) {
    return (
        <div
            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-pulse"
            style={{ animationDelay: `${index * 100}ms` }}
        >
            <div className="relative h-64 bg-slate-200"></div>
            <div className="p-5 space-y-3">
                <div className="h-3 bg-slate-200 rounded-full w-1/3"></div>
                <div className="h-4 bg-slate-200 rounded-full w-full"></div>
                <div className="h-5 bg-slate-200 rounded-full w-1/4"></div>
            </div>
        </div>
    );
}