// ===== FILE: src/store/orderStore.js =====
import { create } from 'zustand';
import { api } from '../services/api';
import { toast } from 'react-toastify';
import { useCartStore } from './cartStore';

export const useOrderStore = create((set) => ({
    order: null,
    isLoading: false,
    error: null,

    createOrder: async (orderData) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.post('/orders', orderData);
            const newOrder = response.data;

            set({ order: newOrder, isLoading: false });
            toast.success(`Order #${newOrder.id.slice(0, 8)} placed successfully!`);

            // After successful order, clear the cart.
            useCartStore.getState().clearCartOnOrder();

            return { success: true, orderId: newOrder.id };
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to place order.';
            console.error("Create Order Error:", error);
            set({ error: message, isLoading: false });
            toast.error(message);
            return { success: false, error: message };
        }
    },
}));