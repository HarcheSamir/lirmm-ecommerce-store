import { create } from 'zustand';
import { api } from '../services/api';
import { toast } from 'react-toastify';
import { useCartStore } from './cartStore';

export const useOrderStore = create((set, get) => ({
    order: null,
    isLoading: false,
    error: null,
    orders: [], 
    pagination: null,

    createOrder: async (orderData) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.post('/orders', orderData);
            const newOrder = response.data;
            set({ order: newOrder, isLoading: false });
            toast.success(`Order #${newOrder.id.slice(0, 8)} placed successfully!`);
            useCartStore.getState().clearCartOnOrder();
            return { success: true, order: newOrder };
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to place order.';
            console.error("Create Order Error:", error);
            set({ error: message, isLoading: false });
            toast.error(message);
            return { success: false, error: message };
        }
    },
    
    fetchMyOrders: async (page = 1, limit = 10) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.get('/orders/my-orders', { params: { page, limit } });
            set({ orders: response.data.data, pagination: response.data.pagination, isLoading: false });
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to fetch your orders.';
            set({ error: message, isLoading: false, orders: [] });
            toast.error(message);
        }
    },
    
    fetchGuestOrder: async (orderId, token) => {
        set({ isLoading: true, error: null, order: null });
        try {
            const response = await api.post('/orders/guest-lookup', { orderId, token });
            set({ order: response.data, isLoading: false });
            return response.data;
        } catch (error) {
            const message = error.response?.data?.message || "Couldn't find that order. Please check the ID and token.";
            set({ error: message, isLoading: false });
            toast.error(message);
            return null;
        }
    },

    cancelOrder: async (orderId, guestToken) => {
        set({ isLoading: true });
        try {
            const url = guestToken ? `/orders/${orderId}/cancel?guest_token=${guestToken}` : `/orders/${orderId}/cancel`;
            const response = await api.post(url);
            set({ order: response.data, isLoading: false });
            toast.success('Your order has been cancelled.');
            return true;
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to cancel the order.';
            set({ error: message, isLoading: false });
            toast.error(message);
            return false;
        }
    },

    createReturnRequest: async (orderId, reason, items, imageUrls, guestToken) => {
        set({ isLoading: true });
        try {
            const url = guestToken ? `/orders/returns?guest_token=${guestToken}` : '/orders/returns';
            const payload = { orderId, reason, items, imageUrls };
            const response = await api.post(url, payload);
            toast.success('Return request submitted successfully.');
            if (guestToken) {
                await get().fetchGuestOrder(orderId, guestToken);
            } else {
                // Future enhancement: fetch authenticated user order by ID
            }
            set({ isLoading: false });
            return response.data;
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to create return request.';
            set({ error: message, isLoading: false });
            toast.error(message);
            return null;
        }
    },

    createReturnRequestComment: async (returnRequestId, commentText, imageUrl, guestToken) => {
        try {
            const url = guestToken
                ? `/orders/returns/${returnRequestId}/comments?guest_token=${guestToken}`
                : `/orders/returns/${returnRequestId}/comments`;
            
            const response = await api.post(url, { commentText, imageUrl });

            set(state => {
                if (!state.order || !state.order.returnRequests || state.order.returnRequests.length === 0) {
                    return state;
                }
                const updatedReturnRequests = state.order.returnRequests.map(req => {
                    if (req.id === returnRequestId) {
                        return { ...req, comments: [...req.comments, response.data] };
                    }
                    return req;
                });
                return { order: { ...state.order, returnRequests: updatedReturnRequests } };
            });
            return true;
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to post comment.';
            toast.error(message);
            return false;
        }
    },

    clearCurrentOrder: () => {
        set({ order: null, error: null });
    }
}));