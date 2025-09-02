import { useRef, useEffect } from "react"
import { Link } from "react-router-dom"
import { useProductStore } from "../../../store/productStore"
import { useCategoryStore } from "../../../store/categoryStore"
import { useSettings } from "../../../context/SettingsContext"
import { useTranslation } from "react-i18next"
import { FiChevronLeft, FiChevronRight, FiStar } from "react-icons/fi"
import ProductCard from "../../../components/ProductCard"
import ProductCardSkeleton from "../../../components/ProductCardSkeleton"

const CategoryCard = ({ category, icon, index }) => (
    <Link
        to={`/shop/${category.slug}`}
        className="flex flex-col items-center flex-shrink-0 w-20 text-center group transform-gpu"
        style={{ animationDelay: `${index * 100}ms` }}
    >
        <div className="w-16 h-16 bg-primary/5 rounded-2xl flex items-center justify-center text-2xl mb-3 cursor-pointer transition-all duration-500 ease-out hover:scale-110 hover:rotate-6 hover:shadow-lg hover:shadow-primary/20 transform-gpu border border-primary/10 hover:bg-primary/10">
            <span className="transition-transform duration-300 group-hover:scale-125">{icon}</span>
        </div>
        <span className="text-xs text-gray-600 font-medium group-hover:text-primary transition-colors duration-300">
            {category.name}
        </span>
    </Link>
)

