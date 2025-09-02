import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';
import { useCategoryStore } from '../store/categoryStore';
import { useScrollDirection } from '../hooks/useScrollDirection';
import { useSettings, supportedCurrencies, supportedLanguages } from '../context/SettingsContext';
import { useTranslation } from 'react-i18next';
import { FiGlobe, FiHeart, FiShoppingCart, FiUser, FiMenu, FiPackage, FiHelpCircle, FiChevronDown } from 'react-icons/fi';
import { GrCurrency } from "react-icons/gr";
import MegaMenu from './MegaMenu';
import ProfileDropdown from './ProfileDropdown';
import SearchWithSuggestions from './SearchWithSuggestions';

export default function HomeNavbar() {
    const navigate = useNavigate();
    const { isAuthenticated, user, logout } = useAuthStore();
    const { t } = useTranslation();
    const { language, changeLanguage, currency, changeCurrency } = useSettings();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileOpen, setProfileOpen] = useState(false);
    const profileTimeoutRef = useRef(null);
    const scrollData = useScrollDirection();

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

    const itemCount = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

    useEffect(() => {
        fetchCategories();
        return () => {
            clearTimeout(hoverTimeoutRef.current);
            clearTimeout(profileTimeoutRef.current);
        };
    }, [fetchCategories]);

    const currentLangName = supportedLanguages.find(l => l.code === language)?.name || 'Language';

    return (
        <header
            ref={headerRef}
            className="w-full font-sans bg-white sticky top-0 z-30"
            style={{
                transform: `translateY(${scrollData.transform}px)`,
                transition: scrollData.direction === 'up' ? 'transform 0.2s ease-out' : 'none'
            }}
        >
            <div>
                <div className="border-b border-gray-200">
                    <div className="container mx-auto px-4">
                        <div className="flex justify-between items-center py-2">
                            {/* === SURGICAL MODIFICATION: Language & Currency Switchers === */}
                            <div className="flex items-center">
                                <div className="flex items-center mr-4 relative group">
                                    <FiGlobe size={16} className="mr-1 text-gray-500" />
                                    <select
                                        value={language}
                                        onChange={(e) => changeLanguage(e.target.value)}
                                        className="text-sm text-gray-500 bg-transparent appearance-none cursor-pointer pr-4 focus:outline-none"
                                    >
                                        {supportedLanguages.map(lang => <option key={lang.code} value={lang.code}>{lang.name}</option>)}
                                    </select>
                                </div>
                                <div className="hidden sm:flex items-center relative group">
                                    <GrCurrency size={16} className="mr-1 text-gray-500" />
                                    <select
                                        value={currency}
                                        onChange={(e) => changeCurrency(e.target.value)}
                                        className="text-sm text-gray-500 bg-transparent appearance-none cursor-pointer pr-4 focus:outline-none"
                                    >
                                        {supportedCurrencies.map(curr => <option key={curr.code} value={curr.code}>{curr.name}</option>)}
                                    </select>
                                </div>
                            </div>
                            {/* === END MODIFICATION === */}
                            <div className="flex items-center text-sm text-gray-500">
                                <Link to="/track-order" className="flex items-center mr-4 hover:text-primary"><FiPackage size={16} className="mr-1" /><span>{t('track_order')}</span></Link>
                                <Link to="/help" className="hidden md:flex items-center mr-4 hover:text-primary"><FiHelpCircle size={16} className="mr-1" /><span>{t('help_center')}</span></Link>
                                <Link to="/wishlist" className="hidden md:flex items-center hover:text-primary"><FiHeart size={16} className="mr-1" /><span>{t('wishlist')}</span></Link>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="border-b border-gray-200 py-4"><div className="container mx-auto px-4"><div className="flex items-center gap-4"><Link to="/" className="text-2xl font-bold text-gray-900">ECOM</Link><button className="lg:hidden cursor-pointer" onClick={() => setIsMenuOpen(!isMenuOpen)}><FiMenu size={24} /></button>
                    <SearchWithSuggestions />
                    <div className="hidden sm:flex items-center ml-4 space-x-6">
                        <div className="relative" onMouseEnter={handleProfileMouseEnter} onMouseLeave={handleProfileMouseLeave}>
                            {isAuthenticated ? (
                                <div className="flex font-semibold cursor-pointer gap-1 items-end hover:text-primary">
                                    <FiUser />
                                    <span className="text-xs mt-1">{t('account')}</span>
                                </div>
                            ) : (
                                <Link to="/login" className="flex font-semibold cursor-pointer gap-1 items-end hover:text-primary">
                                    <FiUser />
                                    <span className="text-xs mt-1">{t('account')}</span>
                                </Link>
                            )}
                            {isAuthenticated && isProfileOpen && <ProfileDropdown user={user} onLogout={handleLogout} />}
                        </div>
                        <Link to="/wishlist" className="flex font-semibold cursor-pointer gap-1 items-end hover:text-primary"><FiHeart /><span className="text-xs mt-1">{t('wishlist')}</span></Link><button onClick={toggleCart} className="flex font-semibold cursor-pointer gap-1 items-end hover:text-primary relative"><FiShoppingCart /><span className="text-xs mt-1">{t('cart')}</span>{itemCount > 0 && <span className="absolute -top-2 -right-3 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">{itemCount}</span>}</button></div>
                </div></div></div>

                <div className="border-b border-gray-200 hidden lg:flex justify-center" onMouseLeave={handleMouseLeave}>
                    <nav className="group flex overflow-x-auto py-3 container mx-auto px-4 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-transparent hover:scrollbar-thumb-gray-300 scrollbar-thumb-rounded-full">
                        {categories.map((category) => (
                            <div key={category.id} className="flex items-center" onMouseEnter={(e) => handleMouseEnter(e, category)}>
                                <Link to={`/shop/${category.slug}`} className="flex items-center gap-1.5 whitespace-nowrap px-3 text-gray-500 font-semibold text-sm cursor-pointer hover:text-primary flex-shrink-0">
                                    {category.name}
                                    {!category.isLeaf && <FiChevronDown className={`w-4 h-4 transition-transform ${activeMenu.category?.id === category.id ? 'rotate-180' : ''}`} />}
                                </Link>
                            </div>
                        ))}
                    </nav>
                </div>
            </div>

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

            {isMenuOpen && (<><div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setIsMenuOpen(false)}></div><div className="fixed left-0 top-0 h-full w-72 bg-white z-50 p-6 overflow-y-auto" onClick={(e) => e.stopPropagation()}><div className="flex justify-between items-center mb-6"><h3 className="font-bold text-lg">Menu</h3><button onClick={() => setIsMenuOpen(false)}><span className="text-2xl">×</span></button></div><nav className="flex flex-col gap-2">{categories.map((category) => (<div key={category.id}><Link to={`/shop/${category.slug}`} className="font-semibold p-2 block">{category.name}</Link>{!category.isLeaf && (<div className="pl-4 border-l-2 ml-2">{category.children.map(child => (<Link key={child.id} to={`/shop/${child.slug}`} className="text-gray-600 p-2 block hover:text-primary">{child.name}</Link>))}</div>)}</div>))}</nav></div></>)}
            <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30"><div className="flex justify-around py-2"><Link to="/account" className="flex flex-col items-center"><FiUser size={20} /><span className="text-xs mt-1">{t('account')}</span></Link><Link to="/wishlist" className="flex flex-col items-center"><FiHeart size={20} /><span className="text-xs mt-1">{t('wishlist')}</span></Link><button onClick={toggleCart} className="flex flex-col items-center relative"><FiShoppingCart size={20} /><span className="text-xs mt-1">{t('cart')}</span>{itemCount > 0 && <span className="absolute -top-1 right-1 bg-primary text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center font-bold">{itemCount}</span>}</button></div></div>
        </header>
    );
}