
import { useState, useEffect } from 'react';
import { BsChevronLeft, BsChevronRight } from 'react-icons/bs';

export default function Hero() {
    // Countdown timer state
    const [timeLeft, setTimeLeft] = useState({
        hours: 16,
        minutes: 15,
        seconds: 26
    });

    // Carousel state with active slide tracking
    const [currentSlide, setCurrentSlide] = useState(0);

    // Products data
    const products = [
        {
            id: 1,
            category: `<p class="text-sm font-medium text-white tracking-wider">APPLIANCES</p>`,
            name: `<p class="text-5xl font-bold text-white mt-2 mb-2">Felly Fan</p>`,
            description: `<p class="text-sm text-white/80 max-w-xs">The summer without wind has lost the whole world.</p>`,
            buttonText: `<p class="text-[#DAB1A9] font-bold text-sm">Shop Now</p>`,
            image: "/assets/hero1.png" // Placeholder for fan image
        },
        {
            id: 2,
            category: `<p class="text-sm font-medium text-primary tracking-wider">ELECTRONICS</p>`,
            name: `<p class="text-5xl font-bold text-primary mt-2 mb-2">Echo Speaker</p>`,
            description: `<p class="text-sm text-primary/80 max-w-xs">Music that flows through your soul.</p>`,
            buttonText: `<p class=" font-bold text-sm">View Details</p>`,
            image: "/assets/hero2.png"
        },
        {
            id: 3,
            category: `<p class="text-sm font-medium text-primary tracking-wider">HOME DECOR</p>`,
            name: `<p class="text-5xl font-bold text-primary mt-2 mb-2">Ambient Lamp</p>`,
            description: `<p class="text-sm text-primary/80 max-w-xs">Light up your space with elegant design.</p>`,
            buttonText: `<p class=" font-bold text-sm">Explore</p>`,
            image: "/assets/hero3.png"
        }
    ];

    // Carousel navigation functions with enhanced visual feedback
    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % products.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + products.length) % products.length);
    };

    // Countdown timer effect
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev.seconds > 0) {
                    return { ...prev, seconds: prev.seconds - 1 };
                } else if (prev.minutes > 0) {
                    return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
                } else if (prev.hours > 0) {
                    return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
                }
                return { hours: 0, minutes: 0, seconds: 0 };
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    // Indicator dots for carousel
    const CarouselIndicators = () => (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
            {products.map((_, index) => (
                <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-2 h-2 rounded-full transition-all ${currentSlide === index ? "bg-white w-4" : "bg-white/50"
                        }`}
                    aria-label={`Go to slide ${index + 1}`}
                />
            ))}
        </div>
    );

    return (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 h-auto md:h-[80vh] gap-4 max-w-6xl mx-auto p-4">
            {/* Left carousel section */}
            <div className="relative col-span-1 md:col-span-2 h-[50vh] md:h-full w-full bg-gray-200 rounded-lg overflow-hidden transition-all duration-500 ease-in-out">
                {products.map((product, index) => (
                    <div
                        key={product.id}
                        className={`absolute top-0 left-0 w-full h-full transition-all duration-500 ease-in-out transform ${index === currentSlide ? 'translate-x-0 opacity-100 z-10' :
                            index < currentSlide ? '-translate-x-full opacity-0 z-0' : 'translate-x-full opacity-0 z-0'
                            }`}
                        style={{ transitionProperty: 'transform, opacity' }}
                    >
                        <div className="p-4 md:p-8 h-full flex flex-col justify-between">
                            <div>
                                <div
                                    className="text-xs md:text-sm font-medium tracking-wider"
                                    dangerouslySetInnerHTML={{ __html: product.category }}
                                />

                                <div
                                    className="text-3xl md:text-5xl font-bold mt-2 mb-2"
                                    dangerouslySetInnerHTML={{ __html: product.name }}
                                />

                                <div
                                    className="text-xs md:text-sm max-w-xs"
                                    dangerouslySetInnerHTML={{ __html: product.description }}
                                />

                                <button className="bg-white mt-4 font-bold px-4 md:px-6 py-2 md:py-3 rounded-md text-xs md:text-sm hover:bg-gray-100 transition-colors">
                                    <span dangerouslySetInnerHTML={{ __html: product.buttonText }} />
                                </button>
                            </div>

                            <div className="flex items-end justify-between mt-4">
                                <div className="flex gap-2 z-20">
                                    <button
                                        onClick={prevSlide}
                                        className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center bg-white/80 cursor-pointer rounded-full text-primary hover:bg-white/30 transition-colors active:bg-white/40"
                                        aria-label="Previous slide"
                                    >
                                        <BsChevronLeft size={16} className="md:text-xl" />
                                    </button>
                                    <button
                                        onClick={nextSlide}
                                        className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center bg-white/80 cursor-pointer rounded-full text-primary hover:bg-white/30 transition-colors active:bg-white/40"
                                        aria-label="Next slide"
                                    >
                                        <BsChevronRight size={16} className="md:text-xl" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="absolute w-full -z-50 inset-0">
                            <img src={product.image} alt={product.name} className="object-cover w-full h-full" />
                        </div>
                    </div>
                ))}

                {/* Carousel indicators */}
                <CarouselIndicators />
            </div>

            {/* Right special offer section */}
            <div className="relative w-full h-[50vh] md:h-full rounded-lg p-4  md:p-6 flex flex-col items-center overflow-hidden mt-4 md:mt-0">
                <div className="absolute h-full z-0 w-full inset-0 ">
                    <img src="/assets/hero4.png" alt="Nike Jogger Sneakers" className="object-cover w-full h-full " />
                </div>
                <div className="text-center mb-2 md:mb-4 z-10">
                    <h3 className="text-gray-600 text-xs md:text-sm">Limited Time Offer</h3>

                    {/* Countdown timer */}
                    <div className="flex gap-1 md:gap-2 justify-center mt-2">
                        <div className="flex flex-col items-center">
                            <div className="bg-white rounded w-8 h-8 md:w-12 md:h-12 flex items-center justify-center text-sm md:text-xl font-semibold">
                                {String(timeLeft.hours).padStart(2, '0')}
                            </div>
                            <span className="text-xs text-gray-500 mt-1">Hours</span>
                        </div>
                        <div className="text-sm md:text-xl font-bold self-center">:</div>
                        <div className="flex flex-col items-center">
                            <div className="bg-white rounded w-8 h-8 md:w-12 md:h-12 flex items-center justify-center text-sm md:text-xl font-semibold">
                                {String(timeLeft.minutes).padStart(2, '0')}
                            </div>
                            <span className="text-xs text-gray-500 mt-1">Mins</span>
                        </div>
                        <div className="text-sm md:text-xl font-bold self-center">:</div>
                        <div className="flex flex-col items-center">
                            <div className="bg-white rounded w-8 h-8 md:w-12 md:h-12 flex items-center justify-center text-sm md:text-xl font-semibold">
                                {String(timeLeft.seconds).padStart(2, '0')}
                            </div>
                            <span className="text-xs text-gray-500 mt-1">Secs</span>
                        </div>
                    </div>
                </div>

                {/* Product preview */}
                <div className="mt-auto z-10 flex flex-col text-[#7c3b31] items-center">
                    <h2 className="text-xl md:text-3xl font-bold mb-1">Nike Jogger</h2>
                    <p className="text-xs md:text-sm mb-2 md:mb-4">Up to 40% off Women Sneakers</p>

                    <p className="text-gray-700 text-[10px] md:text-[12px] font-semibold cursor-pointer underline">
                        Shop Now
                    </p>
                </div>
            </div>
        </div>
    );
}