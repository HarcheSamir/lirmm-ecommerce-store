// src/store/productStore.js
import { create } from 'zustand';
import { api } from '../services/api';
import { toast } from 'react-toastify';



export const useProductStore = create((set, get) => ({
  products: [],
  product: null, // For detail view
  isLoading: false,
  error: null,
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  },

  // Fetch Products (Paginated List)
  fetchProducts: async (page = 1, limit = 10, params = {}) => {
    try {
      set({ isLoading: true, error: null });
      const response = await api.get('/products', {
        params: { page, limit, ...params },
      });
      set({
        products: response.data.data,
        pagination: response.data.pagination,
        isLoading: false,
      });
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch products';
      console.error("Fetch Products Error:", error);
      set({ error: message, isLoading: false });
      toast.error(message);
    }
  },



  // Fetch Product by ID
  fetchProductById: async (id) => {
    try {
        set({ isLoading: true, error: null, product: null });
        const response = await api.get(`/products/id/${id}`);
        set({
            product: response.data,
            isLoading: false,
        });
        return response.data;
    } catch (error) {
        const message = error.response?.data?.message || 'Failed to fetch product details';
        console.error("Fetch Product By ID Error:", error);
        set({ error: message, isLoading: false });
        toast.error(message);
        return null;
    }
  },


  


}));