import type { FC } from 'react';
import { PageContent, PageFooter, PageHeader } from '@utrecht/component-library-react/dist/css-module';
import { ACCORDION_SECTIONS } from './accordionSections';
import { Column, Row } from './components/Layout';
import NavigationBar from './components/NavigationBar';
import NewsSection from './components/NewsSection';
import OpeningHoursCard from './components/OpeningHoursCard';
import PageFooterSection from './components/PageFooter';
import PageHeaderSection from './components/PageHeader';
import QuickTasks from './components/QuickTasks';
import SelfServiceSection from './components/SelfServiceSection';
import { NAVIGATION_ITEMS, NEWS_ITEMS, QUICK_TASKS } from './constants';

export interface GemeenteVoorbeeldHomeProps {
  currentPath?: string;
}

const GemeenteVoorbeeldHome: FC<GemeenteVoorbeeldHomeProps> = ({ currentPath }) => (
  <>
    <PageHeader>
      <PageHeaderSection />
    </PageHeader>

    <NavigationBar currentPath={currentPath} items={NAVIGATION_ITEMS} />

    <PageContent>
      <section className="section">
        <Row
          align="stretch"
          columnGap="var(--basis-space-column-xl)"
          rowGap="var(--basis-space-column-xl)"
          justify="space-between"
        >
          <Column cols={9}>
            <QuickTasks tasks={QUICK_TASKS} />
          </Column>

          <Column cols={3}>
            <OpeningHoursCard />
          </Column>
        </Row>
      </section>
    </PageContent>

    <SelfServiceSection accordionSections={ACCORDION_SECTIONS} />

    <NewsSection cards={NEWS_ITEMS} />

    <PageFooter>
      <PageFooterSection />
    </PageFooter>
  </>
);

export default GemeenteVoorbeeldHome;
