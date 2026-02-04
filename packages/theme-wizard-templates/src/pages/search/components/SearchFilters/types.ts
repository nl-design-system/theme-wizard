import type { ReactNode } from 'react';

export interface SearchFilters {
  period?: string;
  organization?: string;
  documentType?: string;
}

export interface SearchFiltersProps {
  filters: SearchFilters;
  onFilterChange: (key: keyof SearchFilters, value: string) => void;
  // --- PROGRESSIVE ENHANCEMENT PROPS ---
  currentQuery?: string;
  currentSort?: string;
}
