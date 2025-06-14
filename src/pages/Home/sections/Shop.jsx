import { useState, useRef, useEffect } from "react";
import { Link } from 'react-router-dom';
import { useProductStore } from "../../../store/productStore";
import { useCategoryStore } from "../../../store/categoryStore";
import { useCartStore } from '../../../store/cartStore';
import { FiChevronLeft, FiChevronRight, FiEye, FiHeart, FiShoppingCart } from "react-icons/fi";
import { toast } from 'react-toastify';

// ===================================================================================
// COMPONENT 1: ProductCardSkeleton
// ===================================================================================
const ProductCardSkeleton = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden animate-pulse">
        <div className="relative h-56 bg-slate-200"></div>
        <div className="p-4"><div className="h-3 bg-slate-200 rounded w-1/3 mb-2"></div><div className="h-4 bg-slate-200 rounded w-full mb-3"></div><div className="h-5 bg-slate-200 rounded w-1/4"></div></div>
    </div>
);

// ===================================================================================
// COMPONENT 2: ProductCard (REBUILT. THIS IS THE DEFINITIVE FIX.)
// ===================================================================================
const ProductCard = ({ product }) => {
    const addItem = useCartStore(state => state.addItem);

    // This logic is now purely for getting the image URLs. State is no longer needed for the hover effect.
    const primaryImage = product?.images?.find(img => img.isPrimary) || product?.images?.[0];
    const hoverImage = product?.images?.find(img => img.order === 2) || primaryImage;

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const defaultVariant = product.variants?.[0];
        if (product && defaultVariant) { addItem(product, defaultVariant, 1); } 
        else { toast.error("This product cannot be added to the cart."); }
    };

    if (!product) return <ProductCardSkeleton />;

    const firstVariant = product.variants?.[0];
    const categoryName = product.categories?.[0]?.category?.name || 'Uncategorized';

    return (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden group relative transition-shadow duration-300 hover:shadow-lg">
            <Link to={`/products/${product.id}`} className="block">
                <div className="relative h-56 overflow-hidden">
                    {/*
                        THE DEFINITIVE FIX FOR IMAGE SWAP:
                        Two images are rendered. The hover image starts invisible (opacity-0).
                        On group-hover, the primary image fades out, and the hover image fades in.
                        This is a pure CSS solution and cannot fail.
                    */}
                    <img
                        src={primaryImage?.imageUrl || 'https://placehold.co/400x400/e2e8f0/cccccc?text=Img+1'}
                        alt={product.name}
                        className="absolute inset-0 w-full h-full object-cover transition-all duration-300 ease-in-out group-hover:scale-105 group-hover:opacity-0"
                    />
                    <img
                        src={hoverImage?.imageUrl || primaryImage?.imageUrl || 'https://placehold.co/400x400/e2e8f0/cccccc?text=Img+2'}
                        alt={product.name}
                        className="absolute inset-0 w-full h-full object-cover transition-all duration-300 ease-in-out group-hover:scale-105 opacity-0 group-hover:opacity-100"
                    />
                    
                    {/* The Overlay - This now correctly darkens whichever image is visible. */}
                    <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none"></div>
                    
                    {/* Action Icons - Corrected starting position */}
                    <div className="absolute top-4 right-0 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all ease-in-out duration-300 transform translate-x-full group-hover:translate-x-0 group-hover:right-4">
                        <button onClick={(e) => {e.preventDefault(); toast.info("Added to Wishlist!");}} className="w-9 h-9 bg-white rounded-full flex items-center justify-center text-slate-600 hover:bg-primary hover:text-white transition-colors shadow-sm"><FiHeart size={16}/></button>
                        <button onClick={(e) => {e.preventDefault(); toast.info("Quick view coming soon!");}} className="w-9 h-9 bg-white rounded-full flex items-center justify-center text-slate-600 hover:bg-primary hover:text-white transition-colors shadow-sm"><FiEye size={16}/></button>
                    </div>

                    {/* Color Swatches - Corrected starting position and animation */}
                    <div className="absolute bottom-0 left-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all ease-in-out duration-300 transform translate-y-full group-hover:-translate-y-4">
                        {product.variants?.filter(v => v.attributes.colorHex).slice(0, 4).map(variant => (
                            <span key={variant.id} className="w-6 h-6 rounded-full border-2 border-white shadow-md cursor-pointer" style={{ backgroundColor: variant.attributes.colorHex }}></span>
                        ))}
                    </div>
                </div>

                <div className="p-4">
                    <p className="text-xs text-slate-500 mb-1">{categoryName}</p>
                    <h3 className="text-sm font-semibold text-slate-800 truncate" title={product.name}>{product.name}</h3>
                    <p className="text-lg font-bold text-primary mt-1">{firstVariant?.price ? `$${parseFloat(firstVariant.price).toFixed(2)}` : 'N/A'}</p>
                </div>
            </Link>
            <div className="absolute bottom-0 left-0 right-0 transition-transform duration-300 transform translate-y-full group-hover:translate-y-0 z-10">
                 <button onClick={handleAddToCart} className="w-full bg-primary text-white font-semibold py-2.5 flex items-center justify-center gap-2 hover:bg-fblack transition-colors text-sm"><FiShoppingCart size={16}/>Add to Cart</button>
            </div>
        </div>
    );
};

