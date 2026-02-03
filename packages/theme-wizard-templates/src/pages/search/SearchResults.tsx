import { SkipLink } from '@nl-design-system-candidate/skip-link-react';
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
import { Select, SelectOption } from '@utrecht/component-library-react/dist/css-module';
import { IconTarget, IconCalendar } from '@tabler/icons-react';
import { SEARCH_SORT_OPTIONS } from './constants';
import './styles.css';
import '@amsterdam/design-system-css/dist/visually-hidden/visually-hidden.css';

export interface SearchResultsProps {
  currentPath?: string;
  initialData?: SearchResultsData;
  onSearch?: (query: string, filters: SearchResultsData['filters'], sortBy: SortOption) => void;
}

export type SortOption = 'relevance' | 'date';

export interface SearchResultsHeaderProps {
  onSortChange: (sort: SortOption) => void;
  sortBy: SortOption;
  totalResults: number;
  query?: string;
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

    const resultText = initialData.totalResults === 1 ? 'zoekresultaat' : 'zoekresultaten';
  const queryText = searchQuery ? ` voor "${searchQuery}"` : '';


  return (
    <>
      <SkipLink href="#main">Skip to main content</SkipLink>

      <PageHeaderSection />

      <Navigation currentPath={currentPath} />

      <PageBody>
          <PageContent>
            <div className="search-page-container">
              <SearchForm query={searchQuery} onQueryChange={setSearchQuery} onSubmit={handleSearch} />
              <main className="search-results-layout" id="main" tabIndex={-1}>
                <div className="search-results-summary" aria-live="polite">
                  <div className='search-results-heading-wrapper'>
                    <Heading level={1}>
                      {initialData.totalResults.toLocaleString('nl-NL')} {resultText}
                      {queryText}
                    </Heading>
                  </div>
                  
                  <div className="search-results-sort">
                    <label htmlFor="sort-by" className="search-results-sort__label">
                      Sorteren op:
                    </label>

                    <div className="search-results-sort__control">
                      <Select
                        id="sort-by"
                        name="sort"
                        value={sortBy}
                        onChange={(e) => handleSortChange(e.target.value as SortOption)}
                        aria-label="Sorteer zoekresultaten op relevantie of datum"
                      >
                        {SEARCH_SORT_OPTIONS.map((option) => (
                          <SelectOption key={option.value} value={option.value}>
                            {option.label}
                          </SelectOption>
                        ))}
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="search-results-wrapper">
                  <aside className="search-results-sidebar">
                    <SearchFiltersComponent filters={filters} onFilterChange={handleFilterChange} />
                  </aside>

                  <div className="search-results-content">
                    <SearchResultsList results={initialData.results} query={searchQuery} />
                  </div>
                </div>
              </main>
            </div>
          </PageContent>
      </PageBody>

      <PageFooterSection />
    </>
  );
};

export default SearchResults;
