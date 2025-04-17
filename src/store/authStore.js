// src/store/authStore.js
import { create } from 'zustand'
import { api } from '../services/api'
import { toast } from 'react-toastify'; // Import toast

export const useAuthStore = create((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  // Login user
  login: async (credentials) => {
    try {
      set({ isLoading: true, error: null })
      const response = await api.post('/auth/login', credentials)
      const { token } = response.data
      
      // Store token in localStorage
      localStorage.setItem('token', token)
      
      // Fetch user data
      await get().fetchUser()
      
      toast.success('Logged in successfully')
      return true
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to login'
      set({ error: message, isLoading: false })
      toast.error(message)
      return false
    }
  },

  // Register user
  register: async (userData) => {
    try {
      set({ isLoading: true, error: null })
      await api.post('/auth/register', userData)
      
      toast.success('Registration successful! Please login.')
      set({ isLoading: false })
      return true
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed'
      set({ error: message, isLoading: false })
      toast.error(message)
      return false
    }
  },

  // Fetch current user
  fetchUser: async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      set({ user: null, isAuthenticated: false, isLoading: false })
      return
    }

    try {
      set({ isLoading: true })
      
      // Make an API call to fetch the user data
      const response = await api.get('/auth/me')
      const userData = response.data
      
      set({ 
        user: userData,
        isAuthenticated: true,
        isLoading: false
      })
      console.log(userData)

    } catch (error) {
      console.error('Error fetching user:', error)
      console.log(error)
      // If the token is invalid or expired, the server will return 401
      // In that case, we should clear the token and log the user out
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


  // Logout user
  logout: () => {
    localStorage.removeItem('token')
    set({ user: null, isAuthenticated: false })
    toast.success('Logged out successfully')
  },

  // Check if user has required role
  hasRole: (roles) => {
    const { user } = get()
    if (!user) return false
    if (!roles || roles.length === 0) return true
    
    return roles.includes(user.role)
  }
}))