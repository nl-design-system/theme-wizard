import { Heading } from '@nl-design-system-candidate/heading-react/css';
import { PageContent } from '@utrecht/component-library-react/dist/css-module';
import React, { type FC } from 'react';
import type { OpeningHoursCardProps } from '../../components/OpeningHoursCard/types';
import { Column, Row } from '../../components/Layout';
import OpeningHoursCard from '../../components/OpeningHoursCard';
import QuickTasks from '../../components/QuickTasks';
import { QUICK_TASKS } from '../../constants';

const MainIntroSection: FC<OpeningHoursCardProps> = ({ openingHoursSummary }) => (
  <PageContent>
    <section className="section" aria-labelledby="page-title">
      <Heading id="page-title" level={1} className="section" appearance="level-1">
        Gemeente Voorbeeld
      </Heading>

      <Row
        align="stretch"
        columnGap="var(--basis-space-column-xl)"
        rowGap="var(--basis-space-column-xl)"
        justify="space-between"
        reverseOnSmallScreen
      >
        <Column cols={9}>
          <QuickTasks tasks={QUICK_TASKS} />
        </Column>

        <Column cols={3}>
          <OpeningHoursCard openingHoursSummary={openingHoursSummary} />
        </Column>
      </Row>
    </section>
  </PageContent>
);

export default MainIntroSection;
