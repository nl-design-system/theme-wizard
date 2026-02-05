import { SkipLink } from '@nl-design-system-candidate/skip-link-react/css';
import { PageBody } from '@utrecht/page-body-react';
import React from 'react';
import Navigation, { type NavigationProps } from '../sections/Navigation';
import PageFooterSection from '../sections/PageFooter';
import PageHeaderSection from '../sections/PageHeader';

export interface TemplateLayoutProps extends NavigationProps {
  children: React.ReactNode;
  mainId?: string;
}

/**
 * TemplateLayout provides the standard structure for all template pages.
 * It includes the SkipLink, Header, Navigation (with Search pattern), Footer, and PageBody wrapper.
 */
export const TemplateLayout = ({
  breadcrumb,
  children,
  currentPath,
  mainId = 'main',
  onSearchQueryChange,
  onSearchSubmit,
  searchQuery,
}: TemplateLayoutProps) => {
  return (
    <>
      <SkipLink href={`#${mainId}`}>Skip to main content</SkipLink>

      <PageHeaderSection />

      <Navigation
        currentPath={currentPath}
        breadcrumb={breadcrumb}
        searchQuery={searchQuery}
        onSearchQueryChange={onSearchQueryChange}
        onSearchSubmit={onSearchSubmit}
      />

      <PageBody>
        {children}
      </PageBody>

      <PageFooterSection />
    </>
  );
};

export default TemplateLayout;
