import { useEffect, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProductStore } from '../store/productStore';
import { useCartStore } from '../store/cartStore';
import { useSettings } from '../context/SettingsContext';
import HomeNavbar from '../components/HomeNavbar';
import Footer from './Home/sections/Footer';
import ProductCard from '../components/ProductCard';
import { FiMinus, FiPlus, FiStar } from 'react-icons/fi';
import ReviewStats from '../components/reviews/ReviewStats';
import ReviewList from '../components/reviews/ReviewList';

export default function ProductDetailPage() {
    const { id } = useParams();
    const { product, fetchProductById, isLoading: productLoading, error } = useProductStore();
    const { products: relatedProducts, fetchProducts } = useProductStore();
    const { addItem, isLoading: cartLoading } = useCartStore();
    const { language, currency } = useSettings();

    const [quantity, setQuantity] = useState(1);
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [activeImage, setActiveImage] = useState(null);
    const [userSelections, setUserSelections] = useState({});

    const displayProduct = useMemo(() => product?.data, [product]);

    const variantOptions = useMemo(() => {
        if (!displayProduct?.variants) return {};
        const options = {};
        displayProduct.variants.forEach(variant => {
            if (!variant.attributes) return;
            Object.entries(variant.attributes).forEach(([key, value]) => {
                if (key === 'colorHex') return;
                if (!options[key]) options[key] = new Set();
                options[key].add(value);
            });
        });
        Object.keys(options).forEach(key => {
            options[key] = Array.from(options[key]);
        });
        return options;
    }, [displayProduct]);

    useEffect(() => {
        if (id) {
            window.scrollTo(0, 0);
            fetchProductById(id);
            fetchProducts(1, 5, { sortBy: 'createdAt', sortOrder: 'desc' });
        }
    }, [id, fetchProductById, fetchProducts]);

    useEffect(() => {
        if (displayProduct) {
            const primaryImage = displayProduct.images?.find(i => i.isPrimary) || displayProduct.images?.[0];
            setActiveImage(primaryImage);
            const initialSelections = {};
            Object.entries(variantOptions).forEach(([key, values]) => {
                if (values.length === 1) initialSelections[key] = values[0];
            });
            setUserSelections(initialSelections);
            setSelectedVariant(null);
        }
    }, [displayProduct, variantOptions]);

    useEffect(() => {
        if (!displayProduct) return;
        const optionKeys = Object.keys(variantOptions);
        if (optionKeys.length === 0 && displayProduct.variants?.length === 1) {
            setSelectedVariant(displayProduct.variants[0]);
            return;
        }
        const allOptionsSelected = optionKeys.every(key => userSelections[key]);
        if (allOptionsSelected) {
            const foundVariant = displayProduct.variants.find(variant =>
                optionKeys.every(key => variant.attributes[key] === userSelections[key])
            );
            setSelectedVariant(foundVariant || null);
        } else {
            setSelectedVariant(null);
        }
    }, [userSelections, displayProduct, variantOptions]);

    const handleSelection = (key, value) => {
        setUserSelections(prev => ({ ...prev, [key]: value }));
    };

    const handleAddToCart = () => {
        if (displayProduct && selectedVariant && quantity > 0) {
            const localizedProduct = {
                ...displayProduct,
                name: displayProduct.name[language] || displayProduct.name.en,
            };
            addItem(localizedProduct, selectedVariant, quantity);
        }
    };

    const getColorHex = (attributeKey, attributeValue) => {
        if (!displayProduct || !displayProduct.variants) return null;
        const variantWithColor = displayProduct.variants.find(v =>
            v.attributes && v.attributes[attributeKey] === attributeValue && v.attributes.colorHex
        );
        return variantWithColor?.attributes.colorHex;
    };

    const formatPrice = (price) => {
        if (price === undefined || price === null) return "N/A";
        return new Intl.NumberFormat(language, { style: 'currency', currency }).format(price);
    };

    if (productLoading) return <div className="flex items-center justify-center h-screen text-xl">Loading Product...</div>;
    if (error && !product) return <div className="flex items-center justify-center h-screen text-xl text-red-500">Error: {error}</div>;
    if (!displayProduct) return <div className="flex items-center justify-center h-screen text-xl">Product not found.</div>;

    const category = displayProduct.categories?.[0]?.category;
    const categoryName = category?.name[language] || category?.name?.en || 'Category';

    return (
        <div className='bg-white min-h-screen'>
            <HomeNavbar />
            <main className="py-10">
                <div className="max-w-6xl mx-auto px-4">
                    <p className="text-sm text-gray-500 mb-6"><Link to="/" className="hover:underline">Home</Link> / <Link to={`/shop/${category?.slug || 'all'}`} className="hover:underline">{categoryName}</Link> / {displayProduct.name[language] || displayProduct.name.en}</p>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                        <div className="flex flex-col-reverse sm:flex-row gap-4">
                            <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-x-visible pb-2 sm:pb-0">
                                {displayProduct.images?.map(image => (
                                    <div key={image.id} className={`w-20 h-20 rounded-md overflow-hidden cursor-pointer border-2 flex-shrink-0 ${activeImage?.id === image.id ? 'border-primary' : 'border-transparent'}`} onMouseEnter={() => setActiveImage(image)}>
                                        <img src={image.imageUrl} alt={image.altText || 'product thumbnail'} className="w-full h-full object-cover"/>
                                    </div>
                                ))}
                            </div>
                            <div className="flex-grow bg-gray-100 rounded-lg overflow-hidden aspect-square">
                                <img src={activeImage?.imageUrl} alt={displayProduct.name.en} className="w-full h-full object-cover"/>
                            </div>
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">{displayProduct.name[language] || displayProduct.name.en}</h1>
                            <div className="flex items-center gap-2 my-3">
                                <div className="flex items-center">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <FiStar key={i} className={`w-5 h-5 ${i < Math.round(displayProduct.averageRating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                                    ))}
                                </div>
                                <a href="#reviews" className="text-sm text-gray-500 hover:underline">({displayProduct.reviewCount || 0} Reviews)</a>
                            </div>
                            <div className="my-3 text-lg">
                                <span className="font-bold text-primary text-2xl">{formatPrice(selectedVariant?.price || displayProduct.variants[0]?.price)}</span>
                                {/* --- START: SURGICAL MODIFICATION --- */}
                                {selectedVariant?.stockQuantity === 0 && (
                                    <span className="ml-4 text-sm font-semibold text-red-600 bg-red-100 px-3 py-1 rounded-full">Out of Stock</span>
                                )}
                                {/* --- END: SURGICAL MODIFICATION --- */}
                            </div>
                            <div className="space-y-4">
                                {Object.entries(variantOptions).map(([key, values]) => (
                                    <div key={key}>
                                        <h3 className="text-sm font-medium text-gray-900 capitalize">{key}: <span className="text-gray-600 font-normal">{userSelections[key] || ''}</span></h3>
                                        <div className="flex items-center gap-2 mt-2 flex-wrap">
                                            {values.map(value => {
                                                const isSelected = userSelections[key] === value;
                                                const isColorAttr = key.toLowerCase().includes('color');
                                                const colorHex = isColorAttr ? getColorHex(key, value) : null;
                                                if (colorHex) return <button key={value} onClick={() => handleSelection(key, value)} className={`w-8 h-8 rounded-full border-2 transition-all ${isSelected ? 'ring-2 ring-primary ring-offset-2' : 'border-gray-200 hover:border-primary'}`} style={{ backgroundColor: colorHex }} title={value} aria-label={`Select ${value}`} />;
                                                return <button key={value} onClick={() => handleSelection(key, value)} className={`px-4 py-2 border rounded-md text-sm font-medium transition-colors ${isSelected ? 'bg-primary text-white border-primary' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'}`}>{value}</button>;
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {/* --- START: SURGICAL MODIFICATION --- */}
                            <div className="flex items-center gap-4 mt-6">
                                <div className={`flex items-center border rounded-md ${selectedVariant?.stockQuantity === 0 ? 'bg-gray-100' : 'border-gray-300'}`}>
                                    <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="p-3 text-gray-600 hover:text-black disabled:cursor-not-allowed disabled:text-gray-300" disabled={selectedVariant?.stockQuantity === 0}><FiMinus /></button>
                                    <span className={`px-5 font-semibold ${selectedVariant?.stockQuantity === 0 ? 'text-gray-400' : ''}`}>{quantity}</span>
                                    <button onClick={() => setQuantity(q => q + 1)} className="p-3 text-gray-600 hover:text-black disabled:cursor-not-allowed disabled:text-gray-300" disabled={selectedVariant?.stockQuantity === 0}><FiPlus /></button>
                                </div>
                                <button
                                    onClick={handleAddToCart}
                                    disabled={!selectedVariant || cartLoading || selectedVariant.stockQuantity === 0}
                                    className="flex-grow bg-primary text-white py-3 rounded-md font-semibold hover:bg-fblack transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                                >
                                    {cartLoading ? 'Adding...' : (!selectedVariant ? 'Select Options' : (selectedVariant.stockQuantity === 0 ? 'Out of Stock' : 'Add to Cart'))}
                                </button>
                            </div>
                            {/* --- END: SURGICAL MODIFICATION --- */}
                            <div className="mt-8 border-t pt-6"><h4 className="font-semibold mb-2">Description</h4><p className="text-gray-600 leading-relaxed">{displayProduct.description[language] || displayProduct.description.en}</p></div>
                        </div>
                    </div>
                </div>

                <div id="reviews" className="max-w-6xl mx-auto px-4 mt-20 pt-10 border-t">
                    <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
                    <ReviewStats averageRating={displayProduct.averageRating} reviewCount={displayProduct.reviewCount} />
                    <ReviewList productId={id} />
                </div>
                
                <div className="max-w-6xl mx-auto px-4 mt-20">
                    <div className="flex justify-between items-center mb-6"><h2 className="text-2xl font-bold">You may also like</h2><Link to="/shop" className="text-sm font-semibold text-primary hover:underline">View All</Link></div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {relatedProducts.filter(p => p.id !== displayProduct.id).slice(0, 4).map(p => <ProductCard key={p.id} product={p} />)}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}