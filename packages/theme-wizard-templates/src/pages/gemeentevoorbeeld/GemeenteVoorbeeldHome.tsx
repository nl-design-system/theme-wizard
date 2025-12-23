import React, { type FC } from 'react';
import MainIntroSection from './Sections/MainIntro';
import Navigation from './Sections/Navigation';
import NewsSection from './Sections/News';
import PageFooterSection from './Sections/PageFooter';
import PageHeaderSection from './Sections/PageHeader';
import SelfServiceSection from './Sections/SelfService';
import './styles.css';

export interface GemeenteVoorbeeldHomeProps {
  currentPath?: string;
}

const GemeenteVoorbeeldHome: FC<GemeenteVoorbeeldHomeProps> = ({ currentPath }) => (
  <>
    <PageHeaderSection />

    <Navigation currentPath={currentPath} />

    <main>
      <MainIntroSection />

      <SelfServiceSection />

      <NewsSection />
    </main>

    <PageFooterSection />
  </>
);

export default GemeenteVoorbeeldHome;
