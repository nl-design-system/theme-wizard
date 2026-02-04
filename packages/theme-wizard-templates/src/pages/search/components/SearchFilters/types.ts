export interface SearchFilters {
  period?: string;
  organization?: string;
  documentType?: string;
}

export interface SearchFiltersProps {
  filters: SearchFilters;
  onFilterChange: (key: keyof SearchFilters, value: string) => void;
  onResetFilters: () => void;
  // --- PROGRESSIVE ENHANCEMENT PROPS ---
  currentQuery?: string;
  currentSort?: string;
}
