import { Heading } from '@nl-design-system-candidate/heading-react/css';
import { IconChevronRight } from '@tabler/icons-react';
import { PageContent } from '@utrecht/component-library-react/dist/css-module';
import { Select, SelectOption } from '@utrecht/component-library-react/dist/css-module';
import { BreadcrumbNav, BreadcrumbNavLink, Icon } from '@utrecht/component-library-react/dist/css-module';
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import type { SearchResultsData } from './types';
import TemplateLayout from '../../../layouts/TemplateLayout';
import { SearchFiltersComponent } from '../components/SearchFilters';
import { SearchResultsList } from '../components/SearchResultsList';
import { MOCK_SEARCH_RESULTS } from '../constants';
import './styles.css';
import '@amsterdam/design-system-css/dist/visually-hidden/visually-hidden.css';
import { SEARCH_SORT_OPTIONS } from '../constants';
import { useSearchFilters } from '../hooks/useSearchFilters';

// --- SERVER-SIDE & CLIENT-SIDE LOGIC ---
// This component renders on the server (Astro SSR) to generate initial HTML (Progressive Enhancement)
// and then hydrates on the client to become interactive.

export interface SearchResultsProps {
  currentPath?: string;
  initialData?: SearchResultsData;
  initialQuery?: string;
  initialFilters?: SearchResultsData['filters'];
  initialSort?: SortOption;
  onSearch?: (query: string, filters: SearchResultsData['filters'], sortBy: SortOption) => void;
}

export type SortOption = 'relevance' | 'date';

