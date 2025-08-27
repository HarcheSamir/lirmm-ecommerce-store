import { useEffect, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProductStore } from '../store/productStore';
import { useCartStore } from '../store/cartStore';
import DetailNavbar from '../components/DetailNavbar';
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

    const [quantity, setQuantity] = useState(1);
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [activeImage, setActiveImage] = useState(null);
    const [userSelections, setUserSelections] = useState({});

    const variantOptions = useMemo(() => {
        if (!product?.variants) return {};
        const options = {};
        product.variants.forEach(variant => {
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
    }, [product]);

    useEffect(() => {
        if (id) {
            window.scrollTo(0, 0);
            fetchProductById(id);
            fetchProducts(1, 5, { sortBy: 'createdAt', sortOrder: 'desc' });
        }
    }, [id, fetchProductById, fetchProducts]);

    useEffect(() => {
        if (product) {
            const primaryImage = product.images?.find(i => i.isPrimary) || product.images?.[0];
            setActiveImage(primaryImage);
            const initialSelections = {};
            Object.entries(variantOptions).forEach(([key, values]) => {
                if (values.length === 1) initialSelections[key] = values[0];
            });
            setUserSelections(initialSelections);
            setSelectedVariant(null);
        }
    }, [product, variantOptions]);

    useEffect(() => {
        if (!product) return;
        const optionKeys = Object.keys(variantOptions);
        if (optionKeys.length === 0 && product.variants?.length > 0) {
            setSelectedVariant(product.variants[0]);
            return;
        }
        const allOptionsSelected = optionKeys.every(key => userSelections[key]);
        if (allOptionsSelected) {
            const foundVariant = product.variants.find(variant =>
                optionKeys.every(key => variant.attributes[key] === userSelections[key])
            );
            setSelectedVariant(foundVariant || null);
        } else {
            setSelectedVariant(null);
        }
    }, [userSelections, product, variantOptions]);

    const handleSelection = (key, value) => {
        setUserSelections(prev => ({ ...prev, [key]: value }));
    };

    const handleAddToCart = () => {
        if (product && selectedVariant && quantity > 0) {
            addItem(product, selectedVariant, quantity);
        }
    };

    const getColorHex = (attributeKey, attributeValue) => {
        if (!product || !product.variants) return null;
        const variantWithColor = product.variants.find(v =>
            v.attributes && v.attributes[attributeKey] === attributeValue && v.attributes.colorHex
        );
        return variantWithColor?.attributes.colorHex;
    };

    if (productLoading) return <div className="flex items-center justify-center h-screen text-xl">Loading Product...</div>;
    if (error && !product) return <div className="flex items-center justify-center h-screen text-xl text-red-500">Error: {error}</div>;
    if (!product) return <div className="flex items-center justify-center h-screen text-xl">Product not found.</div>;

    return (
        <div className='bg-white min-h-screen'>
            <DetailNavbar />
            <main className="py-10">
                <div className="max-w-6xl mx-auto px-4">
                    <p className="text-sm text-gray-500 mb-6"><Link to="/" className="hover:underline">Home</Link> / <Link to={`/shop/${product.categories?.[0]?.category.slug || 'all'}`} className="hover:underline">{product.categories?.[0]?.category.name || 'Category'}</Link> / {product.name}</p>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                        <div className="flex flex-col-reverse sm:flex-row gap-4">
                            <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-x-visible pb-2 sm:pb-0">
                                {product.images?.map(image => (
                                    <div key={image.id} className={`w-20 h-20 rounded-md overflow-hidden cursor-pointer border-2 flex-shrink-0 ${activeImage?.id === image.id ? 'border-primary' : 'border-transparent'}`} onMouseEnter={() => setActiveImage(image)}>
                                        <img src={image.imageUrl} alt={image.altText || 'product thumbnail'} className="w-full h-full object-cover"/>
                                    </div>
                                ))}
                            </div>
                            <div className="flex-grow bg-gray-100 rounded-lg overflow-hidden aspect-square">
                                <img src={activeImage?.imageUrl} alt={product.name} className="w-full h-full object-cover"/>
                            </div>
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
                            <div className="flex items-center gap-2 my-3">
                                <div className="flex items-center">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <FiStar key={i} className={`w-5 h-5 ${i < Math.round(product.averageRating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                                    ))}
                                </div>
                                <a href="#reviews" className="text-sm text-gray-500 hover:underline">({product.reviewCount || 0} Reviews)</a>
                            </div>
                            <div className="my-3 text-lg">
                                <span className="font-bold text-primary text-2xl">${selectedVariant?.price ? parseFloat(selectedVariant.price).toFixed(2) : 'N/A'}</span>
                            </div>
                            <p className="text-green-600 text-sm font-semibold mb-4">✔ In Stock</p>
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
                            <div className="flex items-center gap-4 mt-6">
                                <div className="flex items-center border border-gray-300 rounded-md"><button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="p-3 text-gray-600 hover:text-black"><FiMinus /></button><span className="px-5 font-semibold">{quantity}</span><button onClick={() => setQuantity(q => q + 1)} className="p-3 text-gray-600 hover:text-black"><FiPlus /></button></div>
                                <button onClick={handleAddToCart} disabled={!selectedVariant || cartLoading} className="flex-grow bg-primary text-white py-3 rounded-md font-semibold hover:bg-fblack transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed">{cartLoading ? 'Adding...' : (!selectedVariant ? 'Select Options' : 'Add to Cart')}</button>
                            </div>
                            <div className="mt-8 border-t pt-6"><h4 className="font-semibold mb-2">Description</h4><p className="text-gray-600 leading-relaxed">{product.description}</p></div>
                        </div>
                    </div>
                </div>

                <div id="reviews" className="max-w-6xl mx-auto px-4 mt-20 pt-10 border-t">
                    <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
                    <ReviewStats averageRating={product.averageRating} reviewCount={product.reviewCount} />
                    <ReviewList productId={id} />
                </div>
                
                <div className="max-w-6xl mx-auto px-4 mt-20">
                    <div className="flex justify-between items-center mb-6"><h2 className="text-2xl font-bold">You may also like</h2><Link to="/shop" className="text-sm font-semibold text-primary hover:underline">View All</Link></div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {relatedProducts.filter(p => p.id !== product.id).slice(0, 4).map(p => <ProductCard key={p.id} product={p} />)}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}