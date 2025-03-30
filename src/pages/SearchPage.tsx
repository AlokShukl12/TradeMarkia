import { useState, useMemo } from 'react';
import { useSearchStore } from '../store/searchStore';
import Filters from '../components/Filters';
import Layout from '../components/Layout';
import { DocumentIcon, ExclamationCircleIcon, MagnifyingGlassIcon, ArrowUpIcon, ArrowDownIcon, FunnelIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import type { FilterValues, SearchResult } from '../store/searchStore';
import StatusIndicator from '../components/StatusIndicator';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Chart options
const chartOptions: ChartOptions<'bar' | 'line'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom' as const,
      labels: {
        padding: 20,
        usePointStyle: true,
        pointStyle: 'circle',
      },
    },
    tooltip: {
      mode: 'index',
      intersect: false,
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      titleColor: '#1f2937',
      bodyColor: '#4b5563',
      borderColor: '#e5e7eb',
      borderWidth: 1,
      padding: 12,
      boxPadding: 6,
      callbacks: {
        label: function (context) {
          const label = context.dataset.label || '';
          const value = context.parsed.y;
          return `${label}: ${value}`;
        }
      }
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        stepSize: 1,
        font: {
          size: 12,
        },
      },
      grid: {
        color: '#f3f4f6',
      },
    },
    x: {
      grid: {
        display: false,
      },
      ticks: {
        font: {
          size: 12,
        },
      },
    },
  },
};

