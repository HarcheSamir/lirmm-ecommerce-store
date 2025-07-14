// src/pages/ShopPage.jsx
import { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useSearchStore } from '../store/searchStore';
import { useCategoryStore } from '../store/categoryStore';
import debounce from 'lodash.debounce';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { FiFilter, FiX, FiChevronDown, FiChevronUp, FiLoader } from 'react-icons/fi';
import HomeNavbar from '../components/HomeNavbar';
import Footer from './Home/sections/Footer';
import ProductCard from '../components/ProductCard';
import ProductCardSkeleton from '../components/ProductCardSkeleton';

const MAX_PRICE = 2000;

const FilterSection = ({ title, children, defaultOpen = false }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    return (
        <div className="py-4 border-b border-gray-200">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center"
            >
                <h3 className="text-md font-semibold text-gray-800">{title}</h3>
                {isOpen ? <FiChevronUp /> : <FiChevronDown />}
            </button>
            <div className={`mt-4 transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                {children}
            </div>
        </div>
    );
};

const PriceSlider = () => {
    const { filters, setPriceRange, fetchProducts } = useSearchStore();
    const [localPrice, setLocalPrice] = useState([filters.minPrice, filters.maxPrice]);

    const debouncedFetch = useCallback(debounce(fetchProducts, 500), [fetchProducts]);

    useEffect(() => {
        setLocalPrice([filters.minPrice, filters.maxPrice]);
    }, [filters.minPrice, filters.maxPrice]);
    
    const handleChange = (newValues) => {
        setLocalPrice(newValues);
        setPriceRange(newValues);
        debouncedFetch();
    };

    return (
        <div className="px-2">
            <Slider
                range
                min={0}
                max={MAX_PRICE}
                value={localPrice}
                onChangeComplete={handleChange}
                onChange={setLocalPrice}
                allowCross={false}
                step={10}
            />
            <div className="flex justify-between mt-2 text-sm text-gray-600">
                <span>${localPrice[0]}</span>
                <span>${localPrice[1] === MAX_PRICE ? `${MAX_PRICE}+` : localPrice[1]}</span>
            </div>
        </div>
    );
};

const AttributeFilter = () => {
    const { facets, filters, toggleAttribute } = useSearchStore();
    if (!facets.attributes || facets.attributes.length === 0) return null;

    return (
        <>
            {facets.attributes.map(attr => (
                <FilterSection key={attr.name} title={attr.name} defaultOpen={true}>
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                        {attr.options.map(option => (
                            <label key={option.value} className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                    checked={filters.attributes[attr.name]?.includes(option.value) || false}
                                    onChange={() => toggleAttribute(attr.name, option.value)}
                                />
                                <span className="text-sm text-gray-700">{option.value}</span>
                                <span className="ml-auto text-xs text-gray-400">{option.count}</span>
                            </label>
                        ))}
                    </div>
                </FilterSection>
            ))}
        </>
    );
};

const CategoryFilter = () => {
    const { flatCategories } = useCategoryStore();
    const { setFilter, filters } = useSearchStore();
    const navigate = useNavigate();

    const handleCategoryChange = (slug) => {
        setFilter('category', slug);
        navigate(`/shop/${slug}`);
    };
    
    return (
        <FilterSection title="Category" defaultOpen={true}>
            <div className="space-y-1">
                <button
                    onClick={() => handleCategoryChange('all')}
                    className={`w-full text-left text-sm p-2 rounded-md ${filters.category === 'all' ? 'bg-primary/10 text-primary font-semibold' : 'hover:bg-gray-100'}`}
                >
                    All Products
                </button>
                {flatCategories.filter(c => !c.parentId).map(parent => (
                    <div key={parent.id}>
                        <button
                            onClick={() => handleCategoryChange(parent.slug)}
                            className={`w-full text-left text-sm p-2 rounded-md ${filters.category === parent.slug ? 'bg-primary/10 text-primary font-semibold' : 'hover:bg-gray-100'}`}
                        >
                            {parent.name}
                        </button>
                        <div className="pl-4">
                            {flatCategories.filter(c => c.parentId === parent.id).map(child => (
                                <button
                                    key={child.id}
                                    onClick={() => handleCategoryChange(child.slug)}
                                    className={`w-full text-left text-sm p-2 rounded-md ${filters.category === child.slug ? 'bg-primary/10 text-primary font-semibold' : 'hover:bg-gray-100'}`}
                                >
                                    {child.name}
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </FilterSection>
    );
};

const FilterSidebar = () => {
    const { filters, setFilter, clearFilters, isLoading } = useSearchStore();

    return (
        <aside className="w-full lg:w-72 lg:flex-shrink-0">
            <div className="sticky top-24">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Filters</h2>
                    <button onClick={clearFilters} className="text-sm text-primary hover:underline">Clear all</button>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200/80 shadow-sm relative">
                    {isLoading && <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10"><FiLoader className="animate-spin text-primary" size={24}/></div>}
                    <CategoryFilter />
                    <FilterSection title="Price Range" defaultOpen={true}>
                        <PriceSlider />
                    </FilterSection>
                    <AttributeFilter />
                    <FilterSection title="Availability" defaultOpen={true}>
                         <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                checked={filters.inStock}
                                onChange={(e) => setFilter('inStock', e.target.checked)}
                            />
                            <span className="text-sm text-gray-700">In Stock</span>
                        </label>
                    </FilterSection>
                </div>
            </div>
        </aside>
    );
};

const ProductGrid = () => {
    const { products, pagination, setFilter, filters, isLoading } = useSearchStore();
    const location = useLocation();

    useEffect(() => {
        setFilter('page', 1);
    }, [location.pathname, setFilter]);
    
    const handleSortChange = (e) => {
        const [sortBy, sortOrder] = e.target.value.split('-');
        setFilter('sortBy', sortBy);
        setFilter('sortOrder', sortOrder);
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.totalPages) {
            setFilter('page', newPage);
            window.scrollTo(0, 0);
        }
    };

    return (
        <div className="flex-1">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 p-4 bg-white rounded-lg border border-gray-200/80 shadow-sm">
                <p className="text-sm text-gray-600 mb-2 sm:mb-0">
                    Showing <span className="font-semibold text-primary">{products.length}</span> of <span className="font-semibold text-primary">{pagination.total}</span> products
                </p>
                <div className="flex items-center gap-2">
                    <label htmlFor="sort" className="text-sm font-medium">Sort by:</label>
                    <select id="sort"
                        value={`${filters.sortBy}-${filters.sortOrder}`}
                        onChange={handleSortChange}
                        className="text-sm rounded-md border-gray-300 focus:ring-primary focus:border-primary">
                        <option value="_score-desc">Relevance</option>
                        <option value="createdAt-desc">Newest</option>
                        <option value="price-asc">Price: Low to High</option>
                        <option value="price-desc">Price: High to Low</option>
                    </select>
                </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {isLoading ? (
                    Array.from({ length: 12 }).map((_, i) => <ProductCardSkeleton key={i} />)
                ) : products.length > 0 ? (
                    products.map((product, i) => <ProductCard key={product.id} product={product} index={i} />)
                ) : (
                    <div className="col-span-full text-center py-20 bg-white rounded-lg">
                        <h3 className="text-2xl font-semibold">No Products Found</h3>
                        <p className="text-gray-500 mt-2">Try adjusting your filters.</p>
                    </div>
                )}
            </div>

            {pagination.totalPages > 1 && !isLoading && (
                 <div className="flex justify-center items-center mt-10 gap-2">
                    <button onClick={() => handlePageChange(pagination.page - 1)} disabled={pagination.page === 1} className="px-4 py-2 border rounded-md disabled:opacity-50">Prev</button>
                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(pageNumber => (
                        <button key={pageNumber} onClick={() => handlePageChange(pageNumber)} className={`px-4 py-2 border rounded-md ${pagination.page === pageNumber ? 'bg-primary text-white' : ''}`}>
                            {pageNumber}
                        </button>
                    ))}
                    <button onClick={() => handlePageChange(pagination.page + 1)} disabled={pagination.page === pagination.totalPages} className="px-4 py-2 border rounded-md disabled:opacity-50">Next</button>
                </div>
            )}
        </div>
    );
};

export default function ShopPage() {
    const { categorySlug } = useParams();
    const { setFilter, filters, fetchProducts } = useSearchStore();
    const [isMobileFilterOpen, setMobileFilterOpen] = useState(false);
    const { flatCategories } = useCategoryStore();
    const location = useLocation();

    useEffect(() => {
        const initialCategory = categorySlug || 'all';
        setFilter('category', initialCategory);
    }, [categorySlug, setFilter]);

    useEffect(() => {
        fetchProducts();
    }, [filters.page, location.key]);

    const pageTitle = useMemo(() => {
        if(filters.q) return `Results for "${filters.q}"`;
        if (filters.category === 'all') return "All Products";
        const category = flatCategories.find(c => c.slug === filters.category);
        return category ? category.name : "Shop";
    }, [filters.category, filters.q, flatCategories]);
    
    return (
        <div className="bg-gray-50 min-h-screen">
            <HomeNavbar />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">{pageTitle}</h1>
                    <p className="mt-2 text-md text-gray-500">Find your next favorite item from our curated collection.</p>
                </div>

                <div className="lg:hidden mb-4">
                    <button 
                        onClick={() => setMobileFilterOpen(true)}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-md bg-white text-sm font-medium">
                        <FiFilter /> Filters
                    </button>
                </div>
                
                {isMobileFilterOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setMobileFilterOpen(false)}>
                        <div className="fixed inset-y-0 left-0 w-80 bg-gray-50 p-4 overflow-y-auto" onClick={e => e.stopPropagation()}>
                            <button onClick={() => setMobileFilterOpen(false)} className="absolute top-4 right-4"><FiX/></button>
                            <FilterSidebar />
                        </div>
                    </div>
                )}
                
                <div className="flex flex-col lg:flex-row gap-8">
                    <div className="hidden lg:block">
                        <FilterSidebar />
                    </div>
                    <ProductGrid />
                </div>
            </main>
            <Footer />
        </div>
    );
}