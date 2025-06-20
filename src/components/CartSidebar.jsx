import { useCartStore } from '../store/cartStore';
import { Link } from 'react-router-dom';
import { FiX, FiTrash2, FiPlus, FiMinus } from 'react-icons/fi';

const CartItem = ({ item }) => {
    const { updateItemQuantity, removeItem, isLoading } = useCartStore();

    const handleQuantityChange = (newQuantity) => {
        if (newQuantity >= 1) {
            updateItemQuantity(item.itemId, newQuantity);
        }
    };

    // *** NEW: Component to render attributes ***
    const renderAttributes = () => {
        if (!item.attributes || Object.keys(item.attributes).length === 0) {
            return null;
        }
        return (
            <div className="text-xs text-gray-500 mt-1">
                {Object.entries(item.attributes)
                    .filter(([key]) => key !== 'colorHex') // Don't display colorHex
                    .map(([key, value]) => `${key}: ${value}`)
                    .join(' / ')}
            </div>
        );
    };

    return (
        <div className="flex gap-4 py-4 border-b border-gray-200 z-[100]">
            <div className="w-20 h-20 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                <img src={item.imageUrl || 'https://placehold.co/100x100/e2e8f0/cccccc'} alt={item.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col flex-grow">
                <div className="flex justify-between">
                    <h3 className="text-sm font-medium text-gray-800 line-clamp-2">{item.name}</h3>
                    <p className="text-sm font-semibold text-gray-900 ml-2">${parseFloat(item.price).toFixed(2)}</p>
                </div>
                
                {renderAttributes()} {/* <-- RENDER ATTRIBUTES HERE */}
                
                <div className="flex items-center justify-between mt-auto pt-2">
                    <div className="flex items-center border border-gray-300 rounded-md">
                        <button onClick={() => handleQuantityChange(item.quantity - 1)} disabled={isLoading} className="p-1.5 text-gray-500 hover:text-black disabled:opacity-50">
                            <FiMinus size={14} />
                        </button>
                        <span className="px-2 text-sm font-medium">{item.quantity}</span>
                        <button onClick={() => handleQuantityChange(item.quantity + 1)} disabled={isLoading} className="p-1.5 text-gray-500 hover:text-black disabled:opacity-50">
                            <FiPlus size={14} />
                        </button>
                    </div>
                    <button onClick={() => removeItem(item.itemId)} disabled={isLoading} className="text-gray-400 hover:text-red-500">
                        <FiTrash2 size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default function CartSidebar() {
    const { isCartOpen, toggleCart, cart } = useCartStore();
    const subtotal = cart?.items?.reduce((acc, item) => acc + item.price * item.quantity, 0) || 0;

    return (
        <>
            <div onClick={toggleCart} className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ${isCartOpen ? 'opacity-100' :'opacity-0 pointer-events-none'}`} />
            <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 transform transition-transform duration-300 ease-in-out ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between p-6 border-b border-gray-200">
                        <h2 className="text-lg font-medium">Your Cart ({cart?.items?.length || 0} items)</h2>
                        <button onClick={toggleCart} className="text-gray-500 hover:text-black"><FiX size={24} /></button>
                    </div>
                    <div className="flex-grow p-6 overflow-y-auto">
                        {cart?.items?.length > 0 ? (
                            cart.items.map(item => <CartItem key={item.itemId} item={item} />)
                        ) : (
                            <div className="text-center py-20"><p className="text-gray-500">Your cart is empty.</p></div>
                        )}
                    </div>
                    {cart?.items?.length > 0 && (
                        <div className="p-6 border-t border-gray-200">
                            <div className="flex justify-between items-center mb-4"><span className="text-md font-medium text-gray-800">Subtotal</span><span className="text-xl font-semibold text-gray-900">${subtotal.toFixed(2)}</span></div>
                            <p className="text-xs text-gray-500 text-center mb-4">Tax included. Shipping calculated at checkout.</p>
                            <div className="grid grid-cols-1 gap-3">
                                <Link to="/checkout" onClick={toggleCart} className="w-full text-center bg-primary text-white py-3 rounded-md font-semibold hover:bg-fblack transition-colors">Proceed to Checkout</Link>
                                <Link to="/cart" onClick={toggleCart} className="w-full text-center bg-gray-100 text-gray-800 py-3 rounded-md font-semibold hover:bg-gray-200 transition-colors">View Cart</Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}