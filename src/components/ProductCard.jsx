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
                addItem(product, variantToAdd, 1);
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
    const categoryName = product.category_names?.[0] || product.categories?.[0]?.name || "Uncategorized";

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
                    <img src={imageUrl} alt={product.name} className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out transform-gpu ${isImageLoaded ? "scale-100 opacity-100" : "scale-110 opacity-0"} group-hover/card:scale-110 group-hover/card:opacity-0`} onLoad={() => setIsImageLoaded(true)} />
                    <img src={hoverImageUrl} alt={product.name} className="absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out opacity-0 scale-95 group-hover/card:scale-105 group-hover/card:opacity-100 transform-gpu" />
                </div>
                <div className="p-5 space-y-3">
                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">{categoryName}</p>
                    <h3 className="text-sm font-semibold text-slate-800 line-clamp-2 leading-relaxed group-hover/card:text-primary transition-colors duration-300" title={product.name}>{product.name}</h3>
                    <div className="flex items-center justify-between">
                        <p className="text-lg font-bold text-primary">{formatPrice(firstVariant?.price)}</p>
                        {isSimpleColorVariantProduct && (
                            <div className="flex gap-2">
                                {product.variants.slice(0, 4).map((variant) => (
                                    <button key={variant.id} title={variant.attributes.Color || 'Variant'} className={`w-5 h-5 rounded-full border shadow-sm cursor-pointer transition-all duration-300 ${selectedVariantId === variant.id ? "ring-2 ring-offset-1 ring-primary border-white" : "border-white/60"}`} style={{ backgroundColor: variant.attributes.colorHex }} onClick={(e) =>{ e.preventDefault(); e.stopPropagation(); setSelectedVariantId(variant.id); }} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </Link>
        </div>
    );
}