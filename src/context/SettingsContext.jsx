//src/context/SettingsContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';

const SettingsContext = createContext();

export const supportedCurrencies = [
    { code: 'USD', name: 'USD' },
    { code: 'EUR', name: 'EUR' },
    { code: 'DZD', name: 'DZD' },
];

export const supportedLanguages = [
    { code: 'en', name: 'English' },
    { code: 'fr', name: 'Français' },
    { code: 'ar', name: 'العربية' },
];

export const SettingsProvider = ({ children }) => {
    const { i18n } = useTranslation();

    const [currency, setCurrency] = useState(
        () => localStorage.getItem('currency') || 'USD'
    );

    useEffect(() => {
        const storedLang = localStorage.getItem('i18nextLng') || 'en';
        if (i18n.language !== storedLang) {
            i18n.changeLanguage(storedLang);
        }
    }, [i18n]);

    const changeLanguage = (lng) => {
        // i18n.changeLanguage returns a promise that resolves after
        // the language is changed and persisted to localStorage.
        // We reload only after this is complete.
        i18n.changeLanguage(lng).then(() => {
            window.location.reload();
        });
    };

    const changeCurrency = (currencyCode) => {
        localStorage.setItem('currency', currencyCode);
        setCurrency(currencyCode);
        window.location.reload(); 
    };

    const value = {
        language: i18n.language,
        changeLanguage,
        currency,
        changeCurrency,
    };

    return (
        <SettingsContext.Provider value={value}>
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = () => {
    return useContext(SettingsContext);
};