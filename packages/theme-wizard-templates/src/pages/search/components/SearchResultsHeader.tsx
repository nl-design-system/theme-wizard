import React, { type FC } from 'react';
import { SEARCH_SORT_OPTIONS } from '../constants';

export type SortOption = 'relevance' | 'date';

export interface SearchResultsHeaderProps {
  onSortChange: (sort: SortOption) => void;
  sortBy: SortOption;
  totalResults: number;
}

export const SearchResultsHeader: FC<SearchResultsHeaderProps> = ({ onSortChange, sortBy, totalResults }) => {
  return (
    <div className="search-results-header">
      <div className="search-results-summary">
        <clippy-heading level={2}>{totalResults.toLocaleString('nl-NL')} zoekresultaten</clippy-heading>
      </div>

      <div className="search-results-sort">
        <label htmlFor="sort-by">Sorteren op:</label>

        <select
          id="sort-by"
          name="sort"
          className="utrecht-select utrecht-select--html-input"
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value as SortOption)}
          aria-label="Sorteer zoekresultaten"
        >
          {SEARCH_SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