export default function SearchPage() {
  const { query, results: searchResultsStore, status, filters: initialFilters } = useSearchStore();
  const [currentFilters, setCurrentFilters] = useState<FilterValues>({});
  const [sortBy, setSortBy] = useState('relevance');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [expandedResult, setExpandedResult] = useState<string | null>(null);
  const [showGraphs, setShowGraphs] = useState(true);
  const [graphError, setGraphError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [searchInput, setSearchInput] = useState('');

  // Calculate filing dates for timeline
  const filingDates = useMemo(() =>
    searchResultsStore
      .map((result: SearchResult) => new Date(result.filingDate))
      .sort((a: Date, b: Date) => a.getTime() - b.getTime()),
    [searchResultsStore]
  );

  // Apply filters to search results
  const searchResults = useMemo(() => {
    const results = searchResultsStore.length > 0 ? searchResultsStore : [{
      id: '1',
      name: query.toUpperCase(),
      owner: 'Sample Company',
      status: 'active',
      filingDate: '2025-01-01',
      serialNumber: '123456789',
      description: 'Sample trademark description',
      imageUrl: undefined,
    }] as SearchResult[];

    // Apply filters
    let filtered = results.filter((result: SearchResult) => {
      // Search input filter
      if (searchInput) {
        const searchLower = searchInput.toLowerCase();
        const matchesSearch =
          result.name.toLowerCase().includes(searchLower) ||
          result.owner.toLowerCase().includes(searchLower) ||
          result.lawFirm?.toLowerCase().includes(searchLower) ||
          result.attorney?.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      // Status filter
      if (currentFilters.status && result.status !== currentFilters.status) {
        return false;
      }

      // Owner filter
      if (currentFilters.owner && !result.owner.toLowerCase().includes(currentFilters.owner.toLowerCase())) {
        return false;
      }

      // Law Firm filter
      if (currentFilters.lawFirm && result.lawFirm && !result.lawFirm.toLowerCase().includes(currentFilters.lawFirm.toLowerCase())) {
        return false;
      }

      // Attorney filter
      if (currentFilters.attorney && result.attorney && !result.attorney.toLowerCase().includes(currentFilters.attorney.toLowerCase())) {
        return false;
      }

      return true;
    });

    // Apply sorting
    filtered.sort((a: SearchResult, b: SearchResult) => {
      const order = sortOrder === 'asc' ? 1 : -1;
      switch (sortBy) {
        case 'relevance':
          return order * (a.name.localeCompare(b.name));
        case 'filingDate':
          return order * (new Date(a.filingDate).getTime() - new Date(b.filingDate).getTime());
        case 'recent':
          return order * (new Date(b.filingDate).getTime() - new Date(a.filingDate).getTime());
        default:
          return 0;
      }
    });

    return filtered;
  }, [searchResultsStore, currentFilters, query, sortBy, sortOrder, searchInput]);

  // Prepare data for graphs
  const graphData = useMemo(() => {
    try {
      if (!searchResults || searchResults.length === 0) {
        return null;
      }

      // Status Distribution
      const statusCounts = searchResults.reduce((acc: Record<string, number>, result: SearchResult) => {
        const status = result.status.toLowerCase();
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, {});

      // Owner Distribution (Top 5)
      const ownerCounts = searchResults.reduce((acc: Record<string, number>, result: SearchResult) => {
        acc[result.owner] = (acc[result.owner] || 0) + 1;
        return acc;
      }, {});

      const topOwners = Object.entries(ownerCounts)
        .sort(([, a], [, b]) => (b as number) - (a as number))
        .slice(0, 5)
        .reduce((acc: Record<string, number>, [key, value]) => {
          acc[key] = value as number;
          return acc;
        }, {});

      // Filing Timeline
      const dateLabels = filingDates.map((date: Date) =>
        date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      );

      const dateCounts = filingDates.reduce((acc: Record<string, number>, date: Date) => {
        const label = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        acc[label] = (acc[label] || 0) + 1;
        return acc;
      }, {});

      setGraphError(null);
      return {
        status: {
          labels: Object.keys(statusCounts).map(status =>
            status.charAt(0).toUpperCase() + status.slice(1)
          ),
          datasets: [{
            label: 'Trademarks by Status',
            data: Object.values(statusCounts),
            backgroundColor: [
              'rgba(34, 197, 94, 0.7)',
              'rgba(234, 179, 8, 0.7)',
              'rgba(239, 68, 68, 0.7)',
            ],
            borderColor: [
              'rgb(34, 197, 94)',
              'rgb(234, 179, 8)',
              'rgb(239, 68, 68)',
            ],
            borderWidth: 2,
            borderRadius: 8,
            barThickness: 40,
          }],
        },
        owners: {
          labels: Object.keys(topOwners),
          datasets: [{
            label: 'Trademarks by Owner (Top 5)',
            data: Object.values(topOwners),
            backgroundColor: [
              'rgba(59, 130, 246, 0.7)',
              'rgba(99, 102, 241, 0.7)',
              'rgba(139, 92, 246, 0.7)',
              'rgba(168, 85, 247, 0.7)',
              'rgba(217, 70, 239, 0.7)',
            ],
            borderColor: [
              'rgb(59, 130, 246)',
              'rgb(99, 102, 241)',
              'rgb(139, 92, 246)',
              'rgb(168, 85, 247)',
              'rgb(217, 70, 239)',
            ],
            borderWidth: 2,
            borderRadius: 8,
            barThickness: 40,
          }],
        },
        timeline: {
          labels: dateLabels,
          datasets: [{
            label: 'Trademarks Filed Over Time',
            data: dateLabels.map((label: string) => dateCounts[label] || 0),
            borderColor: 'rgb(59, 130, 246)',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            borderWidth: 2,
            tension: 0.4,
            fill: true,
            pointBackgroundColor: 'rgb(59, 130, 246)',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6,
          }],
        },
      };
    } catch (error) {
      setGraphError('Error preparing graph data');
      console.error('Graph data error:', error);
      return null;
    }
  }, [searchResults, filingDates]);

  const toggleSort = (newSortBy: string) => {
    if (sortBy === newSortBy) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortOrder('desc');
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Main Content */}
        <div className="max-w-[1200px] mx-auto px-4 py-8">
          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search trademarks by name, owner, law firm, or attorney..."
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                      className="w-full px-4 py-3 pl-12 text-gray-900 bg-white rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <MagnifyingGlassIcon className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowFilters(!showFilters)}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center gap-2"
                >
                  <FunnelIcon className="h-5 w-5" />
                  {showFilters ? 'Hide Filters' : 'Show Filters'}
                </motion.button>
              </div>
            </div>
          </motion.div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, x: -20, width: 0 }}
                  animate={{ opacity: 1, x: 0, width: 'auto' }}
                  exit={{ opacity: 0, x: -20, width: 0 }}
                  className="w-full lg:w-72 flex-shrink-0"
                >
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-6">Refine by</h2>
                    <div className="space-y-6">
                      {/* Status Filter */}
                      <div>
                        <h3 className="text-sm font-medium text-gray-700 mb-2">Status</h3>
                        <div className="space-y-2">
                          {(['active', 'pending', 'abandoned'] as const).map((status) => (
                            <label key={status} className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                checked={currentFilters.status === status}
                                onChange={() => setCurrentFilters(prev => ({
                                  ...prev,
                                  status: prev.status === status ? undefined : status
                                }))}
                                className="rounded text-blue-600 focus:ring-blue-500"
                              />
                              <span className={`text-sm ${status === 'active' ? 'text-green-600' :
                                status === 'pending' ? 'text-yellow-600' :
                                  'text-red-600'
                                }`}>
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Owner Filter */}
                      <div>
                        <h3 className="text-sm font-medium text-gray-700 mb-2">Owner</h3>
                        <input
                          type="text"
                          placeholder="Filter by owner..."
                          value={currentFilters.owner || ''}
                          onChange={(e) => setCurrentFilters(prev => ({
                            ...prev,
                            owner: e.target.value
                          }))}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      {/* Law Firm Filter */}
                      <div>
                        <h3 className="text-sm font-medium text-gray-700 mb-2">Law Firm</h3>
                        <input
                          type="text"
                          placeholder="Filter by law firm..."
                          value={currentFilters.lawFirm || ''}
                          onChange={(e) => setCurrentFilters(prev => ({
                            ...prev,
                            lawFirm: e.target.value
                          }))}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      {/* Attorney Filter */}
                      <div>
                        <h3 className="text-sm font-medium text-gray-700 mb-2">Attorney</h3>
                        <input
                          type="text"
                          placeholder="Filter by attorney..."
                          value={currentFilters.attorney || ''}
                          onChange={(e) => setCurrentFilters(prev => ({
                            ...prev,
                            attorney: e.target.value
                          }))}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Results */}
            <div className="flex-1">
              {/* Results Header */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg shadow-sm p-6 mb-6"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">Search Results</h1>
                    {status === 'success' && (
                      <p className="text-sm text-gray-600 mt-2">
                        Showing results for "{query}"
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowGraphs(!showGraphs)}
                      className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-200
                        ${showGraphs ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100 text-gray-700'}`}
                    >
                      {showGraphs ? 'Hide Graphs' : 'Show Graphs'}
                    </motion.button>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-gray-700">Sort by:</span>
                      <div className="flex gap-2">
                        {['relevance', 'filingDate', 'recent'].map((option) => (
                          <button
                            key={option}
                            onClick={() => toggleSort(option)}
                            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-200 flex items-center gap-1
                              ${sortBy === option
                                ? 'bg-blue-100 text-blue-700'
                                : 'hover:bg-gray-100 text-gray-700'}`}
                          >
                            {option.charAt(0).toUpperCase() + option.slice(1)}
                            {sortBy === option && (
                              sortOrder === 'asc' ? <ArrowUpIcon className="w-4 h-4" /> : <ArrowDownIcon className="w-4 h-4" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Graphs */}
              <AnimatePresence>
                {showGraphs && status === 'success' && searchResults.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6"
                  >
                    {graphError ? (
                      <div className="col-span-2 bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center text-red-700">
                          <ExclamationCircleIcon className="h-5 w-5 mr-2" />
                          <p>{graphError}</p>
                        </div>
                      </div>
                    ) : graphData ? (
                      <>
                        <div className="bg-white rounded-lg shadow-sm p-6">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">Status Distribution</h3>
                            <span className="text-sm text-gray-500">
                              Total: {searchResults.length} trademarks
                            </span>
                          </div>
                          <div style={{ height: '300px' }}>
                            <Bar
                              data={graphData.status}
                              options={chartOptions}
                            />
                          </div>
                        </div>
                        <div className="bg-white rounded-lg shadow-sm p-6">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">Top Trademark Owners</h3>
                            <span className="text-sm text-gray-500">
                              Top 5 owners
                            </span>
                          </div>
                          <div style={{ height: '300px' }}>
                            <Bar
                              data={graphData.owners}
                              options={{
                                ...chartOptions,
                                indexAxis: 'y' as const,
                              }}
                            />
                          </div>
                        </div>
                        <div className="col-span-2 bg-white rounded-lg shadow-sm p-6">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">Filing Timeline</h3>
                            <span className="text-sm text-gray-500">
                              {filingDates.length > 0 && `${new Date(filingDates[0]).toLocaleDateString()} - ${new Date(filingDates[filingDates.length - 1]).toLocaleDateString()}`}
                            </span>
                          </div>
                          <div style={{ height: '300px' }}>
                            <Line
                              data={graphData.timeline}
                              options={chartOptions}
                            />
                          </div>
                        </div>
                      </>
                    ) : null}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Status Messages */}
              <AnimatePresence>
                {(status === 'searching' || status === 'error' || (status === 'success' && searchResults.length === 0)) && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="mb-6"
                  >
                    <StatusIndicator
                      status={status}
                      error={status === 'error' ? 'An error occurred while searching. Please try again.' : undefined}
                      resultsCount={searchResults.length}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Results Grid */}
              {status === 'success' && searchResults.length > 0 && (
                <div className="space-y-6">
                  {searchResults.map((result: SearchResult, index: number) => (
                    <motion.div
                      key={result.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
                    >
                      <div className="p-6">
                        <div className="flex items-start gap-8">
                          {/* Trademark Image/Icon */}
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="w-48 h-48 bg-gray-50 rounded-lg border border-gray-200 p-6 flex items-center justify-center"
                          >
                            {result.imageUrl ? (
                              <img
                                src={result.imageUrl}
                                alt={result.name}
                                className="max-w-full max-h-full object-contain"
                              />
                            ) : (
                              <DocumentIcon className="w-20 h-20 text-gray-300" />
                            )}
                          </motion.div>

                          {/* Trademark Details */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div>
                                <motion.h3
                                  whileHover={{ scale: 1.02 }}
                                  className="text-2xl font-semibold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
                                >
                                  {result.name}
                                </motion.h3>
                                <p className="mt-2 text-sm text-gray-700">
                                  by <span className="text-blue-600 hover:text-blue-700 hover:underline cursor-pointer">{result.owner}</span>
                                </p>
                              </div>
                              <motion.span
                                whileHover={{ scale: 1.05 }}
                                className={`px-4 py-1.5 rounded-full text-sm font-medium
                                  ${result.status === 'active' ? 'bg-green-50 text-green-700' :
                                    result.status === 'pending' ? 'bg-yellow-50 text-yellow-700' :
                                      result.status === 'abandoned' ? 'bg-red-50 text-red-700' :
                                        'bg-gray-50 text-gray-700'}`}
                              >
                                {result.status}
                              </motion.span>
                            </div>

                            <AnimatePresence>
                              {expandedResult === result.id && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: 'auto' }}
                                  exit={{ opacity: 0, height: 0 }}
                                  className="mt-6"
                                >
                                  <p className="text-base text-gray-600">
                                    {result.description}
                                  </p>
                                  <div className="mt-6 flex flex-wrap gap-8 text-sm">
                                    <div>
                                      <span className="text-gray-600">Serial Number:</span>
                                      <span className="ml-2 font-medium text-gray-900">{result.serialNumber}</span>
                                    </div>
                                    <div>
                                      <span className="text-gray-600">Filing Date:</span>
                                      <span className="ml-2 font-medium text-gray-900">{new Date(result.filingDate).toLocaleDateString()}</span>
                                    </div>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>

                            <div className="mt-6 flex items-center gap-4">
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium shadow-sm transition-colors duration-200"
                              >
                                Monitor Trademark
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setExpandedResult(expandedResult === result.id ? null : result.id)}
                                className="px-6 py-2.5 border border-gray-300 hover:bg-gray-50 rounded-lg text-sm font-medium transition-colors duration-200"
                              >
                                {expandedResult === result.id ? 'Show Less' : 'View Details'}
                              </motion.button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
