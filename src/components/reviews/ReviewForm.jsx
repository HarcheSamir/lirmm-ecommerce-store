import { useFormWithValidation } from '../../hooks/useFormWithValidation';
import { reviewSchema } from '../../utils/schemas';
import { useReviewStore } from '../../store/reviewStore';
import { Controller } from 'react-hook-form';
import StarRating from './StarRating';
import { useEffect } from 'react';

export default function ReviewForm({ productId, existingReview, onCancel, onSuccess }) {
    const { createReview, updateReview, isLoading } = useReviewStore();
    const { register, handleSubmit, control, formState: { errors }, reset } = useFormWithValidation(reviewSchema, {
        defaultValues: {
            rating: existingReview?.rating || 0,
            title: existingReview?.title || '',
            comment: existingReview?.comment || '',
        },
    });

    useEffect(() => {
        reset({
            rating: existingReview?.rating || 0,
            title: existingReview?.title || '',
            comment: existingReview?.comment || '',
        });
    }, [existingReview, reset]);

    const onSubmit = async (data) => {
        let success;
        if (existingReview) {
            success = await updateReview(existingReview.id, data);
        } else {
            success = await createReview({ ...data, productId });
        }
        if (success) {
            reset({ rating: 0, title: '', comment: '' });
            onSuccess?.();
        }
    };

    const isEditing = !!existingReview;

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="bg-gray-50 p-6 rounded-lg border">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">{isEditing ? 'Edit Your Review' : 'Write a Review'}</h3>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Your Rating*</label>
                    <Controller
                        name="rating"
                        control={control}
                        render={({ field }) => <StarRating rating={field.value} setRating={field.onChange} />}
                    />
                    {errors.rating && <p className="text-xs text-red-500 mt-1">{errors.rating.message}</p>}
                </div>

                <input {...register('title')} placeholder="Review Title (optional)" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary" />
                {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title.message}</p>}

                <textarea {...register('comment')} placeholder="Your detailed review...*" rows="4" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary" />
                {errors.comment && <p className="text-xs text-red-500 mt-1">{errors.comment.message}</p>}
            </div>
            <div className="flex items-center gap-4 mt-4">
                <button type="submit" disabled={isLoading} className="bg-primary text-white font-semibold py-2 px-6 rounded-md hover:bg-fblack disabled:bg-gray-400">
                    {isLoading ? 'Submitting...' : isEditing ? 'Update Review' : 'Submit Review'}
                </button>
                {isEditing && (
                    <button type="button" onClick={onCancel} className="bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-md hover:bg-gray-300">
                        Cancel
                    </button>
                )}
            </div>
        </form>
    );
}