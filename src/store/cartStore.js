import { create } from 'zustand';
import { api } from '../services/api';
import { toast } from 'react-toastify';

const CART_ID_STORAGE_KEY = 'cartId';

export const useCartStore = create((set, get) => ({
    cart: null,
    cartId: localStorage.getItem(CART_ID_STORAGE_KEY) || null,
    isCartOpen: false,
    isLoading: false,
    error: null,

    associateCartOnLogin: async (userId) => {
        const cartId = get().cartId;
        if (!cartId || !userId) {
            return;
        }
        try {
            const response = await api.post('/carts/associate', { cartId, userId });
            set({ cart: response.data });
        } catch (error) {
            console.error("Failed to associate cart with user:", error);
        }
    },

    toggleCart: () => set(state => ({ isCartOpen: !state.isCartOpen })),
    openCart: () => set({ isCartOpen: true }),
    initializeCart: async () => {
        const cartId = get().cartId;
        if (!cartId) {
            set({ cart: { items: [] } });
            return;
        }
        set({ isLoading: true });
        try {
            const response = await api.get(`/carts/${cartId}`);
            set({ cart: response.data, isLoading: false });
        } catch (error) {
            if (error.response?.status === 404) {
                localStorage.removeItem(CART_ID_STORAGE_KEY);
                set({ cart: { items: [] }, cartId: null, isLoading: false });
            } else {
                set({ error: error.response?.data?.message || 'Failed to fetch cart.', isLoading: false });
            }
        }
    },

    addItem: async (product, variant, quantity) => {
        set({ isLoading: true });
        let currentCartId = get().cartId;
        try {
            // CORRECTED: Defensively handle product name. If it's an object, it's an error from the calling component. Fallback to English.
            const productName = typeof product.name === 'object' 
                ? product.name?.en || 'Product Name Unavailable'
                : product.name;

            const payload = {
                productId: product.id,
                variantId: variant.id,
                quantity,
                price: variant.price,
                name: productName,
                imageUrl: product.images?.find(img => img.isPrimary)?.imageUrl || product.images?.[0]?.imageUrl,
                attributes: variant.attributes,
            };

            if (!currentCartId) {
                const createCartResponse = await api.post('/carts');
                currentCartId = createCartResponse.data.id;
                set({ cartId: currentCartId });
                localStorage.setItem(CART_ID_STORAGE_KEY, currentCartId);
            }
            const response = await api.post(`/carts/${currentCartId}/items`, payload);
            set({ cart: response.data, isLoading: false });
            toast.success(`${productName} added to cart!`);
            get().openCart();
        } catch (error) {
            const message = error.response?.data?.message || 'Could not add item to cart.';
            set({ error: message, isLoading: false });
            toast.error(message);
        }
    },

    updateItemQuantity: async (itemId, quantity) => {
        const cartId = get().cartId;
        if (!cartId || quantity < 1) return;
        set({ isLoading: true });
        try {
            const response = await api.put(`/carts/${cartId}/items/${itemId}`, { quantity });
            set({ cart: response.data, isLoading: false });
        } catch (error) {
            const message = error.response?.data?.message || 'Could not update item quantity.';
            set({ error: message, isLoading: false });
            toast.error(message);
        }
    },

    removeItem: async (itemId) => {
        const cartId = get().cartId;
        if (!cartId) return;
        set({ isLoading: true });
        try {
            const response = await api.delete(`/carts/${cartId}/items/${itemId}`);
            set({ cart: response.data, isLoading: false });
            toast.info("Item removed from cart.");
        } catch (error) {
            const message = error.response?.data?.message || 'Could not remove item from cart.';
            set({ error: message, isLoading: false });
            toast.error(message);
        }
    },

    clearCartOnOrder: () => {
        const cartId = get().cartId;
        if (cartId) {
            api.delete(`/carts/${cartId}`).catch(err => {
                console.error("Failed to delete cart from server after order:", err);
            });
        }
        localStorage.removeItem(CART_ID_STORAGE_KEY);
        set({ cart: null, cartId: null });
    },
}));