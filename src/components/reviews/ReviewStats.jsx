import StarRating from './StarRating';

const ProgressBar = ({ percentage, color }) => (
    <div className="w-full bg-gray-200 rounded-full h-2">
        <div
            className={`${color} h-2 rounded-full transition-all duration-500`}
            style={{ width: `${percentage}%` }}
        />
    </div>
);

export default function ReviewStats({ averageRating = 0, reviewCount = 0 }) {
    // Dummy breakdown data. This should come from the backend in a real scenario.
    const ratingBreakdown = [
        { star: 5, count: Math.round(reviewCount * 0.7) },
        { star: 4, count: Math.round(reviewCount * 0.2) },
        { star: 3, count: Math.round(reviewCount * 0.05) },
        { star: 2, count: Math.round(reviewCount * 0.03) },
        { star: 1, count: Math.round(reviewCount * 0.02) },
    ];
    
    return (
        <div className="bg-white p-6 rounded-lg border">
            <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="text-center">
                    <p className="text-5xl font-bold text-gray-800">{averageRating.toFixed(1)}</p>
                    <div className="mt-1"><StarRating rating={averageRating} /></div>
                    <p className="text-sm text-gray-500 mt-2">{reviewCount} reviews</p>
                </div>
                <div className="w-full flex-1">
                    <div className="space-y-2">
                        {ratingBreakdown.map(({ star, count }) => (
                            <div key={star} className="flex items-center gap-4">
                                <span className="text-sm font-medium text-gray-600 whitespace-nowrap">{star} star</span>
                                <ProgressBar percentage={reviewCount > 0 ? (count / reviewCount) * 100 : 0} color="bg-yellow-400" />
                                <span className="text-sm text-gray-500 w-8 text-right">{count}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}