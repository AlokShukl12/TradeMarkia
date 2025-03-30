import { motion } from 'framer-motion';
import { MagnifyingGlassIcon, ExclamationCircleIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

export type SearchStatus = 'idle' | 'searching' | 'success' | 'error';

interface StatusIndicatorProps {
  status: SearchStatus;
  error?: string;
  resultsCount?: number;
}

export default function StatusIndicator({ status, error, resultsCount }: StatusIndicatorProps) {
  const getStatusContent = () => {
    switch (status) {
      case 'searching':
        return {
          icon: <MagnifyingGlassIcon className="h-8 w-8 text-blue-500 animate-pulse" />,
          title: 'Searching...',
          message: 'Please wait while we find matching trademarks.',
          className: 'text-blue-600',
        };
      case 'error':
        return {
          icon: <ExclamationCircleIcon className="h-8 w-8 text-red-500" />,
          title: 'Error Occurred',
          message: error || 'An error occurred while searching. Please try again.',
          className: 'text-red-600',
        };
      case 'success':
        return {
          icon: <CheckCircleIcon className="h-8 w-8 text-green-500" />,
          title: 'Search Complete',
          message: resultsCount === 0
            ? 'No results found. Try adjusting your search criteria.'
            : `Found ${resultsCount} matching trademark${resultsCount === 1 ? '' : 's'}.`,
          className: 'text-green-600',
        };
      default:
        return {
          icon: <MagnifyingGlassIcon className="h-8 w-8 text-gray-400" />,
          title: 'Ready to Search',
          message: 'Enter your search query to begin.',
          className: 'text-gray-600',
        };
    }
  };

  const content = getStatusContent();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-lg shadow-sm p-6"
    >
      <div className="flex flex-col items-center text-center">
        {content.icon}
        <h3 className={`mt-4 text-lg font-semibold ${content.className}`}>
          {content.title}
        </h3>
        <p className="mt-2 text-gray-600 max-w-md">
          {content.message}
        </p>
      </div>
    </motion.div>
  );
}
