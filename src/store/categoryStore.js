import { create } from 'zustand';
import { api } from '../services/api';
import { toast } from 'react-toastify';

// Helper function to build a tree from a flat list of categories
const buildCategoryTree = (categories) => {
    const categoryMap = new Map(categories.map(cat => [cat.id, { ...cat, children: [] }]));
    const tree = [];

    categories.forEach(cat => {
        const mappedCat = categoryMap.get(cat.id);
        if (cat.parentId && categoryMap.has(cat.parentId)) {
            const parent = categoryMap.get(cat.parentId);
            parent.children.push(mappedCat);
        } else {
            tree.push(mappedCat);
        }
    });
    return tree;
};


export const useCategoryStore = create((set) => ({
    // 'categories' will now store the nested tree structure
    categories: [], 
    // 'flatCategories' will store the original response for other uses
    flatCategories: [], 
    isLoading: false,
    error: null,
    
    // Fetch all categories and build the tree
    fetchCategories: async () => {
        set({ isLoading: true, error: null });
        try {
            // Fetching a flat list. Assuming the backend provides all categories in one go.
            // Using a large limit to get all categories for tree building.
            const response = await api.get('/products/categories', { params: { limit: 100 } });
            
            let fetchedCategories = [];
            if (Array.isArray(response.data)) {
                fetchedCategories = response.data;
            } else if (response.data && response.data.data) {
                fetchedCategories = response.data.data;
            } else {
                 throw new Error("Unexpected categories response format.");
            }
            
            const categoryTree = buildCategoryTree(fetchedCategories);

            set({
                categories: categoryTree,
                flatCategories: fetchedCategories,
                isLoading: false,
            });

        } catch (error) {
            const message = error.response?.data?.message || 'Failed to fetch categories';
            console.error("Fetch Categories Error:", error);
            set({ error: message, isLoading: false });
            toast.error(message);
        }
    },
}));