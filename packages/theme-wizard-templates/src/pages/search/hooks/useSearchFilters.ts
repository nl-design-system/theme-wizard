import { useState, useCallback } from 'react';
import type { SearchFilters } from '../components/SearchFilters/types';

const DEFAULT_FILTERS: SearchFilters = {
  period: 'all',
  documentType: 'all',
  organization: 'all',
};

export const useSearchFilters = (initialFilters: SearchFilters = {}) => {
  // Filter out undefined values to ensure DEFAULT_FILTERS are used when keys are missing in URL
  const cleanInitialFilters = Object.fromEntries(
    Object.entries(initialFilters).filter(([_, value]) => value !== undefined && value !== null)
  );
  
  const [filters, setFilters] = useState<SearchFilters>({ ...DEFAULT_FILTERS, ...cleanInitialFilters });

  const updateFilter = useCallback((key: keyof SearchFilters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  return {
    filters,
    resetFilters,
    updateFilter,
  };
};
