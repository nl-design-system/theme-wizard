import { SkipLink } from '@nl-design-system-candidate/skip-link-react/css';
import React, { type FC } from 'react';
import MainIntroSection from '../Sections/MainIntro';
import Navigation from './Sections/Navigation';
import PageFooterSection from './Sections/PageFooter';
import PageHeaderSection from './Sections/PageHeader';
import './styles.css';

export interface SearchResultsProps {
  currentPath?: string;
}

const SearchResults: FC<SearchResultsProps> = ({ currentPath }) => (
  <>
    <SkipLink href="#main">Skip to main content</SkipLink>

    <PageHeaderSection />

    <Navigation currentPath={currentPath} />

    <main id="main">
      <MainIntroSection />
    </main>

    <PageFooterSection />
  </>
);

export default SearchResults;
