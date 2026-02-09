import React from 'react';
import type { SummaryItem } from '../../components/OpeningHoursCard/types';
import TemplateLayout from '../../layouts/TemplateLayout';
import MainIntroSection from '../../sections/MainIntro';
import NewsSection from '../../sections/News';
import SelfServiceSection from '../../sections/SelfService';

export interface GemeenteVoorbeeldHomeProps {
  currentPath?: string;
  openingHoursSummary?: SummaryItem[];
}

const GemeenteVoorbeeldHome = ({ currentPath, openingHoursSummary }: GemeenteVoorbeeldHomeProps) => {
  const [searchQuery, setSearchQuery] = React.useState('');

  const handleSearch = (query: string) => {
    const params = new URLSearchParams();
    params.set('search', query);
    window.location.href = `/search/search-results?${params.toString()}`;
  };

  return (
    <TemplateLayout
      currentPath={currentPath}
      searchQuery={searchQuery}
      onSearchQueryChange={setSearchQuery}
      onSearchSubmit={handleSearch}
    >
      <main id="main">
        <MainIntroSection openingHoursSummary={openingHoursSummary} />

        <SelfServiceSection />

        <NewsSection />
      </main>
    </TemplateLayout>
  );
};

export default GemeenteVoorbeeldHome;
