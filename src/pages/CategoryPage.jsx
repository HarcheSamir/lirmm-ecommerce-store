import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useProductStore } from '../store/productStore';
import HomeNavbar from '../components/HomeNavbar';
import Footer from './Home/sections/Footer';
import ProductCard from '../components/ProductCard';

export default function CategoryPage() {
    const { slug } = useParams();
    const { products, fetchProducts, isLoading } = useProductStore();

    useEffect(() => {
        if (slug) {
            fetchProducts(1, 20, { categorySlug: slug });
        }
    }, [slug, fetchProducts]);

    return (
         <div className='min-h-screenF'>
            <HomeNavbar />
            <div className="max-w-6xl mx-auto p-8">
                <h1 className="text-3xl font-bold capitalize mb-8">Category: {slug.replace(/-/g, ' ')}</h1>
                 {isLoading ? (
                    <p>Loading products...</p>
                ) : products.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {products.map(product => (
                           <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <p>No products found in this category.</p>
                )}
            </div>
            <Footer />
        </div>
    );
}