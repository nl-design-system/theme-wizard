import { Paragraph } from '@utrecht/component-library-react/dist/css-module';
import React, { type FC } from 'react';
import type { SearchResult } from '../types';
import { SearchResultItem } from './SearchResultItem';

export interface SearchResultsListProps {
  results: SearchResult[];
}

export const SearchResultsList: FC<SearchResultsListProps> = ({ results }) => {
  if (results.length === 0) {
    return (
      <section aria-label="Zoekresultaten" className="search-results-list">
        <Paragraph>Geen resultaten gevonden. Probeer andere zoektermen.</Paragraph>
      </section>
    );
  }

  return (
    <section aria-label="Zoekresultaten" className="search-results-list">
      <ol className="search-results-list__items">
        {results.map((result) => (
          <li key={result.id}>
            <SearchResultItem result={result} />
          </li>
        ))}
      </ol>
    </section>
  );
};
