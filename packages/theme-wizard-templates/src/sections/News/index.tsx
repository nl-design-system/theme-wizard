import { Heading } from '@nl-design-system-candidate/heading-react/css';
import { PageContent } from '@utrecht/component-library-react/dist/css-module';
import React from 'react';
import NewsCards from '../../components/NewsCards';
import { NEWS_ITEMS } from '../../constants';

export interface NewsSectionProps {
  heading?: string;
}

const NewsSection = ({ heading = 'Nieuws en inzichten' }: NewsSectionProps) => (
  <PageContent>
    <section>
      <Heading id="nieuws-heading" level={2} appearance="level-2">
        {heading}
      </Heading>

      <NewsCards cards={NEWS_ITEMS} />
    </section>
  </PageContent>
);

export default NewsSection;
