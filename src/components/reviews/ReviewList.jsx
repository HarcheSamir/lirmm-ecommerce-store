import { useEffect, useState } from 'react';
import { useReviewStore } from '../../store/reviewStore';
import { useAuthStore } from '../../store/authStore';
import ReviewCard from './ReviewCard';
import ReviewForm from './ReviewForm';

export default function ReviewList({ productId }) {
    const { reviews, pagination, isLoading, fetchReviewsByProduct } = useReviewStore();
    const { isAuthenticated, user } = useAuthStore();
    const [editingReview, setEditingReview] = useState(null);

    useEffect(() => {
        fetchReviewsByProduct(productId);
    }, [productId, fetchReviewsByProduct]);
    
    const userHasReviewed = reviews.some(review => review.user.id === user?.id);

    return (
        <div className="mt-8">
            {isAuthenticated && (
                <div className="mb-8">
                    {userHasReviewed && !editingReview ? (
                        <p className="text-center bg-blue-50 text-blue-800 p-3 rounded-md">You've already reviewed this product. You can edit your review below.</p>
                    ) : (
                        <ReviewForm
                            productId={productId}
                            existingReview={editingReview}
                            onSuccess={() => setEditingReview(null)}
                            onCancel={() => setEditingReview(null)}
                        />
                    )}
                </div>
            )}
            {isLoading && reviews.length === 0 && <p>Loading reviews...</p>}
            {reviews.length > 0 ? (
                <div>
                    {reviews.map(review => (
                        <ReviewCard key={review.id} review={review} onEdit={() => { setEditingReview(review); window.scrollTo({ top: 0, behavior: 'smooth' }); }} />
                    ))}
                    {/* Add pagination controls if necessary */}
                </div>
            ) : (
                !isLoading && <p className="text-gray-500 text-center py-8">Be the first to review this product!</p>
            )}
        </div>
    );
}