// ===================================================================================
// COMPONENT 3: The Main Shop Component (Unchanged)
// ===================================================================================
export default function Shop() {
    const newArrivalsScrollRef = useRef(null);
    const { products, fetchProducts, isLoading: productsLoading } = useProductStore();
    const { categories, fetchCategories, isLoading: categoriesLoading } = useCategoryStore();

    useEffect(() => {
        fetchProducts(1, 20, { sortBy: 'createdAt', sortOrder: 'desc', isActive: 'true' });
        fetchCategories(1, 12);
    }, [fetchProducts, fetchCategories]);

    const handleCarouselScroll = (direction) => {
        const scrollContainer = newArrivalsScrollRef.current;
        if (scrollContainer) {
            const scrollAmount = scrollContainer.offsetWidth * 0.9;
            scrollContainer.scrollBy({ left: direction === "left" ? -scrollAmount : scrollAmount, behavior: "smooth" });
        }
    };

    const newArrivals = products.slice(0, 8);
    const featuredProducts = products.slice(8, 11);
    const mostViewed = products.slice(11, 14);
    const weThinkYoullLove = products.slice(14, 17);

    const categoryIcons = { 'default': '🏷️', 'electronique': '🎧', 'maison-cuisine': '🏺', 'mode': '👜', 'bijoux': '💍', 'sante-beaute': '💄', 'jouets-jeux': '🎮', 'accessoires': '👶', 'sport-plein-air': '🚴' };

    return (
        <div className="min-h-screen max-w-6xl mx-auto bg-white" id="shop">
            <section className="pl-4 md:pl-6 py-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 pr-4 md:pr-6">Explore Popular Categories</h2>
                <div className="overflow-x-auto no-scrollbar"><div className="flex gap-4 sm:gap-8 pr-4 md:pr-6">{categoriesLoading ? Array.from({ length: 8 }).map((_, i) => <div key={i} className="flex flex-col items-center w-20 animate-pulse"><div className="w-16 h-16 bg-slate-200 rounded-full mb-2"/><div className="h-3 bg-slate-200 rounded w-12"/></div>) : categories.map((cat) => (<Link to={`/category/${cat.slug}`} key={cat.id} className="flex flex-col items-center flex-shrink-0 w-20 text-center group"><div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-2xl mb-2 cursor-pointer group-hover:scale-105 transition-transform">{categoryIcons[cat.slug] || categoryIcons['default']}</div><span className="text-xs text-gray-600">{cat.name}</span></Link>))}</div></div>
            </section>
            <section className="py-8">
                <div className="flex justify-between items-center mb-6 px-4 md:px-6"><h2 className="text-xl font-semibold text-gray-900">New Arrivals</h2><Link to="/category/all" className="text-sm text-blue-600 hover:underline">See All Products</Link></div>
                <div className="relative flex items-center">
                     <button onClick={() => handleCarouselScroll('left')} className="p-2 rounded-full bg-white shadow-md hover:bg-gray-100 transition-colors z-10 ml-2 md:ml-0 absolute left-0"><FiChevronLeft className="w-5 h-5" /></button>
                    <div ref={newArrivalsScrollRef} className="flex gap-6 overflow-x-auto no-scrollbar snap-x snap-mandatory px-4 py-2">
                        {productsLoading ? Array.from({ length: 5 }).map((_, index) => <div key={index} className="snap-start flex-shrink-0 w-[85%] sm:w-[45%] md:w-[30%] lg:w-[270px]"><ProductCardSkeleton /></div>)
                        : newArrivals.map((product) => (<div key={product.id} className="snap-start flex-shrink-0 w-[85%] sm:w-[45%] md:w-[30%] lg:w-[270px]"><ProductCard product={product} /></div>))}
                    </div>
                     <button onClick={() => handleCarouselScroll('right')} className="p-2 rounded-full bg-white shadow-md hover:bg-gray-100 transition-colors z-10 mr-2 md:mr-0 absolute right-0"><FiChevronRight className="w-5 h-5" /></button>
                </div>
            </section>
            <section className="px-4 md:px-6 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Featured Products</h3>
                        <div className="space-y-4">{productsLoading ? Array.from({ length: 3 }).map((_, i) => <div key={i} className="flex gap-3 p-2 animate-pulse"><div className="w-16 h-16 bg-slate-200 rounded-lg"/><div className="flex-1 space-y-2 py-1"><div className="h-4 bg-slate-200 rounded w-full"/><div className="h-4 bg-slate-200 rounded w-2/3"/></div></div>) : featuredProducts.map((product) => (<Link to={`/products/${product.id}`} key={product.id} className="flex gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"><img src={product.images?.[0]?.imageUrl || 'https://placehold.co/150x150/e2e8f0/cccccc?text=Img'} alt={product.name} className="w-16 h-16 object-cover rounded-lg flex-shrink-0 bg-gray-100"/><div><h4 className="text-sm font-medium text-gray-900 line-clamp-2">{product.name}</h4><span className="text-sm font-semibold text-gray-900">${product.variants?.[0]?.price ? parseFloat(product.variants[0].price).toFixed(2) : 'N/A'}</span></div></Link>))}</div>
                    </div>
                    <div><h3 className="text-lg font-semibold text-gray-900 mb-4">Most-viewed Items</h3><div className="space-y-4">{productsLoading ? Array.from({ length: 3 }).map((_, i) => <div key={i} className="flex gap-3 p-2 animate-pulse"><div className="w-16 h-16 bg-slate-200 rounded-lg"/><div className="flex-1 space-y-2 py-1"><div className="h-4 bg-slate-200 rounded w-full"/><div className="h-4 bg-slate-200 rounded w-2/3"/></div></div>) : mostViewed.map(p => <Link to={`/products/${p.id}`} key={p.id} className="flex gap-3 p-2 rounded-lg hover:bg-gray-50"><img src={p.images?.[0]?.imageUrl || 'https://placehold.co/150x150/e2e8f0/cccccc?text=Img'} alt={p.name} className="w-16 h-16 object-cover rounded-lg shrink-0 bg-gray-100"/><div><h4 className="text-sm font-medium line-clamp-2">{p.name}</h4><span className="text-sm font-semibold">${p.variants?.[0]?.price ? parseFloat(p.variants[0].price).toFixed(2) : 'N/A'}</span></div></Link>)}</div></div>
                    <div><h3 className="text-lg font-semibold text-gray-900 mb-4">We Think You'll Love</h3><div className="space-y-4">{productsLoading ? Array.from({ length: 3 }).map((_, i) => <div key={i} className="flex gap-3 p-2 animate-pulse"><div className="w-16 h-16 bg-slate-200 rounded-lg"/><div className="flex-1 space-y-2 py-1"><div className="h-4 bg-slate-200 rounded w-full"/><div className="h-4 bg-slate-200 rounded w-2/3"/></div></div>) : weThinkYoullLove.map(p => <Link to={`/products/${p.id}`} key={p.id} className="flex gap-3 p-2 rounded-lg hover:bg-gray-50"><img src={p.images?.[0]?.imageUrl || 'https://placehold.co/150x150/e2e8f0/cccccc?text=Img'} alt={p.name} className="w-16 h-16 object-cover rounded-lg shrink-0 bg-gray-100"/><div><h4 className="text-sm font-medium line-clamp-2">{p.name}</h4><span className="text-sm font-semibold">${p.variants?.[0]?.price ? parseFloat(p.variants[0].price).toFixed(2) : 'N/A'}</span></div></Link>)}</div></div>
                </div>
            </section>
        </div>
    );
}