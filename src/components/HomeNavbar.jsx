import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { useCategoryStore } from '../store/categoryStore';
import { useScrollDirection } from '../hooks/useScrollDirection';
import { FiGlobe, FiHeart, FiShoppingCart, FiUser, FiSearch, FiMenu, FiPackage, FiHelpCircle, FiChevronDown } from 'react-icons/fi';
import { GrCurrency } from "react-icons/gr";
import MegaMenu from './MegaMenu';

export default function HomeNavbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { toggleCart, cart } = useCartStore();
    const { categories, fetchCategories } = useCategoryStore();
    const scrollDirection = useScrollDirection();

    const [activeMenu, setActiveMenu] = useState({ category: null, rect: null });
    const hoverTimeoutRef = useRef(null);
    const headerRef = useRef(null);

    const handleMouseEnter = (event, category) => {
        if (category.isLeaf) return;
        clearTimeout(hoverTimeoutRef.current);
        const rect = event.currentTarget.getBoundingClientRect();
        setActiveMenu({ category, rect });
    };

    const handleMouseLeave = () => {
        hoverTimeoutRef.current = setTimeout(() => {
            setActiveMenu({ category: null, rect: null });
        }, 200);
    };

    const keepMenuOpen = () => clearTimeout(hoverTimeoutRef.current);

    const itemCount = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

    useEffect(() => {
        fetchCategories();
        return () => clearTimeout(hoverTimeoutRef.current);
    }, [fetchCategories]);

    return (
        // *** CRITICAL FIX: Changed z-index from z-50 to z-30 ***
        <header 
            ref={headerRef} 
            className={`w-full font-sans bg-white sticky top-0 z-30 transition-transform duration-300 ease-in-out ${
                scrollDirection === 'down' ? '-translate-y-full' : 'translate-y-0'
            }`}
        >
            {/* The entire header is one block that moves together */}
            <div>
                {/* Top navigation bar */}
                <div className="border-b border-gray-200"><div className="container mx-auto px-4"><div className="flex justify-between items-center py-2"><div className="flex items-center"><div className="flex cursor-pointer items-center mr-4"><FiGlobe size={16} className="mr-1" /><span className="text-sm text-gray-500">English</span></div><div className="hidden cursor-pointer sm:flex items-center"><GrCurrency size={16} className="mr-1" /><span className="text-sm text-gray-500">USD</span></div></div><div className="flex items-center text-sm text-gray-500"><Link to="/track-order" className="flex items-center mr-4 hover:text-primary"><FiPackage size={16} className="mr-1" /><span>Track Order</span></Link><Link to="/help" className="hidden md:flex items-center mr-4 hover:text-primary"><FiHelpCircle size={16} className="mr-1" /><span>Help Center</span></Link><Link to="/compare" className="hidden md:flex items-center mr-4 hover:text-primary"><span>Compare</span></Link><Link to="/wishlist" className="hidden md:flex items-center hover:text-primary"><FiHeart size={16} className="mr-1" /><span>Wishlist</span></Link></div></div></div></div>

                {/* Main header with search */}
                <div className="border-b border-gray-200 py-4"><div className="container mx-auto px-4"><div className="flex items-center"><Link to="/" className="text-2xl font-bold text-gray-900 mr-4">ECOM</Link><button className="lg:hidden mr-4 cursor-pointer" onClick={() => setIsMenuOpen(!isMenuOpen)}><FiMenu size={24} /></button><div className="flex flex-1"><input type="text" placeholder="Search for anything" className="flex-1 px-4 py-2 border border-r-0 border-gray-300 rounded-l-md outline-none text-sm"/><div className="hidden md:flex relative items-center border font-semibold text-gray-500 border-x-0 border-gray-300"><select className="appearance-none bg-white h-full px-6 outline-none text-sm cursor-pointer"><option>All Categories</option>{categories.map(cat => <option key={cat.id} value={cat.slug}>{cat.name}</option>)}</select><FiChevronDown size={16} className="absolute right-2 mt-1 pointer-events-none" /></div><button className="bg-gray-900 cursor-pointer px-3 py-2 rounded-r-md flex items-center justify-center"><FiSearch size={20} className="text-white" /></button></div><div className="hidden sm:flex items-center ml-4 space-x-6"><Link to="/account" className="flex font-semibold cursor-pointer gap-1 items-end hover:text-primary"><FiUser /><span className="text-xs mt-1">Account</span></Link><Link to="/wishlist" className="flex font-semibold cursor-pointer gap-1 items-end hover:text-primary"><FiHeart /><span className="text-xs mt-1">Wishlist</span></Link><button onClick={toggleCart} className="flex font-semibold cursor-pointer gap-1 items-end hover:text-primary relative"><FiShoppingCart /><span className="text-xs mt-1">Cart</span>{itemCount > 0 && <span className="absolute -top-2 -right-3 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">{itemCount}</span>}</button></div></div></div></div>

                {/* Category navigation banner */}
                <div className="border-b border-gray-200 hidden lg:flex justify-center" onMouseLeave={handleMouseLeave}>
                     <nav className="group flex overflow-x-auto py-3 container mx-auto px-4 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-transparent hover:scrollbar-thumb-gray-300 scrollbar-thumb-rounded-full">
                        {categories.map((category) => (
                            <div key={category.id} className="flex items-center" onMouseEnter={(e) => handleMouseEnter(e, category)}>
                                <Link to={`/category/${category.slug}`} className="flex items-center gap-1.5 whitespace-nowrap px-3 text-gray-500 font-semibold text-sm cursor-pointer hover:text-primary flex-shrink-0">
                                    {category.name}
                                    {!category.isLeaf && <FiChevronDown className={`w-4 h-4 transition-transform ${activeMenu.category?.id === category.id ? 'rotate-180' : ''}`} />}
                                </Link>
                            </div>
                        ))}
                    </nav>
                </div>
            </div>

            {/* Mega Menu logic */}
            {activeMenu.category && (
                <MegaMenu
                    parentCategory={activeMenu.category}
                    isOpen={!!activeMenu.category}
                    anchorRect={activeMenu.rect}
                    headerRect={headerRef.current?.getBoundingClientRect()}
                    onMouseEnter={keepMenuOpen}
                    onMouseLeave={handleMouseLeave}
                />
            )}

            {/* Mobile menu logic */}
            {isMenuOpen && (<><div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setIsMenuOpen(false)}></div><div className="fixed left-0 top-0 h-full w-72 bg-white z-50 p-6 overflow-y-auto" onClick={(e) => e.stopPropagation()}><div className="flex justify-between items-center mb-6"><h3 className="font-bold text-lg">Menu</h3><button onClick={() => setIsMenuOpen(false)}><span className="text-2xl">×</span></button></div><nav className="flex flex-col gap-2">{categories.map((category) => (<div key={category.id}><Link to={`/category/${category.slug}`} className="font-semibold p-2 block">{category.name}</Link>{!category.isLeaf && (<div className="pl-4 border-l-2 ml-2">{category.children.map(child => (<Link key={child.id} to={`/category/${child.slug}`} className="text-gray-600 p-2 block hover:text-primary">{child.name}</Link>))}</div>)}</div>))}</nav></div></>)}
            <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30"><div className="flex justify-around py-2"><Link to="/account" className="flex flex-col items-center"><FiUser size={20} /><span className="text-xs mt-1">Account</span></Link><Link to="/wishlist" className="flex flex-col items-center"><FiHeart size={20} /><span className="text-xs mt-1">Wishlist</span></Link><button onClick={toggleCart} className="flex flex-col items-center relative"><FiShoppingCart size={20} /><span className="text-xs mt-1">Cart</span>{itemCount > 0 && <span className="absolute -top-1 right-1 bg-primary text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center font-bold">{itemCount}</span>}</button></div></div>
        </header>
    );
}