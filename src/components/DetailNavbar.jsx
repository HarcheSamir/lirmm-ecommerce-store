import { Link } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { FiSearch, FiUser, FiMoon, FiChevronDown } from 'react-icons/fi';
import AnimatedCartIcon from './AnimatedCartIcon'; // <-- IMPORT NEW COMPONENT

export default function DetailNavbar() {
    const { toggleCart, cart } = useCartStore();
    const itemCount = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

    const categories = [
        { name: 'Home & Garden', path: '/category/home-garden' },
        { name: 'Electronics', path: '/category/electronics' },
        { name: 'Fashion', path: '/category/fashion' },
        { name: 'Toys & Games', path: '/category/toys-games' },
        { name: 'Sports & Entertainment', path: '/category/sports' },
    ];

    return (
        <header className="w-full bg-white border-b border-gray-200 sticky top-0 z-30">
            <div className="max-w-6xl mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    <nav className="hidden md:flex items-center gap-6">
                        {categories.map(cat => (
                            <Link key={cat.name} to={cat.path} className="text-sm font-medium text-gray-500 hover:text-primary transition-colors">
                                {cat.name}
                            </Link>
                        ))}
                    </nav>
                    <div className="flex items-center gap-5 ml-auto">
                        <div className="flex items-center gap-1 text-sm text-gray-600 cursor-pointer hover:text-primary">
                            <span>US (US $)</span>
                            <FiChevronDown size={16} />
                        </div>
                        <div className="h-5 w-px bg-gray-200"></div>
                        <button className="text-gray-600 hover:text-primary"><FiMoon size={20} /></button>
                        <button className="text-gray-600 hover:text-primary"><FiSearch size={20} /></button>
                        <Link to="/account" className="text-gray-600 hover:text-primary"><FiUser size={20} /></Link>
                        <button onClick={toggleCart}>
                           <AnimatedCartIcon itemCount={itemCount} />
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}