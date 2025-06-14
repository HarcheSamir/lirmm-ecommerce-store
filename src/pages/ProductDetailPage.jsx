import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProductStore } from '../store/productStore';
import { useCartStore } from '../store/cartStore';
import DetailNavbar from '../components/DetailNavbar'; // <-- MODIFIED
import Footer from './Home/sections/Footer';
import ProductCard from '../components/ProductCard';
import { FiMinus, FiPlus } from 'react-icons/fi';

const renderStars = (rating) => (
    Array.from({ length: 5 }, (_, i) => <span key={i} className={`text-xl ${i < rating ? "text-yellow-400" : "text-gray-300"}`}>★</span>)
);

export default function ProductDetailPage() {
    const { id } = useParams();
    const { product, fetchProductById, isLoading: productLoading, error } = useProductStore();
    const { products: relatedProducts, fetchProducts } = useProductStore();
    const { addItem, isLoading: cartLoading } = useCartStore();

    const [quantity, setQuantity] = useState(1);
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [activeImage, setActiveImage] = useState(null);

    useEffect(() => {
        if (id) {
            fetchProductById(id);
            fetchProducts(1, 5, { sortBy: 'createdAt', sortOrder: 'desc' });
        }
    }, [id, fetchProductById, fetchProducts]);

    useEffect(() => {
        if (product) {
            const defaultVariant = product.variants?.[0];
            const primaryImage = product.images?.find(i => i.isPrimary) || product.images?.[0];
            setSelectedVariant(defaultVariant);
            setActiveImage(primaryImage);
        }
    }, [product]);
    
    const handleAddToCart = () => {
        if (product && selectedVariant && quantity > 0) {
            addItem(product, selectedVariant, quantity);
        }
    };

    if (productLoading) {
        return <div className="flex items-center justify-center h-screen text-xl">Loading Product...</div>;
    }
    if (error && !product) {
        return <div className="flex items-center justify-center h-screen text-xl text-red-500">Error: {error}</div>;
    }
    if (!product) {
        return <div className="flex items-center justify-center h-screen text-xl">Product not found.</div>;
    }

    return (
         <div className='bg-white min-h-screen'>
            <DetailNavbar /> {/* <-- MODIFIED */}
            <main className="py-10">
                <div className="max-w-6xl mx-auto px-4">
                    <p className="text-sm text-gray-500 mb-6"><Link to="/" className="hover:underline">Home</Link> / <Link to={`/category/${product.categories?.[0]?.category.slug || 'all'}`} className="hover:underline">{product.categories?.[0]?.category.name || 'Category'}</Link> / {product.name}</p>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                        {/* Image Gallery */}
                        <div className="flex gap-4">
                            <div className="flex flex-col gap-3">
                                {product.images?.map(image => (
                                    <div key={image.id} className={`w-20 h-20 rounded-md overflow-hidden cursor-pointer border-2 ${activeImage?.id === image.id ? 'border-primary' : 'border-transparent'}`} onMouseEnter={() => setActiveImage(image)}>
                                        <img src={image.imageUrl} alt={image.altText || 'product thumbnail'} className="w-full h-full object-cover"/>
                                    </div>
                                ))}
                            </div>
                            <div className="flex-grow bg-gray-100 rounded-lg overflow-hidden">
                                <img src={activeImage?.imageUrl} alt={product.name} className="w-full h-[500px] object-contain p-4"/>
                            </div>
                        </div>
                        {/* Product Details */}
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
                            <div className="my-3 text-lg">
                                <span className="font-bold text-primary text-2xl">${selectedVariant?.price ? parseFloat(selectedVariant.price).toFixed(2) : 'N/A'}</span>
                            </div>
                            <div className="flex items-center gap-2 mb-4">
                                {renderStars(4)}
                                <span className="text-sm text-gray-500">(281 Reviews)</span>
                            </div>
                            <p className="text-green-600 text-sm font-semibold mb-4">✔ In Stock</p>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center border border-gray-300 rounded-md">
                                    <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="p-3 text-gray-600 hover:text-black"><FiMinus /></button>
                                    <span className="px-5 font-semibold">{quantity}</span>
                                    <button onClick={() => setQuantity(q => q + 1)} className="p-3 text-gray-600 hover:text-black"><FiPlus /></button>
                                </div>
                                <button onClick={handleAddToCart} disabled={cartLoading} className="flex-grow bg-primary text-white py-3 rounded-md font-semibold hover:bg-fblack transition-colors disabled:bg-gray-400">
                                    {cartLoading ? 'Adding...' : 'Add to Cart'}
                                </button>
                            </div>
                            <div className="mt-8 border-t pt-6">
                                <p className="text-gray-600 leading-relaxed">{product.description}</p>
                            </div>
                        </div>
                    </div>
                </div>
                {/* You may also like */}
                <div className="max-w-6xl mx-auto px-4 mt-20">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold">You may also like</h2>
                        <Link to="/category/all" className="text-sm font-semibold text-primary hover:underline">View All</Link>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {relatedProducts.filter(p => p.id !== product.id).slice(0, 4).map(p => (
                            <ProductCard key={p.id} product={p} />
                        ))}
                    </div>
                </div>
            </main>
            <Footer />
         </div>
    );
}