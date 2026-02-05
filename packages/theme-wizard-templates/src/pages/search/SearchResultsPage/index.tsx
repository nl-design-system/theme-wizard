import { IconChevronRight } from '@tabler/icons-react';
import { PageContent } from '@utrecht/component-library-react/dist/css-module';
import { BreadcrumbNav, BreadcrumbNavLink, Icon } from '@utrecht/component-library-react/dist/css-module';
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import type { SearchResultsData, SearchResultsProps, SortOption } from './types';
import TemplateLayout from '../../../layouts/TemplateLayout';
import { SearchFiltersComponent } from '../components/SearchFilters';
import { SearchResultsList } from '../components/SearchResultsList';
import { MOCK_SEARCH_RESULTS } from '../constants';
import './styles.css';
import '@amsterdam/design-system-css/dist/visually-hidden/visually-hidden.css';
import { SEARCH_SORT_OPTIONS, SEARCH_FILTER_PERIODS, SEARCH_FILTER_TYPES, SEARCH_FILTER_ORGANIZATIONS } from '../constants';
import { useSearchFilters } from '../hooks/useSearchFilters';
import { Paragraph } from '@nl-design-system-candidate/paragraph-react';
import { SkipLink } from '@nl-design-system-candidate/skip-link-react';
import { SearchForm } from '../components';

// --- SERVER-SIDE & CLIENT-SIDE LOGIC ---
// This component renders on the server (Astro SSR) to generate initial HTML (Progressive Enhancement)
// and then hydrates on the client to become interactive.

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

  const getInitialFilters = useCallback(() => {
    // 1. Prioritize props from Astro
    const hasInitialValues = Object.values(initialFilters).some(v => v !== undefined);
    if (hasInitialValues) return initialFilters;

    // 2. Fallback to URL params (client-side only)
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlFilters: any = {};
      if (params.get('filter_documentType')) urlFilters.documentType = params.get('filter_documentType');
      if (params.get('filter_organization')) urlFilters.organization = params.get('filter_organization');
      if (params.get('filter_period')) urlFilters.period = params.get('filter_period');

      if (Object.keys(urlFilters).length > 0) return urlFilters;
    }

    // 3. Fallback to initial data defaults
    return initialData.filters || {};
  }, [initialFilters, initialData.filters]);

  const { filters, resetFilters, updateFilter } = useSearchFilters(getInitialFilters());

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

    // Filter by organization
    if (filters.organization && filters.organization !== 'all') {
      const orgMap: Record<string, string> = {
        'org-a': 'Organisatie A',
        'org-b': 'Organisatie B',
        'org-c': 'Organisatie C',
        'org-d': 'Organisatie D',
      };
      const orgLabel = orgMap[filters.organization];
      if (orgLabel) {
        results = results.filter((r) => r.organization === orgLabel);
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
  const resultText = filteredResults.length === 1 ? 'resultaat' : 'resultaten';
  const queryText = appliedQuery ? ` voor "${appliedQuery}"` : '';

  const summaryHeading = hasResults
    ? `${filteredResults.length.toLocaleString('nl-NL')} ${resultText}${queryText}`
    : `Geen resultaten gevonden${queryText}`;

  const summaryHeadingTitle = hasResults
    ? `${filteredResults.length.toLocaleString('nl-NL')} ${resultText}`
    : `Geen resultaten gevonden${queryText}`;

  const headingText = "Zoekresultaten";
  const statusText = summaryHeading;


  const activeFilterLabels = useMemo(() => {
    const list: Array<{ key: string; label: string; value: string; isAll: boolean }> = [];

    // Document Type
    const typeValue = filters.documentType || 'all';
    const typeLabel = SEARCH_FILTER_TYPES.find(t => t.value === typeValue)?.label || typeValue;
    list.push({ key: 'documentType', label: typeLabel, value: typeValue, isAll: typeValue === 'all' });

    // Organization
    const orgValue = filters.organization || 'all';
    const orgLabel = SEARCH_FILTER_ORGANIZATIONS.find(o => o.value === orgValue)?.label || orgValue;
    list.push({ key: 'organization', label: orgLabel, value: orgValue, isAll: orgValue === 'all' });

    // Period
    const periodValue = filters.period || 'all';
    let periodLabel = periodValue;
    if (periodValue === 'custom') {
      periodLabel = 'Specifieke periode';
    } else if (periodValue.includes(' to ')) {
      const [from, to] = periodValue.split(' to ');
      const formatDate = (d: string) => {
        const [year, month, day] = d.split('-');
        return `${day}-${month}-${year}`;
      };
      periodLabel = `Van ${formatDate(from)} tot ${formatDate(to)}`;
    } else {
      periodLabel = SEARCH_FILTER_PERIODS.find(p => p.value === periodValue)?.label || periodValue;
    }
    list.push({ key: 'period', label: periodLabel, value: periodValue, isAll: periodValue === 'all' });

    return list;
  }, [filters]);

  /**
   * Update document title when summary heading changes.
   * This is essential for accessibility (WCAG), ensuring screen reader users
   * are notified of the current search results and page state.
  */
  useEffect(() => {
    document.title = `${summaryHeadingTitle} - Zoekresultaten`;
  }, [summaryHeadingTitle]);


  const breadcrumbs = (
    <BreadcrumbNav>
      <BreadcrumbNavLink href="/">Home</BreadcrumbNavLink>

      <Icon className="clippy--breadcrumb-separator">
        <IconChevronRight size={14} aria-hidden="true" />
      </Icon>

      <BreadcrumbNavLink href="/search/">Zoeken</BreadcrumbNavLink>

      <Icon className="clippy--breadcrumb-separator">
        <IconChevronRight size={14} aria-hidden="true" />
      </Icon>

      <BreadcrumbNavLink href="/search-results/" aria-current="page">Zoekresultaten</BreadcrumbNavLink>
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

      <div className="clippy--navigation-breadcrumb-wrapper--desktop">
        {breadcrumbs}
      </div>


      <main className="clippy--search-results-layout" tabIndex={-1}>
        <SkipLink href="#search-results">Direct naar resultaten, filters overslaan</SkipLink>

        <PageContent>

          <div className="clippy--search-page-container">

            <div className="clippy--search-results-wrapper" id="main-content">
              <SearchFiltersComponent
                filters={filters}
                onFilterChange={handleFilterChange}
                onResetFilters={handleResetFilters}
                currentQuery={appliedQuery}
                currentSort={sortBy}
                sortOptions={[...SEARCH_SORT_OPTIONS]}
                onSortChange={handleSortChange}
              />

              <div className="clippy--search-results-content">
                <SearchForm query={appliedQuery} onQueryChange={setSearchQuery} onSubmit={handleSearch} />

                <SearchResultsList
                  results={filteredResults}
                  handleSortChange={handleSortChange}
                  sortBy={sortBy}
                  query={appliedQuery}
                  headingText={headingText}
                  statusText={statusText}
                  activeFilterLabels={activeFilterLabels}
                />
              </div>
            </div>
          </div>
        </PageContent>
      </main>
    </TemplateLayout>
  );
};

export default SearchResults;
