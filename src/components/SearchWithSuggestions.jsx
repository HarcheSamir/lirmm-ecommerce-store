// src/components/SearchWithSuggestions.jsx
import { useState, useCallback, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import debounce from 'lodash.debounce';
import { useSearchStore } from '../store/searchStore';
import { FiSearch, FiLoader } from 'react-icons/fi';

export default function SearchWithSuggestions() {
    const navigate = useNavigate();
    const {
        suggestions,
        isSuggestionsLoading,
        fetchSuggestions,
        clearSuggestions,
        setFilter,
    } = useSearchStore();

    const [inputValue, setInputValue] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const suggestionContainerRef = useRef(null);

    const debouncedFetch = useCallback(debounce((query) => {
        fetchSuggestions(query);
    }, 300), [fetchSuggestions]);

    useEffect(() => {
        return () => {
            debouncedFetch.cancel();
        };
    }, [debouncedFetch]);

    const handleChange = (e) => {
        const query = e.target.value;
        setInputValue(query);
        if (query.length > 1) {
            debouncedFetch(query);
        } else {
            clearSuggestions();
        }
    };

    const handleSuggestionClick = (e) => {
        // Don't prevent default - let the Link handle navigation
        setInputValue('');
        clearSuggestions();
        setIsFocused(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (inputValue.trim()) {
            setFilter('q', inputValue.trim());
            navigate('/shop');
            clearSuggestions();
            setInputValue('');
            setIsFocused(false);
        }
    };

    // Handle blur with proper event handling
    const handleBlur = (e) => {
        // Check if the new focus target is within the suggestions container
        if (suggestionContainerRef.current && 
            suggestionContainerRef.current.contains(e.relatedTarget)) {
            return; // Don't close if clicking on a suggestion
        }
        // Delay closing to allow click events to fire
        setTimeout(() => setIsFocused(false), 150);
    };

    const showSuggestions = isFocused && (suggestions.length > 0 || isSuggestionsLoading);

    return (
        <div className="relative flex-1">
            <form onSubmit={handleSubmit} className="flex">
                <input
                    type="text"
                    placeholder="Search for anything"
                    className="flex-1 px-4 py-2 border border-r-0 border-gray-300 rounded-l-md outline-none text-sm focus:ring-2 focus:ring-primary/50"
                    value={inputValue}
                    onChange={handleChange}
                    onFocus={() => setIsFocused(true)}
                    onBlur={handleBlur}
                />
                <button
                    type="submit"
                    className="bg-gray-900 cursor-pointer px-4 py-2 rounded-r-md flex items-center justify-center hover:bg-primary"
                    aria-label="Search"
                >
                    <FiSearch size={20} className="text-white" />
                </button>
            </form>

            {showSuggestions && (
                <div 
                    ref={suggestionContainerRef}
                    className="absolute top-full mt-2 w-full bg-white rounded-md shadow-lg border border-gray-200/80 z-50 overflow-hidden"
                >
                    {isSuggestionsLoading ? (
                        <div className="p-4 flex items-center justify-center text-gray-500">
                            <FiLoader className="animate-spin mr-2" />
                            <span>Searching...</span>
                        </div>
                    ) : (
                        <ul className="max-h-80 overflow-y-auto">
                            {suggestions.map(product => (
                                <li key={product.id}>
                                    <Link
                                        to={`/products/${product.id}`}
                                        onClick={handleSuggestionClick}
                                        className="flex items-center gap-4 p-3 hover:bg-gray-100 transition-colors block"
                                    >
                                        <img
                                            src={product.images?.[0]?.imageUrl || 'https://placehold.co/100x100/e2e8f0/cccccc'}
                                            alt={product.name}
                                            className="w-12 h-12 object-cover rounded-md flex-shrink-0"
                                        />
                                        <span className="text-sm font-medium text-gray-800 line-clamp-2">{product.name}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
}