
import React, { type FC } from 'react';




export interface SearchResultsHeaderProps {
  onSortChange: (sort: SortOption) => void;
  sortBy: SortOption;
  query?: string;
}

export const SearchResultsHeader: FC<SearchResultsHeaderProps> = ({ onSortChange, query, sortBy }) => {

  return (
    <div className="search-results-header">

    </div>
  );
};

