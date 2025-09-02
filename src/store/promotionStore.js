import { create } from 'zustand';
import { api } from '../services/api';
import { toast } from 'react-toastify';

export const usePromotionStore = create((set) => ({
  promotions: [],
  isLoading: false,
  error: null,

  fetchActivePromotions: async () => {
    set({ isLoading: true, error: null });
    try {
      // The backend endpoint is now /products/promotions
      const response = await api.get('/products/promotions');
      set({
        promotions: response.data,
        isLoading: false,
      });
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch promotions';
      console.error("Fetch Active Promotions Error:", error);
      set({ error: message, isLoading: false, promotions: [] });
      toast.error("Could not load promotional content.");
    }
  },
}));