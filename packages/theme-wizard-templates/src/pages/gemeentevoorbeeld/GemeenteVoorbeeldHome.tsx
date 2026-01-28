import { SkipLink } from '@nl-design-system-candidate/skip-link-react/css';
import { PageBody } from '@utrecht/page-body-react';
import React from 'react';
import type { SummaryItem } from './components/OpeningHoursCard/types';
import MainIntroSection from './Sections/MainIntro';
import Navigation from './Sections/Navigation';
import NewsSection from './Sections/News';
import PageFooterSection from './Sections/PageFooter';
import PageHeaderSection from './Sections/PageHeader';
import SelfServiceSection from './Sections/SelfService';
import './styles.css';

export interface GemeenteVoorbeeldHomeProps {
  currentPath?: string;
  openingHoursSummary?: SummaryItem[];
}

const GemeenteVoorbeeldHome = ({ currentPath, openingHoursSummary }: GemeenteVoorbeeldHomeProps) => (
  <>
    <SkipLink href="#main">Skip to main content</SkipLink>

    <PageHeaderSection />

    <Navigation currentPath={currentPath} />

    <PageBody>
      <main id="main">
        <MainIntroSection openingHoursSummary={openingHoursSummary} />

        <SelfServiceSection />

        <NewsSection />
      </main>
    </PageBody>
    <PageFooterSection />
  </>
);

export default GemeenteVoorbeeldHome;
