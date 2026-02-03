import { Heading } from '@nl-design-system-candidate/heading-react/css';
import { Select, SelectOption } from '@utrecht/component-library-react/dist/css-module';
import { IconTarget, IconCalendar } from '@tabler/icons-react';
import React, { type FC } from 'react';
import { SEARCH_SORT_OPTIONS } from '../constants';

export type SortOption = 'relevance' | 'date';

export interface SearchResultsHeaderProps {
  onSortChange: (sort: SortOption) => void;
  sortBy: SortOption;
  totalResults: number;
  query?: string;
}

export const SearchResultsHeader: FC<SearchResultsHeaderProps> = ({ onSortChange, query, sortBy, totalResults }) => {
  const resultText = totalResults === 1 ? 'zoekresultaat' : 'zoekresultaten';
  const queryText = query ? ` voor "${query}"` : '';

  return (
    <div className="search-results-header">
      <div className="search-results-summary" role="status">
        <Heading level={2}>
          {totalResults.toLocaleString('nl-NL')} {resultText}
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
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            aria-label="Sorteer zoekresultaten op relevantie of datum"
          >
            {SEARCH_SORT_OPTIONS.map((option) => (
              <SelectOption key={option.value} value={option.value}>
                {option.label}
              </SelectOption>
            ))}
          </Select>
          <span className="search-results-sort__indicator" aria-live="polite">
            {sortBy === 'relevance' ? (
              <>
                <IconTarget size={16} aria-hidden="true" /> Meest relevant eerst
              </>
            ) : (
              <>
                <IconCalendar size={16} aria-hidden="true" /> Nieuwste eerst
              </>
            )}
          </span>
        </div>
      </div>
    </div>
  );
};

