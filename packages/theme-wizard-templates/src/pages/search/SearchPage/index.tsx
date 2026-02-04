import { PageContent } from '@utrecht/component-library-react/dist/css-module';
import { Heading } from '@nl-design-system-candidate/heading-react';
import React, { useState, useCallback } from 'react';
import TemplateLayout from '../../../layouts/TemplateLayout';
import { SearchForm } from '../../../components/SearchForm';
import './styles.css';
import '@amsterdam/design-system-css/dist/visually-hidden/visually-hidden.css';

export interface SearchProps {
  currentPath?: string;
  onSearch?: (query: string) => void;
}

export const Search = ({ currentPath, onSearch }: SearchProps): React.ReactElement => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = useCallback(
    (query: string) => {
      setSearchQuery(query);
      if (onSearch) {
        onSearch(query);
      } else {
        // Default behavior: navigate to results page
        const searchParams = new URLSearchParams();
        searchParams.set("search", query);
        window.location.href = `search-results?${searchParams.toString()}`;
      }
    },
    [onSearch],
  );

  return (
    <TemplateLayout
      currentPath={currentPath}
      searchQuery={searchQuery}
      onSearchQueryChange={setSearchQuery}
      onSearchSubmit={handleSearch}
    >
      <main id="main" aria-label="Zoekresultaten">
        <PageContent>
          <div className="clippy--search-page-container">
            <Heading level={1}>
              Waar bent u naar op zoek?
            </Heading>
            
            <SearchForm query={searchQuery} onQueryChange={setSearchQuery} onSubmit={handleSearch} />
          </div>
        </PageContent>
      </main>
    </TemplateLayout>
  );
};

export default Search;
