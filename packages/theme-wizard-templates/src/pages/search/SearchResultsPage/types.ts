import type { SearchFilters } from '../components/SearchFilters/types';
import type { SearchResult } from '../components/SearchResultItem/types';

export interface SearchResultsData {
  query: string;
  totalResults: number;
  results: SearchResult[];
  sortBy: 'relevance' | 'date';
  filters: SearchFilters;
}

export interface SearchResultsProps {
  currentPath?: string;
  initialData?: SearchResultsData;
  initialQuery?: string;
  initialFilters?: SearchResultsData['filters'];
  initialSort?: SortOption;
  onSearch?: (query: string, filters: SearchResultsData['filters'], sortBy: SortOption) => void;
}

export type SortOption = 'relevance' | 'date';