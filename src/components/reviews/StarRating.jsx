import { useState } from 'react';
import { FiStar } from 'react-icons/fi';

export default function StarRating({ rating, setRating, size = 'text-xl' }) {
    const [hoverRating, setHoverRating] = useState(0);

    const handleMouseOver = (index) => {
        if (setRating) setHoverRating(index);
    };

    const handleMouseLeave = () => {
        if (setRating) setHoverRating(0);
    };

    const handleClick = (index) => {
        if (setRating) setRating(index);
    };

    return (
        <div className="flex items-center gap-1">
            {[...Array(5)].map((_, index) => {
                const starValue = index + 1;
                const isInteractive = !!setRating;

                return (
                    <FiStar
                        key={starValue}
                        onMouseEnter={() => handleMouseOver(starValue)}
                        onMouseLeave={handleMouseLeave}
                        onClick={() => handleClick(starValue)}
                        className={`transition-colors duration-200 ${size} ${
                            starValue <= (hoverRating || rating)
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                        } ${isInteractive ? 'cursor-pointer' : ''}`}
                    />
                );
            })}
        </div>
    );
}