import React from 'react';

export default function AnimatedCartIcon({ itemCount }) {
    const radius = 18;
    const circumference = 2 * Math.PI * radius;

    return (
        <div className="relative w-10 h-10 flex items-center justify-center group">
            {/* SVG container for the rings */}
            <svg className="w-full h-full" viewBox="0 0 40 40">
                {/* Background gray ring */}
                <circle
                    className="text-gray-200"
                    strokeWidth="3"
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx="20"
                    cy="20"
                />
                {/* Foreground blue progress ring */}
                <circle
                    className="progress-ring__circle text-primary" // Use primary color from theme
                    strokeWidth="3"
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference} // Initially hidden
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx="20"
                    cy="20"
                />
            </svg>
            {/* Number in the center */}
            <span className="absolute text-sm font-semibold text-gray-700">
                {itemCount}
            </span>
        </div>
    );
}