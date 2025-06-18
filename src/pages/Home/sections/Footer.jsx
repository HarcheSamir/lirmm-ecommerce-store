"use client"

import { useState } from "react"
import { FaTwitter, FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa"

export default function Footer() {
    const [email, setEmail] = useState("")

    return (
        <footer className=" px-4 md:px-6 py-12">
            <div className="max-w-6xl mx-auto">
                {/* Main Footer Card */}
                <div className="bg-gray-800 text-white rounded-3xl px-8 md:px-12 py-16 mb-8">
                    {/* Logo and Description */}
                    <div className="text-center mb-12">
                        {/* Concentric circles logo */}
                        <div className="w-20 h-20 mx-auto mb-6 relative">
                            <div className="absolute inset-0 border-4 border-white rounded-full"></div>
                            <div className="absolute inset-2 border-4 border-white rounded-full"></div>
                            <div className="absolute inset-4 bg-white rounded-full"></div>
                        </div>
                        <p className="text-gray-300 max-w-md mx-auto leading-relaxed">
                            Quality tech and audio products crafted to elevate your daily experience with reliability and style.
                        </p>
                    </div>

                    {/* Social Media Icons */}
                    <div className="flex justify-center gap-6 mb-16">
                        <FaTwitter className="w-6 h-6 text-gray-300 hover:text-white cursor-pointer transition-colors" />
                        <FaFacebookF className="w-6 h-6 text-gray-300 hover:text-white cursor-pointer transition-colors" />
                        <FaInstagram className="w-6 h-6 text-gray-300 hover:text-white cursor-pointer transition-colors" />
                        <FaYoutube className="w-6 h-6 text-gray-300 hover:text-white cursor-pointer transition-colors" />
                    </div>

                    {/* Footer Links and Newsletter */}
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-12">
                        {/* Shop */}
                        <div>
                            <h4 className="font-medium mb-6 text-gray-400">Shop</h4>
                            <ul className="space-y-4 text-white">
                                <li>
                                    <a href="#" className="hover:text-gray-300 transition-colors">
                                        All products
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-gray-300 transition-colors">
                                        Speakers
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-gray-300 transition-colors">
                                        Components
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-gray-300 transition-colors">
                                        Accessories
                                    </a>
                                </li>
                            </ul>
                        </div>

                        {/* Information */}
                        <div>
                            <h4 className="font-medium mb-6 text-gray-400">Information</h4>
                            <ul className="space-y-4 text-white">
                                <li>
                                    <a href="#" className="hover:text-gray-300 transition-colors">
                                        Shipping Policy
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-gray-300 transition-colors">
                                        Refund Policy
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-gray-300 transition-colors">
                                        Privacy Policy
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-gray-300 transition-colors">
                                        FAQ
                                    </a>
                                </li>
                            </ul>
                        </div>

                        {/* Company */}
                        <div>
                            <h4 className="font-medium mb-6 text-gray-400">Company</h4>
                            <ul className="space-y-4 text-white">
                                <li>
                                    <a href="#" className="hover:text-gray-300 transition-colors">
                                        About us
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-gray-300 transition-colors">
                                        Blog
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-gray-300 transition-colors">
                                        Contact
                                    </a>
                                </li>
                            </ul>
                        </div>

                        {/* Newsletter */}
                        <div className=" col-span-2  ">
                            <h4 className="font-medium mb-6 text-white">Subscribe for our newsletter</h4>
                            <div className="flex lg:flex-row flex-col w-full gap-2 mb-4">
                                <input
                                    type="email"
                                    placeholder="Your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="flex-1 bg-gray-700 border border-gray-600 text-white placeholder-gray-400 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                                />
                                <button className="bg-white text-gray-800 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors whitespace-nowrap">
                                    Subscribe →
                                </button>
                            </div>
                            <div className="flex items-start gap-3 text-sm text-gray-400">
                                <input
                                    type="checkbox"
                                    id="privacy-policy"
                                    className="mt-0.5 rounded border-gray-600 bg-gray-700 text-white focus:ring-white focus:ring-2"
                                />
                                <label htmlFor="privacy-policy" className="leading-relaxed">
                                    I accept the terms of{" "}
                                    <a href="#" className="underline hover:text-white transition-colors">
                                        Privacy policy
                                    </a>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Footer - Outside the card */}
                <div className="flex justify-center w-full gap-4 text-center  text-gray-500">
                    <span>© 2025 San Francisco Minimal. Powered by Shopify</span>
                    <select className="bg-transparent border-none text-gray-500 focus:outline-none cursor-pointer">
                        <option>Canada (CAD $)</option>
                    </select>
                    <select className="bg-transparent border-none text-gray-500 focus:outline-none cursor-pointer">
                        <option>English</option>
                    </select>
                </div>

            </div>
        </footer>
    )
}
