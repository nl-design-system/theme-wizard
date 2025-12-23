import { Heading } from '@nl-design-system-candidate/heading-react/css';
import { PageContent } from '@utrecht/component-library-react/dist/css-module';
import React, { type FC } from 'react';
import NewsCards from '../../components/NewsCards';
import { NEWS_ITEMS } from '../../constants';

export interface NewsSectionProps {
  heading?: string;
}

const NewsSection: FC<NewsSectionProps> = ({ heading = 'Nieuws en inzichten' }) => (
  <PageContent>
    <section className="section">
      <Heading id="nieuws-heading" level={2} appearance="level-2">
        {heading}
      </Heading>
      <NewsCards cards={NEWS_ITEMS} />
    </section>
  </PageContent>
);

export default NewsSection;
