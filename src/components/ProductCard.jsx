import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { FiEye, FiHeart, FiShoppingCart } from 'react-icons/fi';
import { toast } from 'react-toastify';

export default function ProductCard({ product }) {
    const addItem = useCartStore(state => state.addItem);
    const primaryImage = product.images?.find(img => img.isPrimary) || product.images?.[0];
    const colorVariants = product.variants?.filter(v => v.attributes.colorHex);

    // State for the currently displayed image URL - THIS IS NOW CORRECT
    const [displayImageUrl, setDisplayImageUrl] = useState(primaryImage?.imageUrl);
    
    // This effect ensures the image resets when the product prop changes
    useEffect(() => {
        setDisplayImageUrl(primaryImage?.imageUrl);
    }, [product, primaryImage]);


    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const defaultVariant = product.variants?.[0];
        if (product && defaultVariant) {
            addItem(product, defaultVariant, 1);
        } else {
            toast.error("This product cannot be added to the cart.");
        }
    };

    const handleSwatchHover = (variant) => {
        // Future enhancement: Find an image associated with the variant if available
        // For now, this is a placeholder for potential future logic
    };
    
    const handleSwatchLeave = () => {
        // Revert to the primary image URL when not hovering swatches
        setDisplayImageUrl(primaryImage?.imageUrl);
    };

    const firstVariant = product.variants?.[0];
    const categoryName = product.categories?.[0]?.category?.name || 'Uncategorized';

    return (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden group relative transition-all duration-300 hover:shadow-lg">
            <Link to={`/products/${product.id}`} className="block">
                <div className="relative h-56 overflow-hidden">
                    <img
                        // The incorrect proxy function is REMOVED. We use the state URL directly.
                        src={displayImageUrl || 'https://placehold.co/400x400/e2e8f0/cccccc?text=No+Image'}
                        alt={product.name}
                        className="w-full h-full object-cover transition-all duration-500 ease-in-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>
                    <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
                        <button onClick={(e) => {e.preventDefault(); toast.info("Added to Wishlist!");}} className="w-9 h-9 bg-white rounded-full flex items-center justify-center text-slate-600 hover:bg-primary hover:text-white transition-colors shadow-sm">
                            <FiHeart size={16}/>
                        </button>
                         <button onClick={(e) => {e.preventDefault(); toast.info("Quick view coming soon!");}} className="w-9 h-9 bg-white rounded-full flex items-center justify-center text-slate-600 hover:bg-primary hover:text-white transition-colors shadow-sm">
                            <FiEye size={16}/>
                        </button>
                    </div>
                     {/* Color swatches that appear on hover */}
                    {colorVariants.length > 0 && (
                        <div 
                            className="absolute bottom-3 left-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            onMouseLeave={handleSwatchLeave}
                        >
                            {colorVariants.slice(0, 4).map(variant => (
                                <span 
                                    key={variant.id}
                                    onMouseEnter={() => handleSwatchHover(variant)}
                                    className="w-6 h-6 rounded-full border-2 border-white shadow-md cursor-pointer"
                                    style={{ backgroundColor: variant.attributes.colorHex }}
                                ></span>
                            ))}
                        </div>
                    )}
                </div>
                <div className="p-4">
                    <p className="text-xs text-slate-500 mb-1">{categoryName}</p>
                    <h3 className="text-sm font-semibold text-slate-800 truncate" title={product.name}>
                        {product.name}
                    </h3>
                    <p className="text-lg font-bold text-primary mt-1">
                        {firstVariant?.price ? `$${parseFloat(firstVariant.price).toFixed(2)}` : 'N/A'}
                    </p>
                </div>
            </Link>
            <div className="absolute bottom-0 left-0 right-0 transition-all duration-300 transform translate-y-full group-hover:translate-y-0 z-10">
                 <button onClick={handleAddToCart} className="w-full bg-primary text-white font-semibold py-2.5 flex items-center justify-center gap-2 hover:bg-fblack transition-colors text-sm">
                    <FiShoppingCart size={16}/>
                    Add to Cart
                 </button>
            </div>
        </div>
    );
}