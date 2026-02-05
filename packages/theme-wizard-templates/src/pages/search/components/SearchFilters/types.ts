import type { SortOption } from "../../SearchResultsPage/types";

export interface SearchFilters {
  period?: string;
  organization?: string;
  documentType?: string;
}

export interface SearchFiltersProps {
  filters: SearchFilters;
  onFilterChange: (key: keyof SearchFilters, value: string) => void;
  onResetFilters: () => void;
  sortOptions: { label: string; value: string }[] | readonly { label: string; value: string }[];
  onSortChange: (sort: string) => void;
  // --- PROGRESSIVE ENHANCEMENT PROPS ---
  currentQuery?: string;
  currentSort?: string;
}
