import { useState } from "react"
import { useTranslation } from "react-i18next";
import { useSettings, supportedCurrencies, supportedLanguages } from "../../../context/SettingsContext";
import { FaGithub, FaLinkedin, FaReact, FaNodeJs } from "react-icons/fa"

export default function Footer() {
    const [email, setEmail] = useState("");
    const { t } = useTranslation();
    const { language, changeLanguage, currency, changeCurrency } = useSettings();
    const currentYear = new Date().getFullYear();

    return (
        <footer className="px-4 md:px-6 py-12">
            <div className="max-w-6xl mx-auto">
                <div className="bg-gray-800 text-white rounded-3xl px-8 md:px-12 py-16 mb-8">
                    <div className="text-center mb-12">
                        <div className="w-20 h-20 mx-auto mb-6 relative">
                            <div className="absolute inset-0 border-4 border-white rounded-full animate-pulse"></div>
                            <div className="absolute inset-2 border-4 border-white rounded-full"></div>
                            <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center font-bold text-gray-800 text-sm">
                                ESI SBA
                            </div>
                        </div>
                        <p className="text-gray-300 max-w-md mx-auto leading-relaxed">
                            {t('footer_description')}
                        </p>
                    </div>
                    <div className="flex justify-center gap-6 mb-16">
                        <a href="#" target="_blank" rel="noopener noreferrer" aria-label="GitHub"><FaGithub className="w-6 h-6 text-gray-300 hover:text-white cursor-pointer transition-colors" /></a>
                        <a href="#" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><FaLinkedin className="w-6 h-6 text-gray-300 hover:text-white cursor-pointer transition-colors" /></a>
                        <a href="#" target="_blank" rel="noopener noreferrer" aria-label="React Docs"><FaReact className="w-6 h-6 text-gray-300 hover:text-white cursor-pointer transition-colors" /></a>
                        <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Node.js Docs"><FaNodeJs className="w-6 h-6 text-gray-300 hover:text-white cursor-pointer transition-colors" /></a>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-12">
                        <div>
                            <h4 className="font-medium mb-6 text-gray-400">{t('footer_tech_stack')}</h4>
                            <ul className="space-y-4 text-white">
                                <li><a href="#" className="hover:text-gray-300 transition-colors">React & Vite</a></li>
                                <li><a href="#" className="hover:text-gray-300 transition-colors">Node.js & Express</a></li>
                                <li><a href="#" className="hover:text-gray-300 transition-colors">Docker & Kafka</a></li>
                                <li><a href="#" className="hover:text-gray-300 transition-colors">Prisma & PostgreSQL</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-medium mb-6 text-gray-400">{t('footer_information')}</h4>
                            <ul className="space-y-4 text-white">
                                <li><a href="#" className="hover:text-gray-300 transition-colors">Shipping Policy</a></li>
                                <li><a href="#" className="hover:text-gray-300 transition-colors">Refund Policy</a></li>
                                <li><a href="#" className="hover:text-gray-300 transition-colors">Privacy Policy</a></li>
                                <li><a href="#" className="hover:text-gray-300 transition-colors">FAQ</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-medium mb-6 text-gray-400">{t('footer_project')}</h4>
                            <ul className="space-y-4 text-white">
                                <li><a href="#" className="hover:text-gray-300 transition-colors">About</a></li>
                                <li><a href="#" className="hover:text-gray-300 transition-colors">Source Code</a></li>
                                <li><a href="#" className="hover:text-gray-300 transition-colors">Contact</a></li>
                            </ul>
                        </div>
                        <div className="col-span-2">
                            <h4 className="font-medium mb-6 text-white">{t('footer_subscribe_newsletter')}</h4>
                            <div className="flex lg:flex-row flex-col w-full gap-2 mb-4">
                                <input type="email" placeholder="Your email" value={email} onChange={(e) => setEmail(e.target.value)} className="flex-1 bg-gray-700 border border-gray-600 text-white placeholder-gray-400 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent" />
                                <button className="bg-white text-gray-800 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors whitespace-nowrap">{t('footer_subscribe_button')} →</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row justify-between w-full gap-4 text-center items-center text-sm text-gray-500">
                    <span>{t('footer_copyright').replace('2024', currentYear)}</span>
                    <div className="flex gap-4">
                        <select value={currency} onChange={(e) => changeCurrency(e.target.value)} className="bg-transparent border-none text-gray-500 focus:outline-none cursor-pointer">
                            {supportedCurrencies.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
                        </select>
                        <select value={language} onChange={(e) => changeLanguage(e.target.value)} className="bg-transparent border-none text-gray-500 focus:outline-none cursor-pointer">
                            {supportedLanguages.map(l => <option key={l.code} value={l.code}>{l.name}</option>)}
                        </select>
                    </div>
                </div>
            </div>
        </footer>
    )
}