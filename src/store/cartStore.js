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

    // Toggles the visibility of the cart sidebar
    toggleCart: () => set(state => ({ isCartOpen: !state.isCartOpen })),
    openCart: () => set({ isCartOpen: true }),

    // Fetches the cart from the backend or creates a new one
    initializeCart: async () => {
        const cartId = get().cartId;
        if (!cartId) {
            console.log("No cartId in storage. Cart will be created on first item add.");
            set({ cart: { items: [] } }); // Set a default empty cart structure
            return;
        }

        set({ isLoading: true });
        try {
            // The /carts/:cartId route creates a cart if not found, which is perfect.
            const response = await api.get(`/carts/${cartId}`);
            set({ cart: response.data, isLoading: false });
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to fetch cart.';
            console.error("Initialize Cart Error:", error);
            // If cart not found (e.g., expired in Redis), clear the local cartId
            if (error.response?.status === 404) {
                localStorage.removeItem(CART_ID_STORAGE_KEY);
                set({ cart: { items: [] }, cartId: null, error: message, isLoading: false });
            } else {
                set({ error: message, isLoading: false });
                toast.error(message);
            }
        }
    },
    
    // Adds an item to the cart
    addItem: async (product, variant, quantity) => {
        set({ isLoading: true });
        let currentCartId = get().cartId;

        try {
            const payload = {
                productId: product.id,
                variantId: variant.id,
                quantity,
                price: variant.price,
                name: product.name,
                imageUrl: product.images?.find(img => img.isPrimary)?.imageUrl || product.images?.[0]?.imageUrl
            };

            let response;
            // If we have a cartId, add to it. If not, POST to create and add simultaneously.
            const url = currentCartId ? `/carts/${currentCartId}/items` : '/carts/items';
            
            // The backend is smart: POST to /:cartId/items creates cart if it doesn't exist.
            // Let's create the cart first if we don't have an ID, to be explicit.
            if (!currentCartId) {
                const createCartResponse = await api.post('/carts');
                currentCartId = createCartResponse.data.id;
                set({ cartId: currentCartId });
                localStorage.setItem(CART_ID_STORAGE_KEY, currentCartId);
            }

            response = await api.post(`/carts/${currentCartId}/items`, payload);

            set({ cart: response.data, isLoading: false });
            toast.success(`${product.name} added to cart!`);
            get().openCart(); // Open cart sidebar on successful add

        } catch (error) {
            const message = error.response?.data?.message || 'Could not add item to cart.';
            console.error("Add Item to Cart Error:", error);
            set({ error: message, isLoading: false });
            toast.error(message);
        }
    },

    // Updates an item's quantity in the cart
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

    // Removes an item from the cart
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
}));