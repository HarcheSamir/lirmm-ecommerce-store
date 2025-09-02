// src/pages/ShopPage.jsx
import { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useSearchStore } from '../store/searchStore';
import { useCategoryStore } from '../store/categoryStore';
import { useSettings } from '../context/SettingsContext';
import { useTranslation } from 'react-i18next';
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
    const { language, currency } = useSettings();
    const { t } = useTranslation();
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

    const formatPrice = (price) => {
        return new Intl.NumberFormat(language, { style: 'currency', currency, minimumFractionDigits: 0 }).format(price);
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
                <span>{formatPrice(localPrice[0])}</span>
                <span>{localPrice[1] === MAX_PRICE ? `${formatPrice(MAX_PRICE)}+` : formatPrice(localPrice[1])}</span>
            </div>
        </div>
    );
};

const AttributeFilter = () => {
    const { facets, filters, toggleAttribute } = useSearchStore();
    const { t } = useTranslation();
    if (!facets.attributes || facets.attributes.length === 0) return null;

    return (
        <>
            {facets.attributes.map(attr => (
                <FilterSection key={attr.name} title={t(attr.name.toLowerCase()) || attr.name} defaultOpen={true}>
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
    const { t } = useTranslation();

    const handleCategoryChange = (slug) => {
        setFilter('category', slug);
        navigate(`/shop/${slug}`);
    };

    return (
        <FilterSection title={t('category')} defaultOpen={true}>
            <div className="space-y-1">
                <button
                    onClick={() => handleCategoryChange('all')}
                    className={`w-full text-left text-sm p-2 rounded-md ${filters.category === 'all' ? 'bg-primary/10 text-primary font-semibold' :'hover:bg-gray-100'}`}
                >
                    {t('all_products')}
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
    const { t } = useTranslation();

    return (
        <aside className="w-full lg:w-72 lg:flex-shrink-0">
            <div className="sticky top-24">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">{t('filters')}</h2>
                    <button onClick={clearFilters} className="text-sm text-primary hover:underline">{t('clear_all')}</button>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200/80 shadow-sm relative">
                    {isLoading && <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10"><FiLoader className="animate-spin text-primary" size={24}/></div>}
                    <CategoryFilter />
                    <FilterSection title={t('price_range')} defaultOpen={true}>
                        <PriceSlider />
                    </FilterSection>
                    <AttributeFilter />
                    <FilterSection title={t('availability')} defaultOpen={true}>
                         <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                checked={filters.inStock}
                                onChange={(e) => setFilter('inStock', e.target.checked)}
                            />
                            <span className="text-sm text-gray-700">{t('in_stock')}</span>
                        </label>
                    </FilterSection>
                </div>
            </div>
        </aside>
    );
};

const ProductGrid = () => {
    const { products, pagination, setFilter, filters, isLoading } = useSearchStore();
    const { t } = useTranslation();
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
                    {t('showing_products_of', { count: products.length, total: pagination.total })}
                </p>
                <div className="flex items-center gap-2">
                    <label htmlFor="sort" className="text-sm font-medium">{t('sort_by')}</label>
                    <select id="sort"
                        value={`${filters.sortBy}-${filters.sortOrder}`}
                        onChange={handleSortChange}
                        className="text-sm rounded-md border-gray-300 focus:ring-primary focus:border-primary">
                        <option value="_score-desc">{t('relevance')}</option>
                        <option value="createdAt-desc">{t('newest')}</option>
                        <option value="price-asc">{t('price_low_to_high')}</option>
                        <option value="price-desc">{t('price_high_to_low')}</option>
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
                        <h3 className="text-2xl font-semibold">{t('no_products_found')}</h3>
                        <p className="text-gray-500 mt-2">{t('adjust_filters_prompt')}</p>
                    </div>
                )}
            </div>

            {pagination.totalPages > 1 && !isLoading && (
                 <div className="flex justify-center items-center mt-10 gap-2">
                    <button onClick={() => handlePageChange(pagination.page - 1)} disabled={pagination.page === 1} className="px-4 py-2 border rounded-md disabled:opacity-50">{t('prev')}</button>
                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(pageNumber => (
                        <button key={pageNumber} onClick={() => handlePageChange(pageNumber)} className={`px-4 py-2 border rounded-md ${pagination.page === pageNumber ? 'bg-primary text-white' : ''}`}>
                            {pageNumber}
                        </button>
                    ))}
                    <button onClick={() => handlePageChange(pagination.page + 1)} disabled={pagination.page === pagination.totalPages} className="px-4 py-2 border rounded-md disabled:opacity-50">{t('next')}</button>
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
    const { t } = useTranslation();

    useEffect(() => {
        const initialCategory = categorySlug || 'all';
        setFilter('category', initialCategory);
    }, [categorySlug, setFilter]);

    useEffect(() => {
        fetchProducts();
    }, [filters.page, location.key]);

    const pageTitle = useMemo(() => {
        if (filters.q) return t('shop_page_results_for', { query: filters.q });
        if (filters.category === 'all') return t('all_products');
        const category = flatCategories.find(c => c.slug === filters.category);
        return category ? category.name : t('all_products');
    }, [filters.category, filters.q, flatCategories, t]);

    return (
        <div className="bg-gray-50 min-h-screen">
            <HomeNavbar />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">{pageTitle}</h1>
                    <p className="mt-2 text-md text-gray-500">{t('shop_page_subtitle')}</p>
                </div>

                <div className="lg:hidden mb-4">
                    <button
                        onClick={() => setMobileFilterOpen(true)}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-md bg-white text-sm font-medium">
                        <FiFilter /> {t('filters')}
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