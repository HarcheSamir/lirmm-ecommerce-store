import { useState, useRef } from "react"
import { FiChevronLeft, FiChevronRight } from "react-icons/fi"
import { FaTwitter, FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa"

// For the `no-scrollbar` class to work, add this to your global CSS file:
/*
  .no-scrollbar::-webkit-scrollbar {
      display: none;
  }
  .no-scrollbar {
      -ms-overflow-style: none;
      scrollbar-width: none;
  }
*/

export default function Test() {
  const [email, setEmail] = useState("")
  const newArrivalsScrollRef = useRef(null)

  const handleCarouselScroll = (direction) => {
    const scrollContainer = newArrivalsScrollRef.current;
    if (scrollContainer) {
      const scrollAmount = scrollContainer.offsetWidth;
      const currentScroll = scrollContainer.scrollLeft;
      const newScroll =
        direction === "left"
          ? currentScroll - scrollAmount
          : currentScroll + scrollAmount;

      scrollContainer.scrollTo({
        left: newScroll,
        behavior: "smooth",
      })
    }
  }

  const categories = [
    { name: "Deals", icon: "🏷️", bgColor: "bg-red-100" },
    { name: "Electronics", icon: "🎧", bgColor: "bg-gray-100" },
    { name: "Home & Garden", icon: "🏺", bgColor: "bg-amber-100" },
    { name: "Fashion", icon: "👜", bgColor: "bg-gray-100" },
    { name: "Jewelry", icon: "💍", bgColor: "bg-orange-100" },
    { name: "Beauty & Health", icon: "💄", bgColor: "bg-gray-100" },
    { name: "Toys & Games", icon: "🎮", bgColor: "bg-red-100" },
    { name: "Mother & Kids", icon: "👶", bgColor: "bg-gray-100" },
    { name: "Sports", icon: "🚴", bgColor: "bg-gray-100" },
  ];
  
  const newArrivals = [
    {
      id: 1,
      name: "Quart Tilt-Head Stand Mixer (Series 5)",
      store: "TechStore",
      price: "$410.00",
      rating: 5,
      image: "https://picsum.photos/200/200?random=1",
      isNew: false,
      storeColor: "text-pink-500",
    },
    {
      id: 2,
      name: "Eclipse Vase, Medium",
      store: "Zone Shop",
      price: "$78.00",
      rating: 5,
      image: "https://picsum.photos/200/200?random=2",
      isNew: true,
      storeColor: "text-blue-500",
    },
    {
      id: 3,
      name: "Solo3 On-Ear Sound Isolating Bluetooth",
      store: "Sanyo",
      price: "$248.00",
      rating: 5,
      image: "https://picsum.photos/200/200?random=3",
      isNew: true,
      storeColor: "text-yellow-500",
    },
    {
      id: 4,
      name: "The About a Chair ac 45 Frame in Oak Wood",
      store: "TechStore",
      price: "$334.00",
      rating: 4,
      image: "https://picsum.photos/200/200?random=4",
      isNew: false,
      storeColor: "text-pink-500",
    },
    {
      id: 5,
      name: "Origami Compact Leather Wallet",
      store: "TechStore",
      price: "$117.00",
      rating: 5,
      image: "https://picsum.photos/200/200?random=5",
      isNew: false,
      storeColor: "text-pink-500",
    },
  ];
  
  const featuredProducts = [
    {
      name: "Turning Table BY THERESA RAND",
      price: "$300.00",
      rating: 4,
      image: "https://picsum.photos/150/150?random=6",
    },
    {
      name: "85°C X Master Collection Men's Sneakers",
      price: "$248.00",
      originalPrice: "$300.00",
      rating: 5,
      image: "https://picsum.photos/150/150?random=7",
    },
    {
      name: "OtterBox OtterSpot Wireless Charging Battery (10000 mAh)",
      price: "$12.00",
      rating: 5,
      image: "https://picsum.photos/150/150?random=8",
    },
  ];
  
  const mostViewed = [
    {
      name: "Bottle Grinder, Bronzed Brass BY NORMANN ARCHITECTS",
      price: "$163.00",
      rating: 4,
      image: "https://picsum.photos/150/150?random=9",
    },
    {
      name: "Emu armchair",
      price: "$99.00",
      rating: 5,
      image: "https://picsum.photos/150/150?random=10",
    },
    {
      name: "Game Controller Console USB Wired connection Gamepad",
      price: "$29.00",
      originalPrice: "$39.00",
      rating: 4,
      image: "https://picsum.photos/150/150?random=11",
    },
  ];
  
  const weThinkYoullLove = [
    {
      name: "AF 1 Shadow Women's Sneaker Dream Unicorn",
      price: "$100.00",
      originalPrice: "$129.00",
      rating: 5,
      image: "https://picsum.photos/150/150?random=12",
    },
    {
      name: "Axkid Cybereye car Seat",
      price: "$240.00",
      rating: 5,
      image: "https://picsum.photos/150/150?random=13",
    },
    {
      name: "iPhone 11 Pro Max Smart Battery Case - Pink Sand",
      price: "$67.00",
      originalPrice: "$86.00",
      rating: 5,
      image: "https://picsum.photos/150/150?random=14",
    },
  ];
  
  const dailyDeals = [
    {
      name: "Café Series 33 Inch French Door Refrigerator Slate",
      price: "$1,099.00",
      originalPrice: "$1,994.00",
      rating: 5,
      image: "https://picsum.photos/200/200?random=15",
      badge: "SALE",
    },
    {
      name: "CH25 Armchair by Hans J. Wegner",
      price: "$145.00",
      originalPrice: "$245.00",
      rating: 4,
      image: "https://picsum.photos/200/200?random=16",
      badge: "SALE",
    },
    {
      name: "Cuisinart Style Blender with 6 Presets",
      price: "$109.00",
      originalPrice: "$299.00",
      rating: 5,
      image: "https://picsum.photos/200/200?random=17",
      badge: "SALE",
    },
    {
      name: "Apple iPhone SE (2020) 64GB, White",
      price: "$45.00",
      originalPrice: "$45.00",
      rating: 5,
      image: "https://picsum.photos/200/200?random=18",
      badge: "SALE",
    },
  ];
  
  const discoverSections = [
    {
      title: "Closeout Deals",
      subtitle: "Save on discontinued products before they disappear.",
      buttonText: "Shop Now",
      bgColor: "bg-blue-50",
      image: "https://picsum.photos/100/100?random=19",
    },
    {
      title: "20% Off Coffee Makers",
      subtitle: "Get top-rated products that deliver.",
      buttonText: "Shop Now",
      bgColor: "bg-amber-50",
      image: "https://picsum.photos/100/100?random=20",
    },
    {
      title: "Video game Top Deals",
      subtitle: "Check out the latest video game deals.",
      buttonText: "Shop Now",
      bgColor: "bg-blue-50",
      image: "https://picsum.photos/100/100?random=21",
    },
  ];

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`text-xs ${i < rating ? "text-yellow-400" : "text-gray-300"}`}>
        ★
      </span>
    ))
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Explore Popular Categories */}
      <section className="pl-4 md:pl-6 py-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6 pr-4 md:pr-6">Explore Popular Categories</h2>
        <div className="overflow-x-auto no-scrollbar">
          <div className="flex gap-4 sm:gap-8 pr-4 md:pr-6">
            {categories.map((category, index) => (
              <div key={index} className="flex flex-col items-center flex-shrink-0 w-20">
                <div
                  className={`w-16 h-16 ${category.bgColor} rounded-full flex items-center justify-center text-2xl mb-2 cursor-pointer hover:scale-105 transition-transform`}
                >
                  {category.icon}
                </div>
                <span className="text-xs text-gray-600 text-center">{category.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-8">
        <div className="flex justify-between items-center mb-6 px-4 md:px-6">
          <h2 className="text-xl font-semibold text-gray-900">New Arrivals</h2>
          <button className="text-sm text-blue-600 hover:underline">See All Products</button>
        </div>
        <div className="flex items-center">
          <button onClick={() => handleCarouselScroll('left')} className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors z-10 ml-2 md:ml-4">
            <FiChevronLeft className="w-5 h-5" />
          </button>
          <div ref={newArrivalsScrollRef} className="flex gap-4 overflow-x-auto flex-1 no-scrollbar snap-x snap-mandatory px-2">
            {newArrivals.map((product) => (
              <div
                key={product.id}
                className="snap-start flex-shrink-0 w-[85%] sm:w-[45%] md:w-[30%] lg:w-[240px] bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="p-4">
                  <div className="relative mb-3">
                    {product.isNew && (
                      <span className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                        New
                      </span>
                    )}
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-40 object-cover rounded-lg"
                    />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-gray-500">Home & Garden</p>
                    <h3 className="text-sm font-medium text-gray-900 line-clamp-2 h-10">{product.name}</h3>
                    <p className={`text-xs ${product.storeColor} font-medium`}>● {product.store}</p>
                    <p className="text-sm font-semibold text-gray-900">{product.price}</p>
                    <div className="flex items-center gap-1">
                      {renderStars(product.rating)}
                      <span className="text-xs text-gray-500 ml-1">({product.rating})</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button onClick={() => handleCarouselScroll('right')} className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors z-10 mr-2 md:mr-4">
            <FiChevronRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Three Column Product Sections */}
      <section className="px-4 md:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Featured Products */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Featured Products</h3>
            <div className="space-y-4">
              {featuredProducts.map((product, index) => (
                <div
                  key={index}
                  className="flex gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                  />
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-900 mb-1">{product.name}</h4>
                    <div className="flex items-center gap-2 mb-1">
                      {product.originalPrice && (
                        <span className="text-xs text-gray-400 line-through">{product.originalPrice}</span>
                      )}
                      <span className="text-sm font-semibold text-gray-900">{product.price}</span>
                    </div>
                    <div className="flex items-center">{renderStars(product.rating)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Most-viewed Items */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Most-viewed Items</h3>
            <div className="space-y-4">
              {mostViewed.map((product, index) => (
                <div
                  key={index}
                  className="flex gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                  />
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-900 mb-1">{product.name}</h4>
                    <div className="flex items-center gap-2 mb-1">
                      {product.originalPrice && (
                        <span className="text-xs text-gray-400 line-through">{product.originalPrice}</span>
                      )}
                      <span className="text-sm font-semibold text-gray-900">{product.price}</span>
                    </div>
                    <div className="flex items-center">{renderStars(product.rating)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* We Think You'll Love */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">We Think You'll Love</h3>
            <div className="space-y-4">
              {weThinkYoullLove.map((product, index) => (
                <div
                  key={index}
                  className="flex gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                  />
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-900 mb-1">{product.name}</h4>
                    <div className="flex items-center gap-2 mb-1">
                      {product.originalPrice && (
                        <span className="text-xs text-gray-400 line-through">{product.originalPrice}</span>
                      )}
                      <span className="text-sm font-semibold text-gray-900">{product.price}</span>
                    </div>
                    <div className="flex items-center">{renderStars(product.rating)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Daily Deals */}
      <section className="px-4 md:px-6 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Daily Deals</h2>
          <button className="text-sm text-blue-600 hover:underline">See All</button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Timer Card */}
          <div className="bg-orange-50 rounded-lg border border-orange-200 p-6 text-center lg:col-span-1 sm:col-span-2">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Only Available For 24 Hours</h3>
            <p className="text-sm text-gray-600 mb-4">{"Don't Miss Out!"}</p>
            <div className="flex justify-center gap-2 mb-4">
              <div className="w-10 h-10 bg-teal-600 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                12
              </div>
              <div className="w-10 h-10 bg-teal-600 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                34
              </div>
              <div className="w-10 h-10 bg-teal-600 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                56
              </div>
            </div>
            <div className="grid grid-cols-3 text-xs text-gray-500 mb-4">
              <span>Hours</span>
              <span>Mins</span>
              <span>Secs</span>
            </div>
            <button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg font-medium transition-colors">
              Shop All Products
            </button>
          </div>

          {/* Deal Products */}
          {dailyDeals.map((product, index) => (
            <div
              key={index}
              className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="p-4">
                <div className="relative mb-3">
                  <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                    {product.badge}
                  </span>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-40 object-cover rounded-lg"
                  />
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-gray-500">Electronics</p>
                  <h3 className="text-sm font-medium text-gray-900 line-clamp-2 h-10">{product.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400 line-through">{product.originalPrice}</span>
                    <span className="text-sm font-semibold text-gray-900">{product.price}</span>
                  </div>
                  <div className="flex items-center">{renderStars(product.rating)}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* More to Discover */}
      <section className="px-4 md:px-6 py-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">More to Discover</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {discoverSections.map((section, index) => (
            <div key={index} className={`${section.bgColor} rounded-lg border border-gray-200 p-6`}>
              <div className="flex flex-col text-center sm:flex-row sm:text-left items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{section.title}</h3>
                  <p className="text-sm text-gray-600 mb-4">{section.subtitle}</p>
                  <button className="bg-white hover:bg-gray-50 border border-gray-300 text-gray-900 py-2 px-4 rounded-lg font-medium transition-colors">
                    {section.buttonText}
                  </button>
                </div>
                <div className="mt-4 sm:mt-0 sm:ml-4 flex-shrink-0">
                  <img
                    src={section.image}
                    alt={section.title}
                    className="w-24 h-24 object-cover"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white px-4 md:px-6 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Logo and Description */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-white rounded-full mx-auto mb-4 flex items-center justify-center">
              <div className="w-8 h-8 bg-gray-800 rounded-full"></div>
            </div>
            <p className="text-sm text-gray-300 max-w-md mx-auto">
              Quality tech and audio products crafted to elevate your daily experience with reliability and style.
            </p>
          </div>

          {/* Social Media Icons */}
          <div className="flex justify-center gap-4 mb-8">
            <FaTwitter className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
            <FaFacebookF className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
            <FaInstagram className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
            <FaYoutube className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
          </div>

          {/* Footer Links and Newsletter */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            {/* Shop */}
            <div className="col-span-1">
              <h4 className="font-semibold mb-4">Shop</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    All products
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Speakers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Components
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Accessories
                  </a>
                </li>
              </ul>
            </div>

            {/* Information */}
            <div className="col-span-1">
              <h4 className="font-semibold mb-4">Information</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Shipping Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Refund Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div className="col-span-1">
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    About us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            {/* Newsletter */}
            <div className="col-span-2">
              <h4 className="font-semibold mb-4">Subscribe for our newsletter</h4>
              <div className="flex flex-col sm:flex-row gap-2 mb-4">
                <input
                  type="email"
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-gray-700 border border-gray-600 text-white placeholder-gray-400 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                  Subscribe →
                </button>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <input type="checkbox" id="privacy-policy" className="rounded" />
                <label htmlFor="privacy-policy">I accept the terms of Privacy policy</label>
              </div>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col lg:flex-row justify-between items-center text-center lg:text-left gap-8 lg:gap-4 text-sm text-gray-400">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <span>© 2025 San Francisco Minimal. Powered by Shopify</span>
              <span>Armenia (CAD $)</span>
              <span>English</span>
            </div>
            <div className="flex gap-2 flex-wrap justify-center">
              <img src="https://placehold.co/38x24/cccccc/111111?text=V" alt="Visa" className="h-6" />
              <img src="https://placehold.co/38x24/cccccc/111111?text=M" alt="Mastercard" className="h-6" />
              <img src="https://placehold.co/38x24/cccccc/111111?text=A" alt="American Express" className="h-6" />
              <img src="https://placehold.co/38x24/cccccc/111111?text=P" alt="PayPal" className="h-6" />
              <img src="https://placehold.co/38x24/cccccc/111111?text=D" alt="Diners Club" className="h-6" />
              <img src="https://placehold.co/38x24/cccccc/111111?text=D" alt="Discover" className="h-6" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}