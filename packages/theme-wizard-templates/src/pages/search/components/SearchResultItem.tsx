import React, { type FC, memo } from 'react';
import { Mark } from '@utrecht/component-library-react/dist/css-module';
import type { SearchResult } from '../types';

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

  const terms = query.trim().split(/\s+/);
  const regex = new RegExp(`(${terms.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi');
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, index) => {
        const isMatch = regex.test(part);
        regex.lastIndex = 0; // Reset regex state
        
        return isMatch ? (
          <Mark key={index}>{part}</Mark>
        ) : (
          <React.Fragment key={index}>{part}</React.Fragment>
        );
      })}
    </>
  );
};

export const SearchResultItem: FC<SearchResultItemProps> = memo(({ position, result, totalResults, query }) => {
  return (
    <article className="search-result-item">
      <a href={result.url} className="search-result-item__link">
        <h3 className="search-result-item__title">
          {highlightText(result.title, query)}
        </h3>

        <p className="search-result-item__description">
          {highlightText(result.description, query)}
        </p>

        <div className="search-result-meta" aria-label="Metadata van zoekresultaat">
          <span className="search-result-type" aria-label={`Type: ${result.type}`}>
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
