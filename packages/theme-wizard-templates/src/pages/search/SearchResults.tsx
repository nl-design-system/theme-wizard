import { SkipLink } from '@nl-design-system-candidate/skip-link-react/css';
import React, { type FC } from 'react';
import Navigation from '../../sections/Navigation';
import PageFooterSection from '../../sections/PageFooter';
import PageHeaderSection from '../../sections/PageHeader';

export interface SearchResultsProps {
  currentPath?: string;
}

const SearchResults: FC<SearchResultsProps> = ({ currentPath }) => (
  <>
    <SkipLink href="#main">Skip to main content</SkipLink>

    <PageHeaderSection />

    <Navigation currentPath={currentPath} />

    <main id="main">
      
    </main>

    <PageFooterSection />
  </>
);

export default SearchResults;
