import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { SearchStatus } from '../components/StatusIndicator';

export interface SearchResult {
  id: string;
  name: string;
  owner: string;
  status: 'active' | 'pending' | 'abandoned';
  filingDate: string;
  serialNumber: string;
  description: string;
  imageUrl?: string;
  lawFirm?: string;
  attorney?: string;
}

export interface FilterValues {
  owner?: string;
  lawFirm?: string;
  attorney?: string;
  status?: 'active' | 'pending' | 'abandoned';
}

interface SearchState {
  query: string;
  filters: FilterValues;
  results: SearchResult[];
  status: SearchStatus;
  totalResults: number;
  error?: string;
  setQuery: (query: string) => void;
  setFilters: (filters: FilterValues) => void;
  setResults: (results: SearchResult[], total: number) => void;
  setStatus: (status: SearchStatus, error?: string) => void;
  reset: () => void;
}

const initialState = {
  query: '',
  filters: {} as FilterValues,
  results: [] as SearchResult[],
  status: 'idle' as SearchStatus,
  totalResults: 0,
};

export const useSearchStore = create<SearchState>()(
  persist(
    (set) => ({
      ...initialState,
      setQuery: (query: string) => set({ query }),
      setFilters: (filters: FilterValues) => set({ filters }),
      setResults: (results: SearchResult[], totalResults: number) => set({ results, totalResults }),
      setStatus: (status: SearchStatus, error?: string) => set({ status, error }),
      reset: () => set(initialState),
    }),
    {
      name: 'trademark-search',
      partialize: (state: SearchState) => ({
        query: state.query,
        filters: state.filters,
        results: state.results,
        totalResults: state.totalResults,
      }),
    }
  )
);
