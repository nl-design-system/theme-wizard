import { Heading } from '@nl-design-system-candidate/heading-react/css';
import { PageContent } from '@utrecht/component-library-react/dist/css-module';
import React, { type FC } from 'react';
import type { NewsItem } from '../types';
import NewsCards from './NewsCards';

export interface NewsSectionProps {
  cards: NewsItem[];
  heading?: string;
}

const NewsSection: FC<NewsSectionProps> = ({ cards, heading = 'Nieuws en inzichten' }) => (
  <PageContent>
    <section aria-labelledby="nieuws-heading" className="section">
      <Heading id="nieuws-heading" level={2} appearance="level-2">
        {heading}
      </Heading>
      <NewsCards cards={cards} />
    </section>
  </PageContent>
);

export default NewsSection;
