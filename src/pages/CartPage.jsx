import { useCartStore } from '../store/cartStore';
import { Link } from 'react-router-dom';
import DetailNavbar from '../components/DetailNavbar'; // <-- MODIFIED
import Footer from './Home/sections/Footer';
import { FiTrash2, FiPlus, FiMinus } from 'react-icons/fi';

// ... (CartItemRow component remains the same)
const CartItemRow = ({ item }) => {
    const { updateItemQuantity, removeItem, isLoading } = useCartStore();

    return (
        <div className="flex flex-col sm:flex-row items-center gap-4 py-4 border-b border-gray-200">
            <div className="w-24 h-24 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                <img src={item.imageUrl || 'https://placehold.co/100x100/e2e8f0/cccccc'} alt={item.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-grow text-center sm:text-left">
                <h3 className="text-md font-medium text-gray-800">{item.name}</h3>
                <p className="text-sm text-gray-500">${parseFloat(item.price).toFixed(2)}</p>
            </div>
            <div className="flex items-center border border-gray-300 rounded-md my-2 sm:my-0">
                <button onClick={() => updateItemQuantity(item.itemId, item.quantity - 1)} disabled={isLoading || item.quantity <= 1} className="p-2 text-gray-600 hover:text-black disabled:opacity-50">
                    <FiMinus size={16} />
                </button>
                <span className="px-4 text-md font-medium">{item.quantity}</span>
                <button onClick={() => updateItemQuantity(item.itemId, item.quantity + 1)} disabled={isLoading} className="p-2 text-gray-600 hover:text-black disabled:opacity-50">
                    <FiPlus size={16} />
                </button>
            </div>
            <p className="text-md font-semibold text-gray-900 w-20 text-center">${(item.price * item.quantity).toFixed(2)}</p>
            <button onClick={() => removeItem(item.itemId)} disabled={isLoading} className="text-gray-400 hover:text-red-500">
                <FiTrash2 size={18} />
            </button>
        </div>
    );
};


export default function CartPage() {
    const { cart } = useCartStore();
    const subtotal = cart?.items?.reduce((acc, item) => acc + item.price * item.quantity, 0) || 0;

    return (
        <div className="bg-white min-h-screen flex flex-col">
            <DetailNavbar /> {/* <-- MODIFIED */}
            <main className="flex-grow bg-gray-50 py-12">
                {/* ... (rest of the component remains the same) ... */}
                <div className="max-w-6xl mx-auto px-4">
                    <div className="text-center mb-10">
                         <p className="text-sm text-gray-500"><Link to="/" className="hover:underline">Home</Link> / Shopping Cart</p>
                        <h1 className="text-4xl font-bold text-gray-900 mt-2">Your Cart</h1>
                    </div>

                    {cart?.items?.length > 0 ? (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm">
                                {cart.items.map(item => <CartItemRow key={item.itemId} item={item} />)}
                            </div>
                            <div className="lg:col-span-1">
                                <div className="bg-white p-6 rounded-lg shadow-sm">
                                    <h2 className="text-xl font-semibold mb-4 border-b pb-4">Order Summary</h2>
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span>Subtotal</span>
                                            <span>${subtotal.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Delivery Charges</span>
                                            <span className="text-sm text-gray-500">Calculated at checkout</span>
                                        </div>
                                        <div className="flex justify-between font-bold text-lg border-t pt-4 mt-2">
                                            <span>Estimated Total</span>
                                            <span>${subtotal.toFixed(2)}</span>
                                        </div>
                                    </div>
                                    <Link to="/checkout" className="block w-full text-center mt-6 bg-primary text-white py-3 rounded-md font-semibold hover:bg-fblack transition-colors">
                                        Proceed to Checkout
                                    </Link>
                                    <p className="text-xs text-gray-500 text-center mt-3">Free delivery on orders over $500.00</p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center bg-white p-12 rounded-lg shadow-sm">
                            <h2 className="text-2xl font-semibold">Your Cart is Empty</h2>
                            <p className="text-gray-500 mt-2">Looks like you haven't added anything to your cart yet.</p>
                            <Link to="/" className="inline-block mt-6 bg-primary text-white py-3 px-8 rounded-md font-semibold hover:bg-fblack transition-colors">
                                Continue Shopping
                            </Link>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
}