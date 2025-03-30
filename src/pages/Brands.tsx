import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { brands, categories } from '../data/brands';
import { Brand, BrandCategory, FilterOptions } from '../types/brand';

const Brands = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    owner: [],
    lawFirm: [],
    attorney: [],
    status: [],
    category: [],
  });

  // Get unique values for filters
  const filterOptions = useMemo(() => ({
    owners: [...new Set(brands.map(brand => brand.owner))],
    lawFirms: [...new Set(brands.map(brand => brand.lawFirm))],
    attorneys: [...new Set(brands.map(brand => brand.attorney))],
    statuses: ['Active', 'Pending', 'Expired'] as const,
    categories: categories.map(cat => cat.name),
  }), []);

  const filteredBrands = brands.filter((brand) => {
    const matchesCategory = !selectedCategory || brand.category === selectedCategory;
    const matchesSearch = brand.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      brand.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      brand.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
      brand.lawFirm.toLowerCase().includes(searchQuery.toLowerCase()) ||
      brand.attorney.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilters =
      (filters.owner.length === 0 || filters.owner.includes(brand.owner)) &&
      (filters.lawFirm.length === 0 || filters.lawFirm.includes(brand.lawFirm)) &&
      (filters.attorney.length === 0 || filters.attorney.includes(brand.attorney)) &&
      (filters.status.length === 0 || filters.status.includes(brand.status));

    return matchesCategory && matchesSearch && matchesFilters;
  });

  const toggleFilter = (type: keyof FilterOptions, value: string) => {
    setFilters(prev => ({
      ...prev,
      [type]: prev[type].includes(value)
        ? prev[type].filter(v => v !== value)
        : [...prev[type], value],
    }));
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Search Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1 w-full">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search trademarks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 pl-10 pr-4 text-gray-900 bg-white rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <svg
                  className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowFilters(!showFilters)}
                className="px-4 py-2 rounded-lg bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
              >
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white rounded-lg shadow-lg p-4"
                >
                  <h2 className="text-lg font-semibold mb-4">Filters</h2>
                  <div className="space-y-6">
                    {/* Status Filter */}
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Status</h3>
                      <div className="space-y-2">
                        {filterOptions.statuses.map((status) => (
                          <label key={status} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={filters.status.includes(status)}
                              onChange={() => toggleFilter('status', status)}
                              className="rounded text-blue-600 focus:ring-blue-500"
                            />
                            <span className={`text-sm ${status === 'Active' ? 'text-green-600' :
                                status === 'Pending' ? 'text-yellow-600' :
                                  'text-red-600'
                              }`}>
                              {status}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Owner Filter */}
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Owner</h3>
                      <div className="space-y-2">
                        {filterOptions.owners.map((owner) => (
                          <label key={owner} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={filters.owner.includes(owner)}
                              onChange={() => toggleFilter('owner', owner)}
                              className="rounded text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-600">{owner}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Law Firm Filter */}
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Law Firm</h3>
                      <div className="space-y-2">
                        {filterOptions.lawFirms.map((firm) => (
                          <label key={firm} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={filters.lawFirm.includes(firm)}
                              onChange={() => toggleFilter('lawFirm', firm)}
                              className="rounded text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-600">{firm}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Attorney Filter */}
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Attorney</h3>
                      <div className="space-y-2">
                        {filterOptions.attorneys.map((attorney) => (
                          <label key={attorney} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={filters.attorney.includes(attorney)}
                              onChange={() => toggleFilter('attorney', attorney)}
                              className="rounded text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-600">{attorney}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Results */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold">
                    {filteredBrands.length} Results Found
                  </h2>
                  <div className="flex gap-2">
                    {categories.map((category) => (
                      <motion.button
                        key={category.id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedCategory(selectedCategory === category.name ? null : category.name)}
                        className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${selectedCategory === category.name
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                      >
                        {category.icon} {category.name}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="divide-y divide-gray-200">
                {filteredBrands.map((brand, index) => (
                  <motion.div
                    key={brand.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="p-4 hover:bg-gray-50"
                  >
                    <div className="flex items-start gap-4">
                      <motion.img
                        whileHover={{ scale: 1.1 }}
                        src={brand.logo}
                        alt={brand.name}
                        className="h-12 w-12 object-contain"
                      />
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{brand.name}</h3>
                            <p className="text-sm text-gray-500">{brand.category}</p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${brand.status === 'Active' ? 'bg-green-100 text-green-800' :
                              brand.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                            }`}>
                            {brand.status}
                          </span>
                        </div>
                        <p className="mt-2 text-sm text-gray-600">{brand.description}</p>
                        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Owner:</span>
                            <span className="ml-2 font-medium">{brand.owner}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Law Firm:</span>
                            <span className="ml-2 font-medium">{brand.lawFirm}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Attorney:</span>
                            <span className="ml-2 font-medium">{brand.attorney}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Trademark #:</span>
                            <span className="ml-2 font-medium">{brand.trademarkNumber}</span>
                          </div>
                        </div>
                        <div className="mt-4">
                          <span className="text-sm text-gray-500">Goods & Services:</span>
                          <div className="mt-1 flex flex-wrap gap-2">
                            {brand.goodsAndServices.map((item, i) => (
                              <span
                                key={i}
                                className="px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-700"
                              >
                                {item}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Brands; 