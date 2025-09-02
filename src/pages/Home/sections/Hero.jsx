import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { usePromotionStore } from '../../../store/promotionStore';
import { useCountdown } from '../../../hooks/useCountdown'; // Import the fixed hook
import { BsChevronLeft, BsChevronRight } from 'react-icons/bs';
import { useTranslation } from 'react-i18next';

// --- START: COMPONENTS ---

const MainBanner = ({ promotions }) => {
    const [currentSlide, setCurrentSlide] = useState(0);

    if (!promotions || promotions.length === 0) {
        return <div className="col-span-1 md:col-span-2 h-[50vh] md:h-full w-full bg-gray-200 rounded-lg animate-pulse" />;
    }

    const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % promotions.length);
    const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + promotions.length) % promotions.length);

    return (
        <div className="relative col-span-1 md:col-span-2 h-[50vh] md:h-full w-full bg-gray-200 rounded-lg overflow-hidden">
            {promotions.map((promo, index) => (
                <div
                    key={promo.id}
                    className={`absolute top-0 left-0 w-full h-full transition-all duration-500 ease-in-out transform ${index === currentSlide ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}
                    style={{ zIndex: index === currentSlide ? 10 : 0, transitionProperty: 'transform, opacity' }}
                >
                    <img src={promo.imageUrl} alt={promo.title} className="absolute inset-0 w-full h-full object-cover -z-10" />
                    <div className="p-8 h-full flex flex-col justify-between">
                        <div>
                            <p className="text-sm font-medium text-white tracking-wider">{promo.tagline || ''}</p>
                            <h2 className="text-5xl font-bold text-white mt-2 mb-2">{promo.title}</h2>
                            <p className="text-sm text-white/80 max-w-xs">{promo.subtitle || ''}</p>
                            <Link to={promo.ctaLink}>
                                <button className="bg-white mt-4 font-bold px-6 py-3 rounded-md text-sm text-[#DAB1A9] hover:bg-gray-100 transition-colors">
                                    {promo.ctaText}
                                </button>
                            </Link>
                        </div>
                        <div className="flex items-end justify-between mt-4">
                            <div className="flex gap-2 z-20">
                                {promotions.length > 1 && (
                                    <>
                                        <button onClick={prevSlide} className="w-10 h-10 flex items-center justify-center bg-white/80 rounded-full text-primary hover:bg-white/90"><BsChevronLeft size={16} /></button>
                                        <button onClick={nextSlide} className="w-10 h-10 flex items-center justify-center bg-white/80 rounded-full text-primary hover:bg-white/90"><BsChevronRight size={16} /></button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

const SideOffer = ({ promotion }) => {
    const { t } = useTranslation();

    if (!promotion) {
        return <div className="w-full h-[50vh] md:h-full rounded-lg bg-gray-200 animate-pulse" />;
    }
    
    const timeLeft = useCountdown(promotion.expiresAt);
    const CountdownUnit = ({ value, label }) => (
        <div className="flex flex-col items-center">
            <div className="bg-white rounded w-12 h-12 flex items-center justify-center text-xl font-semibold text-gray-800">{String(value).padStart(2, '0')}</div>
            <span className="text-xs text-gray-500 mt-1">{label}</span>
        </div>
    );

    return (
        <div className="relative w-full h-[50vh] md:h-full rounded-lg p-6 flex flex-col items-center overflow-hidden">
            <img src={promotion.imageUrl|| '/assets/hero2'} alt={promotion.title} className="absolute inset-0 w-full h-full object-cover z-10 " />
            <div className="text-center mb-4 z-10">
                <h3 className="text-gray-600 text-sm">{promotion.tagline || t('limited_time_offer')}</h3>
                <div className="flex gap-2 justify-center mt-2">
                    {timeLeft.days > 0 && (
                        <>
                            <CountdownUnit value={timeLeft.days} label={t('countdown_days')} />
                            <div className="text-xl font-bold self-center text-gray-700">:</div>
                        </>
                    )}
                    <CountdownUnit value={timeLeft.hours} label={t('countdown_hours')} />
                    <div className="text-xl font-bold self-center text-gray-700">:</div>
                    <CountdownUnit value={timeLeft.minutes} label={t('countdown_mins')} />
                    <div className="text-xl font-bold self-center text-gray-700">:</div>
                    <CountdownUnit value={timeLeft.seconds} label={t('countdown_secs')} />
                </div>
            </div>
            {promotion.productImageUrl &&
                <div className="relative z-10 my-4 flex-grow flex items-center">
                    <img src={promotion.productImageUrl} alt={t('offer_product_alt')} className="max-h-full max-w-full object-contain" />
                </div>
            }
            <div className="mt-auto  z-10 flex flex-col text-[#7c3b31] items-center text-center">
                <h2 className="text-3xl font-bold mb-1">{promotion.title}</h2>
                <p className="text-sm mb-4">{promotion.subtitle}</p>
                <Link to={promotion.ctaLink} className="text-gray-700 text-[12px] font-semibold cursor-pointer underline hover:text-black">
                    {promotion.ctaText}
                </Link>
            </div>
        </div>
    );
};

// --- END: COMPONENTS ---


export default function Hero() {
    const { promotions, isLoading, fetchActivePromotions } = usePromotionStore();

    useEffect(() => {
        fetchActivePromotions();
    }, [fetchActivePromotions]);

    const { timeLimitedPromotion, standardPromotions } = useMemo(() => {
        const timeLimited = promotions.find(p => p.expiresAt && new Date(p.expiresAt) > new Date());
        const standard = promotions.filter(p => !p.expiresAt || p.id !== timeLimited?.id);
        return {
            timeLimitedPromotion: timeLimited,
            standardPromotions: standard,
        };
    }, [promotions]);

    if (isLoading && promotions.length === 0) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-3 h-auto md:h-[80vh] gap-4 max-w-6xl mx-auto p-4 animate-pulse">
                <div className="col-span-1 md:col-span-2 h-[50vh] md:h-full w-full bg-gray-200 rounded-lg" />
                <div className="w-full h-[50vh] md:h-full rounded-lg bg-gray-200" />
            </div>
        );
    }
    
    if (!isLoading && promotions.length === 0) {
        return null; // Don't render the section if there are no promotions
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 h-auto md:h-[80vh] gap-4 max-w-6xl mx-auto p-4">
            <MainBanner promotions={standardPromotions} />
            <SideOffer promotion={timeLimitedPromotion} />
        </div>
    );
}