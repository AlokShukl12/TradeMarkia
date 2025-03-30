import { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import type { FilterValues } from '../store/searchStore';

const filterGroups = {
  status: {
    title: 'Status',
    options: [
      { value: 'active', label: 'Active', count: 1205 },
      { value: 'pending', label: 'Pending', count: 432 },
      { value: 'abandoned', label: 'Abandoned', count: 89 },
    ],
  },
  filingDate: {
    title: 'Filing Date',
    options: [
      { value: 'last30', label: 'Last 30 days', count: 324 },
      { value: 'last90', label: 'Last 90 days', count: 892 },
      { value: 'lastYear', label: 'Last year', count: 2453 },
      { value: 'older', label: 'Older', count: 5234 },
    ],
  },
  category: {
    title: 'Category',
    options: [
      { value: 'clothing', label: 'Clothing & Accessories', count: 892 },
      { value: 'technology', label: 'Technology', count: 756 },
      { value: 'food', label: 'Food & Beverage', count: 543 },
      { value: 'health', label: 'Health & Beauty', count: 432 },
      { value: 'automotive', label: 'Automotive', count: 234 },
    ],
  },
  region: {
    title: 'Region',
    options: [
      { value: 'us', label: 'United States', count: 3421 },
      { value: 'eu', label: 'European Union', count: 1234 },
      { value: 'asia', label: 'Asia', count: 892 },
      { value: 'other', label: 'Other Regions', count: 432 },
    ],
  },
};

interface FiltersProps {
  initialFilters: FilterValues;
  onFilterChange: (filters: FilterValues) => void;
}

export default function Filters({ initialFilters, onFilterChange }: FiltersProps) {
  const [filters, setFilters] = useState<FilterValues>(initialFilters);
  const [expandedGroups, setExpandedGroups] = useState<string[]>(Object.keys(filterGroups));

  const handleFilterChange = (group: string, value: string) => {
    const newFilters = {
      ...filters,
      [group]: value,
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    setFilters({});
    onFilterChange({});
  };

  const toggleGroup = (group: string) => {
    setExpandedGroups(prev =>
      prev.includes(group)
        ? prev.filter(g => g !== group)
        : [...prev, group]
    );
  };

  const activeFilterCount = Object.keys(filters).length;

  return (
    <div className="text-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-lg">Filters</h2>
        {activeFilterCount > 0 && (
          <button
            onClick={clearFilters}
            className="text-[#0066c0] hover:text-[#c45500] hover:underline text-sm"
          >
            Clear all filters
          </button>
        )}
      </div>

      {activeFilterCount > 0 && (
        <div className="mb-4 p-3 bg-[#f0f2f2] rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Active Filters</span>
            <span className="bg-[#232f3e] text-white px-2 py-0.5 rounded-full text-xs">
              {activeFilterCount}
            </span>
          </div>
          <div className="space-y-2">
            {Object.entries(filters).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between bg-white px-2 py-1 rounded">
                <span className="text-xs">
                  {filterGroups[key as keyof typeof filterGroups].title}: {value}
                </span>
                <button
                  onClick={() => handleFilterChange(key, '')}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-4">
        {Object.entries(filterGroups).map(([key, group]) => (
          <div key={key} className="border-b border-gray-200 pb-4 last:border-0">
            <button
              onClick={() => toggleGroup(key)}
              className="flex items-center justify-between w-full text-left mb-2"
            >
              <span className="font-medium">{group.title}</span>
              <svg
                className={`h-4 w-4 transform transition-transform ${
                  expandedGroups.includes(key) ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {expandedGroups.includes(key) && (
              <div className="space-y-2 mt-2">
                {group.options.map((option) => (
                  <label
                    key={option.value}
                    className="flex items-center justify-between group cursor-pointer hover:bg-gray-50 px-2 py-1 rounded"
                  >
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name={key}
                        value={option.value}
                        checked={filters[key as keyof FilterValues] === option.value}
                        onChange={() => handleFilterChange(key, option.value)}
                        className="h-4 w-4 text-[#f90] focus:ring-[#f90] border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-700 group-hover:text-[#c45500]">
                        {option.label}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">
                      ({option.count.toLocaleString()})
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
