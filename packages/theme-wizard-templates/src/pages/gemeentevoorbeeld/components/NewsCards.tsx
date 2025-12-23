import { Card } from '@amsterdam/design-system-react';
import { Heading } from '@nl-design-system-candidate/heading-react/css';
import { Icon } from '@utrecht/component-library-react';
import { Paragraph, ButtonLink } from '@utrecht/component-library-react/dist/css-module';
import { UtrechtIconKalender } from '@utrecht/web-component-library-react';
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
        <Card aria-label={`Lees meer over ${card.title}`} className=" voorbeeld__link">
          <Heading level={3} appearance="level-3">
            {card.title}
          </Heading>

          <Icon>
            <UtrechtIconKalender />
          </Icon>

          <Paragraph>{card.date}</Paragraph>

          <Paragraph>{card.body}</Paragraph>

          <Row justify="flex-end">
            <ButtonLink appearance="secondary-action-button" href="/">
              Meer lezen
            </ButtonLink>
          </Row>
        </Card>
      </Column>
    ))}
  </Row>
);

export default NewsCards;
