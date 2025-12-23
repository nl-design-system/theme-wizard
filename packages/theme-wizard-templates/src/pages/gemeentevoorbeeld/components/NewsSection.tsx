import { Heading3, PageContent } from '@utrecht/component-library-react/dist/css-module';
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
      <Heading3 id="nieuws-heading">{heading}</Heading3>
      <NewsCards cards={cards} />
    </section>
  </PageContent>
);

export default NewsSection;
