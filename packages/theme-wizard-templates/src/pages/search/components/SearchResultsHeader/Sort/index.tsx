import { Select, SelectOption } from "@utrecht/component-library-react";
import type { SortProps } from "./types";
import type { SortOption } from "../../../SearchResultsPage/types";
import { SEARCH_SORT_OPTIONS } from "../../../constants";
import './styles.css';

export const Sort = ({ currentSort, onSortChange, sortOptions = SEARCH_SORT_OPTIONS }: SortProps) => (
  <div className="clippy--search-results-sort">
    <label htmlFor="sort-by" className="clippy--search-results-sort__label">
      Sorteren op
    </label>

    <div className="clippy--search-results-sort__control">
      <Select
        id="sort-by"
        name="sort"
        value={currentSort}
        onChange={(e) => onSortChange(e.target.value as SortOption)}
        aria-label="Sorteer zoekresultaten op relevantie of datum"
      >
        {sortOptions.map((option) => (
          <SelectOption key={option.value} value={option.value}>
            {option.label}
          </SelectOption>
        ))}
      </Select>
    </div>
  </div>
)