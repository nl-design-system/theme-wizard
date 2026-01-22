import { SkipLink } from '@nl-design-system-candidate/skip-link-react/css';
import React from 'react';
import { PageBody } from '@utrecht/page-body-react';
import type { SummaryItem } from '../../components/OpeningHoursCard/types';
import MainIntroSection from '../../sections/MainIntro';
import Navigation from '../../sections/Navigation';
import NewsSection from '../../sections/News';
import PageFooterSection from '../../sections/PageFooter';
import PageHeaderSection from '../../sections/PageHeader';
import SelfServiceSection from '../../sections/SelfService';
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
