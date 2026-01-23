import { PageContent } from '@utrecht/component-library-react/dist/css-module';
import React, { type FC, useState, useCallback } from 'react';
import type { SortOption } from './components/SearchResultsHeader';
import type { SearchResultsData } from './types';
import Navigation from '../../sections/Navigation';
import PageFooterSection from '../../sections/PageFooter';
import PageHeaderSection from '../../sections/PageHeader';
import { SearchFiltersComponent } from './components/SearchFilters';
import { SearchForm } from './components/SearchForm';
import { SearchResultsHeader } from './components/SearchResultsHeader';
import { SearchResultsList } from './components/SearchResultsList';
import { MOCK_SEARCH_RESULTS } from './constants';
import { useSearchFilters } from './hooks/useSearchFilters';
import './styles.css';

export interface SearchResultsProps {
  currentPath?: string;
  initialData?: SearchResultsData;
  onSearch?: (query: string, filters: SearchResultsData['filters'], sortBy: SortOption) => void;
}

export const SearchResults: FC<SearchResultsProps> = ({ currentPath, initialData = MOCK_SEARCH_RESULTS, onSearch }) => {
  const [searchQuery, setSearchQuery] = useState(initialData.query);
  const [sortBy, setSortBy] = useState<SortOption>(initialData.sortBy);
  const { filters, updateFilter } = useSearchFilters(initialData.filters);

  const handleSearch = useCallback(
    (query: string) => {
      setSearchQuery(query);
      onSearch?.(query, filters, sortBy);
    },
    [filters, sortBy, onSearch],
  );

  const handleSortChange = useCallback(
    (newSort: SortOption) => {
      setSortBy(newSort);
      onSearch?.(searchQuery, filters, newSort);
    },
    [searchQuery, filters, onSearch],
  );

  const handleFilterChange = useCallback(
    (key: keyof typeof filters, value: string) => {
      updateFilter(key, value);
      onSearch?.(searchQuery, { ...filters, [key]: value }, sortBy);
    },
    [searchQuery, filters, sortBy, updateFilter, onSearch],
  );

  return (
    <body className="utrecht-page-body">
      <template-skip-link>Skip to main content</template-skip-link>

      <PageHeaderSection />

      <Navigation currentPath={currentPath} />

      <div className="utrecht-page-body__content">
        <main id="main">
          <PageContent>
            <clippy-heading level={1}>Zoeken</clippy-heading>

            <SearchForm query={searchQuery} onQueryChange={setSearchQuery} onSubmit={handleSearch} />

            <div className="search-results-layout">
              <SearchFiltersComponent filters={filters} onFilterChange={handleFilterChange} />

              <div className="search-results-content">
                <SearchResultsHeader
                  totalResults={initialData.totalResults}
                  sortBy={sortBy}
                  onSortChange={handleSortChange}
                />

                <SearchResultsList results={initialData.results} />
              </div>
            </div>
          </PageContent>
        </main>
      </div>

      <PageFooterSection />
    </body>
  );
};

export default SearchResults;
