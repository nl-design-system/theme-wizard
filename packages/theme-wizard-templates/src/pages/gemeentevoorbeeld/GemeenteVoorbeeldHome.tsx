import { SkipLink } from '@nl-design-system-candidate/skip-link-react/css';
import React, { type FC } from 'react';
import type { SummaryItem } from '../../components/OpeningHoursCard/types';
import MainIntroSection from '../../sections/MainIntro';
import Navigation from '../../sections/Navigation';
import NewsSection from '../../sections/News';
import PageFooterSection from '../../sections/PageFooter';
import PageHeaderSection from '../../sections/PageHeader';
import SelfServiceSection from '../../sections/SelfService';

export interface GemeenteVoorbeeldHomeProps {
  currentPath?: string;
  openingHoursSummary?: SummaryItem[];
}

const GemeenteVoorbeeldHome: FC<GemeenteVoorbeeldHomeProps> = ({ currentPath, openingHoursSummary }) => (
  <>
    <SkipLink href="#main">Skip to main content</SkipLink>

    <PageHeaderSection />

    <Navigation currentPath={currentPath} />

    <div className="utrecht-page-body">
      <div className="utrecht-page-body__content">
        <main id="main">
          <MainIntroSection openingHoursSummary={openingHoursSummary} />

          <SelfServiceSection />

          <NewsSection />
        </main>
      </div>
    </div>
    <PageFooterSection />
  </>
);

export default GemeenteVoorbeeldHome;
