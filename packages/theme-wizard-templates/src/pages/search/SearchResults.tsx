import { SkipLink } from '@nl-design-system-candidate/skip-link-react/css';
import { PageContent } from '@utrecht/component-library-react/dist/css-module';
import React, { type FC } from 'react';
import Navigation from '../../sections/Navigation';
import PageFooterSection from '../../sections/PageFooter';
import PageHeaderSection from '../../sections/PageHeader';


export interface SearchResultsProps {
  currentPath?: string;
}

const SearchResults: FC<SearchResultsProps> = ({ currentPath }) => (
  <body className='utrecht-page-body'>
    <SkipLink href="#main">Skip to main content</SkipLink>

    <PageHeaderSection />

    <Navigation currentPath={currentPath} />
    <div className="utrecht-page-body__content">
      <main id="main">
        <PageContent>

          <clippy-heading level={1}>Zoekresultaten</clippy-heading>

        </PageContent>
      </main>
    </div>

    <PageFooterSection />
  </body>
);

export default SearchResults;
