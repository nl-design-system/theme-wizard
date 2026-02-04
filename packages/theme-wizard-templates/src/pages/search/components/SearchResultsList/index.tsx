import { Paragraph } from '@utrecht/component-library-react/dist/css-module';
import React from 'react';
import type { SearchResult } from '../SearchResultItem/types';
import { SearchResultItem } from '../SearchResultItem';
import './styles.css';

export interface SearchResultsListProps {
  results: SearchResult[];
  query?: string;
}

export const SearchResultsList = ({ query, results }: SearchResultsListProps) => {
  const queryText = query ? ` voor "${query}"` : '';

  if (results.length === 0) {
    return (
      <section aria-labelledby="no-results-heading" className="search-results-list">
        <h3 id="no-results-heading" className="ams-visually-hidden">
          Geen zoekresultaten{queryText}
        </h3>
        <Paragraph role="status" aria-live="polite">
          Geen resultaten gevonden{queryText}. Probeer andere zoektermen.
        </Paragraph>
      </section>
    );
  }

  return (
    <section aria-labelledby="results-list-heading" className="search-results-list">
      <h2 id="results-list-heading" className="ams-visually-hidden">
        Lijst met zoekresultaten{queryText}
      </h2>
      
      <ol className="clippy--search-results-list__items" aria-live="polite" aria-atomic="false">
        {results.map((result, index) => (
          <li key={result.id}>
            <SearchResultItem 
              result={result} 
              position={index + 1} 
              totalResults={results.length}
              query={query}
            />
          </li>
        ))}
      </ol>
    </section>
  );
};