export default function Shop() {
    const newArrivalsScrollRef = useRef(null)
    const { products, fetchProducts, isLoading: productsLoading } = useProductStore()
    const { categories, fetchCategories, isLoading: categoriesLoading } = useCategoryStore()
    const { language, currency } = useSettings();
    const { t } = useTranslation();

    useEffect(() => {
        fetchProducts(1, 20, { sortBy: "createdAt", sortOrder: "desc", isActive: "true" })
        fetchCategories() // No need for params here, it fetches all
    }, [fetchProducts, fetchCategories])

    const handleCarouselScroll = (direction) => {
        const scrollContainer = newArrivalsScrollRef.current
        if (scrollContainer) {
            const scrollAmount = scrollContainer.offsetWidth * 0.9
            scrollContainer.scrollBy({
                left: direction === "left" ? -scrollAmount : scrollAmount,
                behavior: "smooth",
            })
        }
    }

    const formatPrice = (price) => {
        if (price === undefined || price === null) return "N/A";
        return new Intl.NumberFormat(language, { style: 'currency', currency }).format(price);
    };

    const newArrivals = products.slice(0, 8)
    const featuredProducts = products.slice(8, 11)
    const mostViewed = products.slice(11, 14)
    const weThinkYoullLove = products.slice(14, 17)

    const categoryIcons = {
        default: "🏷️",
        electronique: "🎧",
        "maison-cuisine": "🏺",
        mode: "👜",
        bijoux: "💍",
        "sante-beaute": "💄",
        "jouets-jeux": "🎮",
        accessoires: "👶",
        "sport-plein-air": "🚴",
    }

    const sections = [
        { title: t("featured_products"), products: featuredProducts, color: "primary" },
        { title: t("most_viewed_items"), products: mostViewed, color: "slate-600" },
        { title: t("we_think_youll_love"), products: weThinkYoullLove, color: "slate-700" },
    ];

    return (
        <div className="min-h-screen max-w-6xl mx-auto " id="shop">
            <section className="pl-4 md:pl-6 py-12">
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('explore_popular_categories')}</h2>
                    <div className="w-20 h-1 bg-primary rounded-full"></div>
                </div>
                <div className="overflow-x-auto no-scrollbar">
                    <div className="flex gap-6 sm:gap-8 pr-4 md:pr-6">
                        {categoriesLoading
                            ? Array.from({ length: 8 }).map((_, i) => (
                                <div key={i} className="flex flex-col items-center w-20 animate-pulse"><div className="w-16 h-16 bg-slate-200 rounded-2xl mb-3" /><div className="h-3 bg-slate-200 rounded w-12" /></div>
                            ))
                            : categories.map((cat, index) => (
                                <CategoryCard key={cat.id} category={cat} icon={categoryIcons[cat.slug] || categoryIcons["default"]} index={index} />
                            ))}
                    </div>
                </div>
            </section>

            <section className="py-12 group">
                <div className="flex justify-between  items-center mb-8 px-4 md:px-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('new_arrivals')}</h2>
                        <div className="w-16 group-hover:w-[150%] transition-all duration-700 ease-out h-1 bg-primary rounded-full"></div>
                    </div>
                    <Link to="/shop" className="text-sm font-medium text-primary hover:text-primary-dark transition-colors duration-300 flex items-center gap-1 group">
                        {t('see_all_products')}
                        <FiChevronRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                </div>

                <div className="relative flex items-center">
                    <button onClick={() => handleCarouselScroll("left")} className="p-3 rounded-full bg-white/80 backdrop-blur-sm shadow-lg hover:bg-white hover:shadow-xl transition-all duration-300 z-10 ml-2 md:ml-0 absolute left-0 hover:scale-110 transform-gpu border border-gray-100">
                        <FiChevronLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <div ref={newArrivalsScrollRef} className="flex gap-6 overflow-x-auto no-scrollbar snap-x snap-mandatory px-4 py-2 scroll-smooth">
                        {productsLoading
                            ? Array.from({ length: 5 }).map((_, index) => (<div key={index} className="snap-start flex-shrink-0 w-[85%] sm:w-[45%] md:w-[30%] lg:w-[280px]"><ProductCardSkeleton index={index} /></div>))
                            : newArrivals.map((product, index) => (<div key={product.id} className="snap-start flex-shrink-0 w-[85%] sm:w-[45%] md:w-[30%] lg:w-[280px]"><ProductCard product={product} index={index} /></div>))
                        }
                    </div>
                    <button onClick={() => handleCarouselScroll("right")} className="p-3 rounded-full bg-white/80 backdrop-blur-sm shadow-lg hover:bg-white hover:shadow-xl transition-all duration-300 z-10 mr-2 md:mr-0 absolute right-0 hover:scale-110 transform-gpu border border-gray-100">
                        <FiChevronRight className="w-5 h-5 text-gray-600" />
                    </button>
                </div>
            </section>

            <section className="px-4 md:px-6 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {sections.map((section, sectionIndex) => (
                        <div key={section.title} className="group" style={{ animationDelay: `${sectionIndex * 200}ms` }}>
                            <div className="mb-6">
                                <h3 className="text-lg font-bold text-gray-900 mb-2">{section.title}</h3>
                                <div className={`w-12 h-1 rounded-full transition-all duration-700 ease-out group-hover:w-[80%] bg-${section.color}`} ></div>
                            </div>
                            <div className="space-y-4">
                                {productsLoading
                                    ? Array.from({ length: 3 }).map((_, i) => (<div key={i} className="flex gap-4 p-3 animate-pulse rounded-xl"><div className="w-16 h-16 bg-slate-200 rounded-xl" /><div className="flex-1 space-y-2 py-1"><div className="h-4 bg-slate-200 rounded-full w-full" /><div className="h-4 bg-slate-200 rounded-full w-2/3" /></div></div>))
                                    : section.products.map((product, index) => (
                                        <Link to={`/products/${product.id}`} key={product.id} className="flex gap-4 p-3 rounded-xl hover:bg-white hover:shadow-lg transition-all duration-300 cursor-pointer transform-gpu hover:-translate-y-1">
                                            <div className="relative overflow-hidden rounded-xl">
                                                <img src={product.images?.[0]?.imageUrl || "https://placehold.co/150x150/e2e8f0/cccccc?text=Img"} alt={product.name} className="w-16 h-16 object-cover flex-shrink-0 bg-gray-100 transition-transformduration-300 hover:scale-110" />
                                                <div className="absolute inset-0 bg-primary/20 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                                            </div>
                                            <div className="flex-1 space-y-1">
                                                <h4 className="text-sm font-medium text-gray-900 line-clamp-2 hover:text-primary transition-colors duration-300">{product.name}</h4>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm font-semibold text-primary">{formatPrice(product.variants?.[0]?.price)}</span>
                                                    <div className="flex items-center gap-1 text-yellow-400">
                                                        <FiStar size={10} className="fill-current" />
                                                        <span className="text-xs text-slate-600">{product.averageRating ? product.averageRating.toFixed(1) : 'N/A'}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    )
}