import { Heading } from '@nl-design-system-candidate/heading-react';
import {
  FormField,
  FormLabel,
  Icon,
  Paragraph,
  Textbox,
} from '@utrecht/component-library-react/dist/css-module';
import React, { useState } from 'react';
import type { SearchFiltersProps } from './types';
import { SEARCH_FILTER_PERIODS, SEARCH_FILTER_TYPES, SEARCH_FILTER_ORGANIZATIONS } from '../../constants';
import './styles.css';
import { SearchFilterGroup } from './SearchFiltersGroup';
import { Sort } from '../SearchResultsHeader/Sort';
import { IconFilterX } from '@tabler/icons-react';
import { Button } from '@nl-design-system-candidate/button-react/css';
export type { SearchFiltersProps };

export const SearchFiltersComponent = ({
  currentQuery = '',
  currentSort = 'relevance',
  filters,
  onSortChange,
  sortOptions,
  onFilterChange,
  onResetFilters,
}: SearchFiltersProps) => {
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const isCustomPeriod = filters.period === 'custom';

  const hasActiveFilters = Object.values(filters).some((v) => v && v !== 'all');

  // Clear local date states when filters are reset or period changes
  React.useEffect(() => {
    if (filters.period !== 'custom' && !filters.period?.includes('to')) {
      setDateFrom('');
      setDateTo('');
    }
  }, [filters.period]);

  const handleDateChange = () => {
    if (dateFrom && dateTo) {
      // Format: "YYYY-MM-DD to YYYY-MM-DD"
      onFilterChange('period', `${dateFrom} to ${dateTo}`);
    }
  };

  return (
    <aside className="clippy--search-filters" aria-labelledby='search-filters-heading' id="filters">
      <div className="clippy--search-filters-header">
        <Heading level={2} id="search-filters-heading" appearance='level-3'>Sorteren & Filters</Heading>


        <Button
          type="button"
          className="clippy--icon-only-button nl-button nl-button--subtle nl-button--icon-only"
          onClick={onResetFilters}
          title='Filters wissen'
          disabled={!hasActiveFilters}
        >
          <IconFilterX size={20} />

          <span className="ams-visually-hidden">Filters wissen</span>
        </Button>
      </div>

      <form method="get" action="" className="clippy--search-filters-form">
        <input type="hidden" name="search" value={currentQuery} />
        <input type="hidden" name="sort" value={currentSort} />

        <Sort sortOptions={sortOptions} currentSort={currentSort} onSortChange={onSortChange} />

        <SearchFilterGroup
          title="Periode"
          id="search-filter-period"
          name="filter_period"
          options={SEARCH_FILTER_PERIODS}
          selectedValue={filters.period || 'all'}
          onValueChange={(value) => onFilterChange('period', value)}
        >
          {isCustomPeriod && (
            <div
              className="clippy--search-filter-date-range"
              role="group"
              aria-labelledby="date-range-label"
            >
              <span id="date-range-label" className="ams-visually-hidden">
                Selecteer datumbereik
              </span>

              <div className="clippy--search-filter-date-range__fields">
                <FormField>
                  <Paragraph className="utrecht-form-field__label">
                    <FormLabel htmlFor="date-from">Van:</FormLabel>
                  </Paragraph>

                  <Textbox
                    id="date-from"
                    type="date"
                    name="filter_dateFrom"
                    value={dateFrom}
                    lang="nl-NL"
                    placeholder="dd-mm-jjjj"
                    onChange={(e) => {
                      setDateFrom((e.target as HTMLInputElement).value);
                      setTimeout(handleDateChange, 0);
                    }}
                    aria-label="Startdatum"
                  />
                </FormField>

                <FormField>
                  <Paragraph className="utrecht-form-field__label">
                    <FormLabel htmlFor="date-to">Tot:</FormLabel>
                  </Paragraph>

                  <Textbox
                    id="date-to"
                    type="date"
                    name="filter_dateTo"
                    value={dateTo}
                    min={dateFrom}
                    lang="nl-NL"
                    placeholder="dd-mm-jjjj"
                    onChange={(e) => {
                      setDateTo((e.target as HTMLInputElement).value);
                      setTimeout(handleDateChange, 0);
                    }}
                    aria-label="Einddatum"
                  />
                </FormField>
              </div>
            </div>
          )}
        </SearchFilterGroup>

        <SearchFilterGroup
          title="Type document"
          id="search-filter-type"
          name="filter_documentType"
          options={SEARCH_FILTER_TYPES}
          selectedValue={filters.documentType || 'all'}
          onValueChange={(value) => onFilterChange('documentType', value)}
        />

        <SearchFilterGroup
          title="Organisatie"
          id="search-filter-organization"
          name="filter_organization"
          options={SEARCH_FILTER_ORGANIZATIONS}
          selectedValue={filters.organization || 'all'}
          onValueChange={(value) => onFilterChange('organization', value)}
        />

        <div className="clippy--filter-submit-wrapper">
          <button type="submit" className="nl-button nl-button--secondary clippy--pe-only">
            Filters toepassen
          </button>
        </div>
      </form>
    </aside>
  );
};
