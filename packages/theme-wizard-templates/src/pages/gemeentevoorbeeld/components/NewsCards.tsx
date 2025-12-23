import { Card } from '@amsterdam/design-system-react';
import { Icon } from '@utrecht/component-library-react';
import { Heading4, Paragraph } from '@utrecht/component-library-react/dist/css-module';
import { UtrechtIconChevronRight, UtrechtIconKalender } from '@utrecht/web-component-library-react';
import React, { type FC } from 'react';
import type { NewsItem } from '../types';
import { Column, Row } from './Layout';

export interface NewsCardsProps {
  cards: NewsItem[];
}

const NewsCards: FC<NewsCardsProps> = ({ cards }) => (
  <Row columnGap="var(--basis-space-column-xl)" justify="flex-start" rowGap="var(--basis-space-row-xl)">
    {cards.map((card) => (
      <Column key={`${card.href}-${card.title}`} cols={6}>
        <Card className="voorbeeld__link voorbeeld__link--news">
          <Heading4>{card.title}</Heading4>

          <Icon>
            <UtrechtIconKalender />
          </Icon>

          <Paragraph>{card.date}</Paragraph>

          <Paragraph>{card.body}</Paragraph>

          <Row justify="flex-end">
            <Icon>
              <UtrechtIconChevronRight />
            </Icon>
          </Row>
        </Card>
      </Column>
    ))}
  </Row>
);

export default NewsCards;
