import { SkipLink } from '@nl-design-system-candidate/skip-link-react/css';
import { Heading } from '@nl-design-system-candidate/heading-react/css';
import { PageContent } from '@utrecht/component-library-react/dist/css-module';
import { PageBody } from '@utrecht/page-body-react';
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
import '@amsterdam/design-system-css/dist/visually-hidden/visually-hidden.css';

export interface SearchResultsProps {
  currentPath?: string;
  initialData?: SearchResultsData;
  onSearch?: (query: string, filters: SearchResultsData['filters'], sortBy: SortOption) => void;
}

export const SearchResults = ({
  currentPath,
  initialData = MOCK_SEARCH_RESULTS,
  onSearch,
}: SearchResultsProps): JSX.Element => {
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
    <>
      <SkipLink href="#main">Skip to main content</SkipLink>

      <PageHeaderSection />

      <Navigation currentPath={currentPath} />

      <PageBody>
        <main id="main" aria-label="Zoekresultaten">
          <PageContent>
            <div className="search-page-container">
              <SearchForm query={searchQuery} onQueryChange={setSearchQuery} onSubmit={handleSearch} />

              <div className="search-results-layout">
                <aside className="search-results-sidebar" aria-label="Zoekfilters">
                  <SearchFiltersComponent filters={filters} onFilterChange={handleFilterChange} />
                </aside>

                <div className="search-results-main">
                  <SearchResultsHeader
                    totalResults={initialData.totalResults}
                    sortBy={sortBy}
                    onSortChange={handleSortChange}
                    query={searchQuery}
                  />

                  <SearchResultsList results={initialData.results} query={searchQuery} />
                </div>
              </div>
            </div>
          </PageContent>
        </main>
      </PageBody>

      <PageFooterSection />
    </>
  );
};

export default SearchResults;
