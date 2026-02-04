import type { SearchFilters } from '../components/SearchFilters/types';
import type { SearchResult } from '../components/SearchResultItem/types';

export interface SearchResultsData {
  query: string;
  totalResults: number;
  results: SearchResult[];
  sortBy: 'relevance' | 'date';
  filters: SearchFilters;
}
