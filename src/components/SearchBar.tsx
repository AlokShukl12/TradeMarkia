import { useState, useRef, useEffect } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import { useSearchStore } from '../store/searchStore';

const categories = [
  'All Categories',
  'Company Names',
  'Brand Names',
  'Logos',
  'Slogans',
  'Product Names',
  'Services',
];

const popularSearches = [
  'Nike',
  'Apple',
  'Samsung',
  'Microsoft',
  'Google',
  'Amazon',
  'Tesla',
];

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All Categories');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchStore = useSearchStore();
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = () => {
    if (query.trim()) {
      searchStore.setStatus('searching');
      // Simulate API call
      setTimeout(() => {
        searchStore.setQuery(query);
        setShowSuggestions(false);
      }, 500);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="relative w-full max-w-[800px]">
      <div className="flex">
        <div className="relative">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="h-10 pl-3 pr-8 bg-[#f3f3f3] hover:bg-[#e0e0e0] border-r border-gray-300 rounded-l-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#f90] appearance-none cursor-pointer"
            style={{ width: '140px' }}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <svg className="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        <div className="relative flex-1">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowSuggestions(true);
            }}
            onKeyPress={handleKeyPress}
            placeholder="Search for trademarks, brand names, or logos..."
            className="w-full h-10 pl-3 pr-10 border-0 focus:ring-2 focus:ring-[#f90] text-sm"
          />

          {query && (
            <button
              onClick={() => {
                setQuery('');
                inputRef.current?.focus();
              }}
              className="absolute right-12 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        <button
          onClick={handleSearch}
          className="h-10 px-6 bg-[#febd69] hover:bg-[#f3a847] rounded-r-lg flex items-center justify-center transition-colors duration-150"
        >
          <MagnifyingGlassIcon className="h-5 w-5 text-[#131921]" />
        </button>
      </div>

      {/* Search Suggestions Panel */}
      {showSuggestions && (
        <div
          ref={suggestionsRef}
          className="absolute z-50 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden"
        >
          {query && (
            <div className="p-3 border-b border-gray-200">
              <div className="flex items-center text-[#131921]">
                <MagnifyingGlassIcon className="h-4 w-4 mr-2" />
                <span className="text-sm">
                  Search for "<strong>{query}</strong>"
                </span>
              </div>
            </div>
          )}

          <div className="p-3">
            <div className="mb-4">
              <h3 className="text-xs font-semibold text-gray-500 mb-2">POPULAR SEARCHES</h3>
              <div className="space-y-2">
                {popularSearches.map((search) => (
                  <button
                    key={search}
                    onClick={() => {
                      setQuery(search);
                      handleSearch();
                    }}
                    className="block w-full text-left px-2 py-1 text-sm text-[#131921] hover:bg-gray-100 rounded"
                  >
                    <div className="flex items-center">
                      <MagnifyingGlassIcon className="h-4 w-4 mr-2 text-gray-400" />
                      {search}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
