import React, { useState, useEffect } from 'react';
import axios from 'axios';

// ====================================================================
// FIX #1: Parse the price string to a number before formatting
// ====================================================================
const ProductCard = ({ product }) => {
    const primaryImage = product.images?.find(img => img.isPrimary) || product.images?.[0];
    const firstVariant = product.variants?.[0];

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden transform hover:-translate-y-1 transition-transform duration-300">
            <div className="h-48 bg-gray-200 flex items-center justify-center">
                {primaryImage ? (
                    <img
                        src={primaryImage.imageUrl}
                        alt={primaryImage.altText || product.name}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <span className="text-gray-500">No Image</span>
                )}
            </div>
            <div className="p-4">
                <h3 className="text-lg font-bold text-gray-800 truncate" title={product.name}>
                    {product.name}
                </h3>
                <p className="text-sm text-gray-600 mt-1 h-10 overflow-hidden">
                    {product.description}
                </p>
                <div className="mt-4 flex items-baseline justify-end">
                    {firstVariant?.price ? (
                        <span className="text-2xl font-extrabold text-gray-900">
                            ${/* The price is a string, so we must parse it first! */ ''}
                            {parseFloat(firstVariant.price).toFixed(2)}
                        </span>
                    ) : (
                        <span className="text-sm text-gray-500">Price unavailable</span>
                    )}
                </div>
            </div>
        </div>
    );
};


const Test3 = () => {
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const API_BASE_URL = 'http://localhost:3000';
    const LIMIT = 10;

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await axios.get(`${API_BASE_URL}/products`, {
                    params: {
                        limit: LIMIT,
                        page: currentPage
                    }
                });
                
                const responseData = response.data;

                // ====================================================================
                // FIX #2: Access the data from the correct keys based on your API
                // ====================================================================
                setProducts(responseData.data || []); // Changed from responseData.products
                setTotalPages(responseData.pagination.totalPages || 1); // Changed from responseData.totalPages
                
            } catch (err) {
                console.error("Failed to fetch products:", err);
                const errorMessage = err.response?.data?.message || err.message || "An unknown error occurred.";
                setError(errorMessage);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [currentPage]);

    const handlePrevPage = () => {
        setCurrentPage(prev => Math.max(prev - 1, 1));
    };

    const handleNextPage = () => {
        setCurrentPage(prev => Math.min(prev + 1, totalPages));
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen text-2xl text-gray-500">Loading products...</div>;
    }

    if (error) {
        return <div className="flex justify-center items-center h-screen text-2xl text-red-500">Error: {error}</div>;
    }
    
    return (
        <div className="bg-gray-100 min-h-screen">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">Our Products</h1>

                {products.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                            {products.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>

                        {/* Pagination Controls */}
                        <div className="mt-12 flex justify-between items-center">
                            <button
                                onClick={handlePrevPage}
                                disabled={currentPage === 1}
                                className="bg-gray-800 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                            >
                                Previous
                            </button>
                            <span className="text-gray-700 font-semibold">
                                Page {currentPage} of {totalPages}
                            </span>
                            <button
                                onClick={handleNextPage}
                                disabled={currentPage >= totalPages}
                                className="bg-gray-800 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                            >
                                Next
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="text-center text-gray-500 mt-20">
                        <h2 className="text-2xl font-semibold">No Products Found</h2>
                        <p className="mt-2">Check the browser console for more details.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Test3;