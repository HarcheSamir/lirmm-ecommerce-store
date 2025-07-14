// src/store/searchStore.js
import { create } from 'zustand';
import { api } from '../services/api';

const buildQueryString = (filters) => {
    const params = new URLSearchParams();

    if (filters.q) params.append('q', filters.q);
    if (filters.category && filters.category !== 'all') params.append('category', filters.category);
    if (filters.minPrice) params.append('minPrice', filters.minPrice);
    if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
    if (filters.inStock) params.append('inStock', 'true');
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);
    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit);

    if (filters.attributes) {
        Object.entries(filters.attributes).forEach(([key, values]) => {
            if (Array.isArray(values)) {
                values.forEach(value => {
                    params.append(`attributes[${key}][]`, value);
                });
            }
        });
    }

    return params.toString();
};

export const useSearchStore = create((set, get) => ({
    products: [],
    facets: {},
    pagination: { total: 0, page: 1, limit: 24, totalPages: 1 },
    filters: {
        q: '',
        category: 'all',
        minPrice: 0,
        maxPrice: 2000,
        inStock: false,
        attributes: {},
        sortBy: '_score',
        sortOrder: 'desc',
        page: 1,
        limit: 24,
    },
    suggestions: [],
    isSuggestionsLoading: false,
    isLoading: false,
    error: null,

    fetchProducts: async () => {
        set({ isLoading: true, error: null });
        const currentFilters = get().filters;
        const queryString = buildQueryString(currentFilters);

        try {
            const response = await api.get(`/search/products?${queryString}`);
            const { data, pagination, facets } = response.data;
            set({
                products: data,
                pagination,
                facets,
                isLoading: false,
            });
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to search for products.';
            console.error("Search API Error:", error);
            set({ error: message, isLoading: false, products: [], facets: {}, pagination: { total: 0, page: 1, limit: 24, totalPages: 1 } });
        }
    },

    fetchSuggestions: async (query) => {
        if (!query) {
            set({ suggestions: [] });
            return;
        }
        set({ isSuggestionsLoading: true });
        try {
            const response = await api.get(`/search/products?q=${query}&limit=5`);
            set({ suggestions: response.data.data, isSuggestionsLoading: false });
        } catch (error) {
            console.error("Fetch Suggestions Error:", error);
            set({ suggestions: [], isSuggestionsLoading: false });
        }
    },

    clearSuggestions: () => {
        set({ suggestions: [], isSuggestionsLoading: false });
    },

    setFilter: (key, value) => {
        set(state => ({
            filters: { ...state.filters, [key]: value, page: 1 }
        }));
        get().fetchProducts();
    },

    setPriceRange: (values) => {
        set(state => ({
            filters: { ...state.filters, minPrice: values[0], maxPrice: values[1], page: 1 }
        }));
    },

    toggleAttribute: (attrName, optionValue) => {
        set(state => {
            const currentValues = state.filters.attributes[attrName] || [];
            const newValues = currentValues.includes(optionValue)
                ? currentValues.filter(v => v !== optionValue)
                : [...currentValues, optionValue];
            
            const newAttributes = { ...state.filters.attributes, [attrName]: newValues };
            
            if (newValues.length === 0) {
                delete newAttributes[attrName];
            }

            return { filters: { ...state.filters, attributes: newAttributes, page: 1 } };
        });
        get().fetchProducts();
    },

    clearFilters: () => {
        set({
            filters: {
                q: '',
                category: get().filters.category,
                minPrice: 0,
                maxPrice: 2000,
                inStock: false,
                attributes: {},
                sortBy: '_score',
                sortOrder: 'desc',
                page: 1,
                limit: 24,
            }
        });
        get().fetchProducts();
    },
}));