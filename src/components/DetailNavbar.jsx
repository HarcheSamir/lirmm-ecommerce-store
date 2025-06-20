import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';
import { FiSearch, FiUser, FiMoon, FiChevronDown } from 'react-icons/fi';
import AnimatedCartIcon from './AnimatedCartIcon';
import ProfileDropdown from './ProfileDropdown'; // <-- IMPORT NEW COMPONENT

export default function DetailNavbar() {
    const navigate = useNavigate();
    const { isAuthenticated, user, logout } = useAuthStore(); // <-- GET AUTH STATE AND USER
    const { toggleCart, cart } = useCartStore();
    const [isProfileOpen, setProfileOpen] = useState(false); // <-- STATE FOR DROPDOWN
    const profileTimeoutRef = useRef(null); // <-- TIMEOUT FOR DROPDOWN

    const itemCount = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

    const categories = [
        { name: 'Home & Garden', path: '/category/home-garden' },
        { name: 'Electronics', path: '/category/electronics' },
        { name: 'Fashion', path: '/category/fashion' },
        { name: 'Toys & Games', path: '/category/toys-games' },
        { name: 'Sports & Entertainment', path: '/category/sports' },
    ];

    const handleProfileMouseEnter = () => {
        clearTimeout(profileTimeoutRef.current);
        setProfileOpen(true);
    };

    const handleProfileMouseLeave = () => {
        profileTimeoutRef.current = setTimeout(() => {
            setProfileOpen(false);
        }, 200);
    };

    const handleLogout = () => {
        logout();
        setProfileOpen(false);
        navigate('/');
    };

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
                        
                        {/* === MODIFIED ACCOUNT BUTTON LOGIC === */}
                        <div className="relative" onMouseEnter={handleProfileMouseEnter} onMouseLeave={handleProfileMouseLeave}>
                            {isAuthenticated ? (
                                <div className="text-gray-600 hover:text-primary cursor-pointer">
                                    <FiUser size={20} />
                                </div>
                            ) : (
                                <Link to="/login" className="text-gray-600 hover:text-primary">
                                    <FiUser size={20} />
                                </Link>
                            )}
                            {isAuthenticated && isProfileOpen && <ProfileDropdown user={user} onLogout={handleLogout} />}
                        </div>
                        {/* === END MODIFICATION === */}

                        <button onClick={toggleCart}>
                           <AnimatedCartIcon itemCount={itemCount} />
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}