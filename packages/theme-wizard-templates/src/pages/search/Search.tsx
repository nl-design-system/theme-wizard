import { SkipLink } from '@nl-design-system-candidate/skip-link-react/css';
import { PageContent } from '@utrecht/component-library-react/dist/css-module';
import { PageBody } from '@utrecht/page-body-react';
import React, { useState, useCallback } from 'react';
import Navigation from '../../sections/Navigation';
import PageFooterSection from '../../sections/PageFooter';
import PageHeaderSection from '../../sections/PageHeader';
import { SearchForm } from './components/SearchForm';
import './styles.css';
import '@amsterdam/design-system-css/dist/visually-hidden/visually-hidden.css';

export interface SearchProps {
  currentPath?: string;
  onSearch?: (query: string) => void;
}

export const Search = ({ currentPath, onSearch }: SearchProps): JSX.Element => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = useCallback(
    (query: string) => {
      setSearchQuery(query);
      onSearch?.(query);
    },
    [onSearch],
  );

  return (
    <>
      <SkipLink href="#main">Skip to main content</SkipLink>

      <PageHeaderSection />

      <Navigation currentPath={currentPath} />

      <PageBody>
        <main id="main" aria-label="Zoekresultaten">
          <PageContent>
            <div className="search-page-container">
              <SearchForm query={searchQuery} onQueryChange={setSearchQuery} onSubmit={handleSearch} />
            </div>
          </PageContent>
        </main>
      </PageBody>

      <PageFooterSection />
    </>
  );
};

export default Search;
