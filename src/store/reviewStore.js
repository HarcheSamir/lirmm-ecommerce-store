import { create } from 'zustand';
import { api } from '../services/api';
import { toast } from 'react-toastify';

export const useReviewStore = create((set, get) => ({
    reviews: [],
    pagination: {},
    stats: { average: 0, count: 0, breakdown: [] },
    isLoading: false,
    error: null,

    fetchReviewsByProduct: async (productId, page = 1) => {
        set({ isLoading: true });
        try {
            const response = await api.get(`/reviews/product/${productId}`, {
                params: { page, limit: 5 }
            });
            set({
                reviews: response.data.data,
                pagination: response.data.pagination,
                isLoading: false
            });
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to fetch reviews.';
            set({ error: message, isLoading: false });
            toast.error(message);
        }
    },
    
    fetchReviewStats: async (productId) => {
        // This logic is now derived from the product object itself, but a dedicated endpoint could be used if more complex stats are needed later.
        // For now, this is a placeholder. The stats component will receive props directly from the product object.
    },

    createReview: async (reviewData) => {
        set({ isLoading: true });
        try {
            const response = await api.post('/reviews', reviewData);
            set(state => ({
                reviews: [response.data, ...state.reviews],
                isLoading: false,
            }));
            toast.success('Thank you! Your review has been submitted.');
            get().fetchReviewsByProduct(reviewData.productId); // Refresh the list
            return true;
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to submit review.';
            set({ error: message, isLoading: false });
            toast.error(message);
            return false;
        }
    },

    updateReview: async (reviewId, reviewData) => {
        set({ isLoading: true });
        try {
            const response = await api.put(`/reviews/${reviewId}`, reviewData);
            set(state => ({
                reviews: state.reviews.map(r => r.id === reviewId ? response.data : r),
                isLoading: false,
            }));
            toast.success('Your review has been updated.');
            return true;
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to update review.';
            set({ error: message, isLoading: false });
            toast.error(message);
            return false;
        }
    },

    deleteReview: async (reviewId, productId) => {
        if (!window.confirm('Are you sure you want to delete this review?')) return;
        set({ isLoading: true });
        try {
            await api.delete(`/reviews/${reviewId}`);
            set(state => ({
                reviews: state.reviews.filter(r => r.id !== reviewId),
                isLoading: false,
            }));
            toast.success('Review deleted.');
            get().fetchReviewsByProduct(productId); // Refresh list to update pagination
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to delete review.';
            set({ error: message, isLoading: false });
            toast.error(message);
        }
    },
}));