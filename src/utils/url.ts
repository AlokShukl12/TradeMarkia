import type { FilterValues } from '../store/searchStore';

export function updateUrlWithSearch(query: string, filters: FilterValues) {
  const searchParams = new URLSearchParams();
  
  if (query) {
    searchParams.set('q', query);
  }
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value) {
      searchParams.set(key, value);
    }
  });
  
  const newUrl = `${window.location.pathname}${
    searchParams.toString() ? `?${searchParams.toString()}` : ''
  }`;
  
  window.history.pushState({}, '', newUrl);
}

export function getSearchParamsFromUrl(): { query: string; filters: FilterValues } {
  const searchParams = new URLSearchParams(window.location.search);
  const query = searchParams.get('q') || '';
  const filters: FilterValues = {};
  
  ['owner', 'lawFirm', 'attorney', 'status'].forEach((key) => {
    const value = searchParams.get(key);
    if (value) {
      filters[key as keyof FilterValues] = value;
    }
  });
  
  return { query, filters };
}
