import { Mark } from '@utrecht/component-library-react/dist/css-module';
import React, { memo } from 'react';
import type { SearchResult } from './types';
import './styles.css';

export interface SearchResultItemProps {
  result: SearchResult;
  position?: number;
  totalResults?: number;
  query?: string;
}

/**
 * Highlight search terms in text using Utrecht Mark component
 */
const highlightText = (text: string, query?: string) => {
  if (!query || !query.trim()) {
    return text;
  }

  const escapedQuery = query.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escapedQuery})`, 'gi');
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, index) => {
        const isMatch = regex.test(part);
        regex.lastIndex = 0;
        
        return isMatch ? (
          <Mark key={index} className="clippy--search-highlight">{part}</Mark>
        ) : (
          <React.Fragment key={index}>{part}</React.Fragment>
        );
      })}
    </>
  );
};

export const SearchResultItem = memo(({ position, query, result, totalResults }: SearchResultItemProps) => {
  return (
    <article className="clippy--search-result-item">
      <a href={result.url} className="clippy--search-result-item__link">
        <h3 className="clippy--search-result-item__title">
          {highlightText(result.title, query)}
        </h3>

        <p className="clippy--search-result-item__description">
          {highlightText(result.description, query)}
        </p>

        <div className="clippy--search-result-meta" aria-label="Metadata van zoekresultaat">
          <span className="clippy--search-result-type" aria-label={`Type: ${result.type}`}>
            {result.type}
          </span>
          {result.date && (
            <>
              <span aria-hidden="true"> • </span>
              <time 
                dateTime={result.dateTime || result.date} 
                className="search-result-date" 
                aria-label={`Gepubliceerd op ${result.date}`}
              >
                {result.date}
              </time>
            </>
          )}
        </div>
      </a>
      
      {position && totalResults && (
        <span className="ams-visually-hidden">
          Resultaat {position} van {totalResults}
        </span>
      )}
    </article>
  );
});

SearchResultItem.displayName = 'SearchResultItem';
