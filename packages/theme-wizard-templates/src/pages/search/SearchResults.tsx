import { SkipLink } from '@nl-design-system-candidate/skip-link-react';
import { Heading } from '@nl-design-system-candidate/heading-react/css';
import { PageContent } from '@utrecht/component-library-react/dist/css-module';
import { PageBody } from '@utrecht/page-body-react';
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import type { SearchResultsData } from './types';
import Navigation from '../../sections/Navigation';
import PageFooterSection from '../../sections/PageFooter';
import PageHeaderSection from '../../sections/PageHeader';
import { SearchFiltersComponent } from './components/SearchFilters';
import { SearchForm } from './components/SearchForm';
import { SearchResultsList } from './components/SearchResultsList';
import { MOCK_SEARCH_RESULTS } from './constants';
import { useSearchFilters } from './hooks/useSearchFilters';
import { Select, SelectOption } from '@utrecht/component-library-react/dist/css-module';
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

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlQuery = params.get('query');
    if (urlQuery) {
      setSearchQuery(urlQuery);
    }
  }, []);

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

  const filteredResults = useMemo(() => {
    let results = [...initialData.results];

    // Filter by query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      results = results.filter(
        (r) => r.title.toLowerCase().includes(q) || r.description.toLowerCase().includes(q),
      );
    }

    // Filter by documentType
    if (filters.documentType && filters.documentType !== 'all') {
      const typeMap: Record<string, string> = {
        qa: 'Vraag en antwoord',
        publication: 'Publicatie',
        report: 'Rapport',
        news: 'Nieuwsbericht',
      };
      const typeLabel = typeMap[filters.documentType];
      if (typeLabel) {
        results = results.filter((r) => r.type === typeLabel);
      }
    }

    // Filter by period (dummy logic)
    if (filters.period && filters.period !== 'all' && filters.period !== 'custom') {
      const days = parseInt(filters.period, 10);
      if (!isNaN(days)) {
        const now = new Date();
        const cutoff = new Date(now.setDate(now.getDate() - days));
        results = results.filter((r) => {
          if (!r.dateTime) return false;
          return new Date(r.dateTime) >= cutoff;
        });
      }
    }

    // Sort
    if (sortBy === 'date') {
      results.sort((a, b) => {
        if (!a.dateTime) return 1;
        if (!b.dateTime) return -1;
        return new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime();
      });
    }

    return results;
  }, [initialData.results, searchQuery, filters, sortBy]);

  const resultText = filteredResults.length === 1 ? 'zoekresultaat' : 'zoekresultaten';
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
                      {filteredResults.length.toLocaleString('nl-NL')} {resultText}
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
                    <SearchResultsList results={filteredResults} query={searchQuery} />
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