export const SearchResults = ({
  currentPath,
  initialData = MOCK_SEARCH_RESULTS,
  initialFilters = {},
  initialQuery = '',
  initialSort = 'relevance',
  onSearch,
}: SearchResultsProps): React.ReactElement => {
  // --- INITIALIZATION (Runs on both Server and Client) ---
  const getInitialQuery = () => {
    if (initialQuery) return initialQuery;
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('search') || params.get('query') || '';
    }
    return '';
  };

  const [searchQuery, setSearchQuery] = useState(getInitialQuery);
  const [appliedQuery, setAppliedQuery] = useState(getInitialQuery);
  const [sortBy, setSortBy] = useState<SortOption>(initialSort);
  
  // Use initialFilters if they have any valid (non-undefined) values, otherwise fall back to MOCK data filters
  const effectiveInitialFilters = useMemo(() => {
    const hasInitialValues = Object.values(initialFilters).some(v => v !== undefined);
    return hasInitialValues ? initialFilters : initialData.filters;
  }, [initialFilters, initialData.filters]);

  const { filters, resetFilters, updateFilter } = useSearchFilters(effectiveInitialFilters);

  // Helper to sync state to URL (for both Client-side and Full-reload fallback)
  const syncUrl = useCallback((query: string, currentFilters: typeof filters, currentSort: SortOption) => {
    if (typeof window === 'undefined') return;

    const params = new URLSearchParams();
    if (query) params.set('search', query);
    if (currentSort !== 'relevance') params.set('sort', currentSort);
    
    // Add filter params with a prefix for clarity in URL
    Object.entries(currentFilters).forEach(([key, value]) => {
      if (value && value !== 'all') {
        params.set(`filter_${key}`, value);
      }
    });

    const newUrl = `${window.location.pathname}?${params.toString()}`;

    // Progressive Enhancement Choice
    const useReload = localStorage.getItem('clippy-search-use-reload') === 'true';

    if (useReload) {
      window.location.href = newUrl;
    } else {
      window.history.pushState({}, '', newUrl);
    }
  }, []);

  // --- CLIENT-SIDE INTERACTION HANDLERS ---
  const handleSearch = useCallback(
    (query: string) => {
      setSearchQuery(query);
      setAppliedQuery(query);
      syncUrl(query, filters, sortBy);
      onSearch?.(query, filters, sortBy);
    },
    [filters, sortBy, syncUrl, onSearch],
  );

  const handleSortChange = useCallback(
    (newSort: SortOption) => {
      setSortBy(newSort);
      syncUrl(appliedQuery, filters, newSort);
      onSearch?.(appliedQuery, filters, newSort);
    },
    [appliedQuery, filters, syncUrl, onSearch],
  );

  const handleFilterChange = useCallback(
    (key: keyof typeof filters, value: string) => {
      updateFilter(key, value);
      const newFilters = { ...filters, [key]: value };
      syncUrl(appliedQuery, newFilters, sortBy);
      onSearch?.(appliedQuery, newFilters, sortBy);
    },
    [appliedQuery, filters, sortBy, updateFilter, syncUrl, onSearch],
  );

  const handleResetFilters = useCallback(() => {
    resetFilters();
    const defaultFilters = { documentType: 'all', organization: 'all', period: 'all' };
    syncUrl(appliedQuery, defaultFilters, sortBy);
    onSearch?.(appliedQuery, defaultFilters, sortBy);
  }, [appliedQuery, sortBy, resetFilters, syncUrl, onSearch]);

  const filteredResults = useMemo(() => {
    let results = [...initialData.results];

    // Filter by query
    if (appliedQuery) {
      const q = appliedQuery.toLowerCase();
      results = results.filter(
        (r) => r.title.toLowerCase().includes(q) || r.description.toLowerCase().includes(q),
      );
    }

    // Filter by documentType
    if (filters.documentType && filters.documentType !== 'all') {
      const typeMap: Record<string, string> = {
        news: 'Nieuwsbericht',
        publication: 'Publicatie',
        qa: 'Vraag en antwoord',
        report: 'Rapport',
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
  }, [initialData.results, appliedQuery, filters, sortBy]);

  const hasResults = filteredResults.length > 0;
  const resultText = filteredResults.length === 1 ? 'zoekresultaat' : 'zoekresultaten';
  const queryText = appliedQuery ? ` voor "${appliedQuery}"` : '';

  const summaryHeading = hasResults 
    ? `${filteredResults.length.toLocaleString('nl-NL')} ${resultText}${queryText}`
    : `Geen resultaten gevonden${queryText}`;

  /**
   * Update document title when summary heading changes.
   * This is essential for accessibility (WCAG), ensuring screen reader users
   * are notified of the current search results and page state.
   */
  useEffect(() => {
    document.title = `${summaryHeading} - Zoekresultaten`;
  }, [summaryHeading]);


  const breadcrumbs = (
    <BreadcrumbNav>
      <BreadcrumbNavLink href="/">Home</BreadcrumbNavLink>

      <Icon className="clippy--breadcrumb-separator">
        <IconChevronRight size={14} aria-hidden="true" />
      </Icon>
      
      <BreadcrumbNavLink href="/search/" aria-current="page">Zoekresultaten</BreadcrumbNavLink>
    </BreadcrumbNav>
  );

  return (
    <TemplateLayout
      currentPath={currentPath}
      breadcrumb={
        <div className="clippy--navigation-breadcrumb-wrapper--mobile">
          {breadcrumbs}
        </div>
      }
      searchQuery={searchQuery}
      onSearchQueryChange={setSearchQuery}
      onSearchSubmit={handleSearch}
    >
      <main className="clippy--search-results-layout" id="main" tabIndex={-1}>
        <PageContent>
          <div className="clippy--navigation-breadcrumb-wrapper--desktop">
            {breadcrumbs}
          </div>
          
          <div className="clippy--search-page-container">
            <div className="clippy--search-results-summary" aria-live="polite">
              <div className='clippy--search-results-heading-wrapper'>
                <Heading level={1}>
                  {summaryHeading}
                </Heading>
              </div>
              
              <div className="clippy--search-results-sort">
                <label htmlFor="sort-by" className="clippy--search-results-sort__label">
                  Sorteren op:
                </label>

                <div className="clippy--search-results-sort__control">
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

            <div className="clippy--search-results-wrapper">
              <SearchFiltersComponent 
                filters={filters} 
                onFilterChange={handleFilterChange} 
                onResetFilters={handleResetFilters}
                currentQuery={appliedQuery}
                currentSort={sortBy}
              />

              <div className="clippy--search-results-content">
                <SearchResultsList results={filteredResults} query={appliedQuery} />
              </div>
            </div>
          </div>
        </PageContent>
      </main>
    </TemplateLayout>
  );
};

export default SearchResults;
