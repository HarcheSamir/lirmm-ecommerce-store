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

    toggleCart: () => set(state => ({ isCartOpen: !state.isCartOpen })),
    openCart: () => set({ isCartOpen: true }),

    initializeCart: async () => {
        const cartId = get().cartId;
        if (!cartId) {
            console.log("No cartId in storage. Cart will be created on first item add.");
            set({ cart: { items: [] } });
            return;
        }

        set({ isLoading: true });
        try {
            const response = await api.get(`/carts/${cartId}`);
            set({ cart: response.data, isLoading: false });
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to fetch cart.';
            console.error("Initialize Cart Error:", error);
            if (error.response?.status === 404) {
                localStorage.removeItem(CART_ID_STORAGE_KEY);
                set({ cart: { items: [] }, cartId: null, error: message, isLoading: false });
            } else {
                set({ error: message, isLoading: false });
                toast.error(message);
            }
        }
    },

    addItem: async (product, variant, quantity) => {
        set({ isLoading: true });
        let currentCartId = get().cartId;

        try {
            // *** CRITICAL FIX: Add 'attributes' to the payload sent to the backend ***
            const payload = {
                productId: product.id,
                variantId: variant.id,
                quantity,
                price: variant.price,
                name: product.name,
                imageUrl: product.images?.find(img => img.isPrimary)?.imageUrl || product.images?.[0]?.imageUrl,
                attributes: variant.attributes, // <-- THIS IS THE NEW, ESSENTIAL LINE
            };

            if (!currentCartId) {
                const createCartResponse = await api.post('/carts');
                currentCartId = createCartResponse.data.id;
                set({ cartId: currentCartId });
                localStorage.setItem(CART_ID_STORAGE_KEY, currentCartId);
            }

            const response = await api.post(`/carts/${currentCartId}/items`, payload);

            // The backend response now contains the attributes, so this works perfectly.
            set({ cart: response.data, isLoading: false });
            toast.success(`${product.name} added to cart!`);
            get().openCart();

        } catch (error) {
            const message = error.response?.data?.message || 'Could not add item to cart.';
            console.error("Add Item to Cart Error:", error);
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
            console.error("Update Item Quantity Error:", error);
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
            console.error("Remove Item Error:", error);
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
        console.log("Cart cleared after successful order.");
    },

}));