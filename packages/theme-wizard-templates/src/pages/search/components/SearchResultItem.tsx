import React, { type FC, memo } from 'react';
import type { SearchResult } from '../types';

export interface SearchResultItemProps {
  result: SearchResult;
}

export const SearchResultItem: FC<SearchResultItemProps> = memo(({ result }) => {
  return (
    <article className="search-result-item">
      <clippy-heading level={3}>
        <template-link href={result.url}>{result.title}</template-link>
      </clippy-heading>

      <div className="search-result-meta">
        <span className="search-result-type">{result.type}</span>
        {result.date && (
          <time dateTime={result.dateTime || result.date} className="search-result-date">
            {result.date}
          </time>
        )}
      </div>

      <template-paragraph>{result.description}</template-paragraph>
    </article>
  );
});

SearchResultItem.displayName = 'SearchResultItem';
