import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { useSettings } from '../context/SettingsContext';
import { FiEye, FiHeart, FiShoppingCart, FiStar } from 'react-icons/fi';
import { toast } from 'react-toastify';
import ProductCardSkeleton from './ProductCardSkeleton';

export default function ProductCard({ product, index = 0 }) {
    const navigate = useNavigate();
    const addItem = useCartStore((state) => state.addItem);
    const { language, currency } = useSettings();
    const [selectedVariantId, setSelectedVariantId] = useState(null);
    const [isImageLoaded, setIsImageLoaded] = useState(false);

    useEffect(() => {
        setSelectedVariantId(null);
    }, [product]);

    if (!product) return <ProductCardSkeleton index={index} />;

    const isSimpleColorVariantProduct = product?.variants && product.variants.length > 0 && product.variants.every(v => v.attributes && v.attributes.colorHex);

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isSimpleColorVariantProduct) {
            navigate(`/products/${product.id}`);
            return;
        }
        if (selectedVariantId) {
            const variantToAdd = product.variants.find(v => v.id === selectedVariantId);
            if (variantToAdd) {
                // highlight-start
                // The product object from the API is already localized, so we can add it directly.
                addItem(product, variantToAdd, 1);
                // highlight-end
            }
        } else {
            toast.info("Please select a color from the bubbles first.");
        }
    };

    const primaryImage = product.images?.find(img => img.isPrimary) || product.images?.[0];
    const hoverImage = product.images?.find(img => img.order === 2) || primaryImage;
    const imageUrl = primaryImage?.imageUrl || "https://placehold.co/400x400/e2e8f0/cccccc?text=Img";
    const hoverImageUrl = hoverImage?.imageUrl || imageUrl;

    const firstVariant = product.variants?.[0];
    
    // highlight-start
    // The API provides the category name as a simple string, so we use it directly.
    const categoryName = product.categories?.[0]?.name || "Uncategorized";
    // highlight-end

    const buttonText = !isSimpleColorVariantProduct ? "Select Options" : "Add to Cart";
    const isButtonDisabled = isSimpleColorVariantProduct && !selectedVariantId;

    const formatPrice = (price) => {
        if (price === undefined || price === null) return "N/A";
        return new Intl.NumberFormat(language, { style: 'currency', currency }).format(price);
    };

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden group/card relative transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2 transform-gpu" style={{ animationDelay: `${index * 150}ms` }}>
            <Link to={`/products/${product.id}`} className="block">
                <div className="relative h-64 overflow-hidden bg-gray-50">
                    {/* highlight-start */}
                    {/* Use product.name directly as it's a string */}
                    <img src={imageUrl} alt={product.name} className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out transform-gpu ${isImageLoaded ? "scale-100 opacity-100" : "scale-110 opacity-0"} group-hover/card:scale-110 group-hover/card:opacity-0`} onLoad={() => setIsImageLoaded(true)} />
                    <img src={hoverImageUrl} alt={product.name} className="absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out opacity-0 scale-95 group-hover/card:scale-105 group-hover/card:opacity-100 transform-gpu" />
                    {/* highlight-end */}
                    <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500"></div>
                    <div className="absolute top-4 -right-16 flex flex-col gap-3 transition-all duration-500 ease-out group-hover/card:right-4">
                        <button onClick={(e) => { e.preventDefault(); toast.info("Added to Wishlist!"); }} className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-slate-600 hover:bg-pink-500 hover:text-white transition-all duration-300 shadow-lg hover:shadow-pink-500/25 hover:scale-110 transform-gpu"><FiHeart size={16} /></button>
                        <button onClick={(e) => { e.preventDefault(); toast.info("Quick view coming soon!"); }} className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-slate-600 hover:bg-primary hover:text-white transition-all duration-300 shadow-lg hover:shadow-primary/25 hover:scale-110 transform-gpu"><FiEye size={16} /></button>
                    </div>
                    {isSimpleColorVariantProduct && (
                        <div className="absolute bottom-4 left-4 flex gap-2 opacity-0 translate-y-8 group-hover/card:opacity-100 group-hover/card:translate-y-0 transition-all duration-500 ease-out">
                            {product.variants.map((variant, idx) => (
                                <button key={variant.id} title={variant.attributes.Color || 'Variant'} className={`w-7 h-7 rounded-full border-2 shadow-lg cursor-pointer transition-all duration-300 hover:scale-125 transform-gpu ${selectedVariantId === variant.id ? "ring-2 ring-offset-2 ring-primary border-white" : "border-white/60"}`} style={{ backgroundColor: variant.attributes.colorHex, animationDelay: `${idx * 100}ms` }} onClick={(e) =>{ e.preventDefault(); e.stopPropagation(); setSelectedVariantId(variant.id); }} />
                            ))}
                        </div>
                    )}
                </div>
                <div className="p-5 space-y-3">
                    <div className="flex items-center justify-between">
                        <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">{categoryName}</p>
                        <div className="flex items-center gap-1 text-yellow-400">
                            <FiStar size={12} className="fill-current" />
                            <span className="text-xs text-slate-600">{product.averageRating ? product.averageRating.toFixed(1) : 'N/A'}</span>
                        </div>
                    </div>
                    {/* highlight-start */}
                    {/* The product.name is already a localized string, so just render it. */}
                    <h3 className="text-sm font-semibold text-slate-800 line-clamp-2 leading-relaxed group-hover/card:text-primary transition-colors duration-300" title={product.name}>
                        {product.name}
                    </h3>
                    {/* highlight-end */}
                    <div className="flex items-center justify-between">
                        <p className="text-lg font-bold text-primary">{formatPrice(firstVariant?.price)}</p>
                        <span className="text-xs text-slate-400 line-through">$99.99</span>
                    </div>
                </div>
            </Link>
            <div className="absolute bottom-0 left-0 right-0 transition-all duration-500 ease-out transform translate-y-full group-hover/card:translate-y-0">
                <button onClick={handleAddToCart} disabled={isButtonDisabled} className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-lg hover:shadow-primary/25 backdrop-blur-sm disabled:bg-gray-400 disabled:cursor-not-allowed">
                    <FiShoppingCart size={16} className="transition-transform duration-300 group-hover/card:scale-110" />
                    {buttonText}
                </button>
            </div>
        </div>
    );
}