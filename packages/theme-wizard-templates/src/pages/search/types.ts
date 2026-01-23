export interface SearchResult {
  id: string;
  title: string;
  url: string;
  description: string;
  type: string;
  date?: string;
  dateTime?: string;
}

export interface SearchFilters {
  period?: string;
  ministry?: string;
  documentType?: string;
}

export interface SearchResultsData {
  query: string;
  totalResults: number;
  results: SearchResult[];
  sortBy: 'relevance' | 'date';
  filters: SearchFilters;
}
