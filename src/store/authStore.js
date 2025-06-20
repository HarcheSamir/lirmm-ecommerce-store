import { create } from 'zustand';
import { api } from '../services/api';
import { toast } from 'react-toastify';
import { useCartStore } from './cartStore'; // <-- IMPORT THE CART STORE

export const useAuthStore = create((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (credentials) => {
    try {
      set({ isLoading: true, error: null });
      const response = await api.post('/auth/login', credentials);
      const { token } = response.data;

      localStorage.setItem('token', token);
      
      // Fetch user data FIRST to get the user ID
      await get().fetchUser();

      // NOW, associate the guest cart with the newly fetched user
      const newlyLoggedInUser = get().user;
      if (newlyLoggedInUser) {
        await useCartStore.getState().associateCartOnLogin(newlyLoggedInUser.id);
      }

      toast.success('Logged in successfully');
      return true;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to login';
      set({ error: message, isLoading: false });
      toast.error(message);
      return false;
    }
  },

  register: async (userData) => {
    try {
      set({ isLoading: true, error: null });
      const response = await api.post('/auth/register', userData);
      const { token } = response.data;

      localStorage.setItem('token', token);
      
      // Fetch user data FIRST to get the user ID
      await get().fetchUser();
      
      // NOW, associate the guest cart with the newly registered user
      const newlyRegisteredUser = get().user;
      if (newlyRegisteredUser) {
        await useCartStore.getState().associateCartOnLogin(newlyRegisteredUser.id);
      }

      toast.success('Account created successfully!');
      return true;
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      set({ error: message, isLoading: false });
      toast.error(message);
      return false;
    }
  },

  // ... (fetchUser, logout, hasRole functions are unchanged)
  
  // --- Previous code in the file ---
  // (The full, existing code for all other functions follows here without modification)
  fetchUser: async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      set({ user: null, isAuthenticated: false, isLoading: false })
      return
    }
    try {
      set({ isLoading: true })
      const response = await api.get('/auth/me')
      const userData = response.data
      set({
        user: userData,
        isAuthenticated: true,
        isLoading: false
      })
    } catch (error) {
      console.error('Error fetching user:', error)
      if (error.response?.status === 401) {
        localStorage.removeItem('token')
      }
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: error.response?.data?.message || 'Session expired'
      })
      toast.error('Session expired. Please login again.')
    }
  },
  logout: () => {
    localStorage.removeItem('token')
    set({ user: null, isAuthenticated: false })
    toast.success('Logged out successfully')
  },
  hasRole: (roles) => {
    const { user } = get()
    if (!user) return false
    if (!roles || roles.length === 0) return true
    return roles.includes(user.role)
  }
}));