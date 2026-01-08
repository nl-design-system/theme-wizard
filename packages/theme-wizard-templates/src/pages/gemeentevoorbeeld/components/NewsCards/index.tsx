import { Card } from '@amsterdam/design-system-react';
import { Heading } from '@nl-design-system-candidate/heading-react/css';
import { Icon } from '@utrecht/component-library-react';
import { ButtonLink, Paragraph } from '@utrecht/component-library-react/dist/css-module';
import { UtrechtIconKalender } from '@utrecht/web-component-library-react';
import React, { type FC } from 'react';
import type { NewsItem } from './types';
import { Column, Row } from '../Layout';

export interface NewsCardsProps {
  cards: NewsItem[];
}

const NewsCards: FC<NewsCardsProps> = ({ cards }) => (
  <Row columnGap="var(--basis-space-column-xl)" justify="flex-start" rowGap="var(--basis-space-row-xl)" role="list">
    {cards.map((card) => (
      <Column key={`${card.href}-${card.title}`} cols={6} role="listitem">
        <Card className="voorbeeld__link">
          <header>
            <Heading level={3} appearance="level-3">
              {card.title}
            </Heading>

            <Icon>
              <UtrechtIconKalender />
            </Icon>

            <time dateTime={card.dateTime}>{card.date}</time>
          </header>

          <Paragraph>{card.body}</Paragraph>

          <footer>
            <Row justify="flex-end">
              <ButtonLink
                appearance="secondary-action-button"
                href={card.href}
                aria-label={`Lees meer over ${card.title}`}
              >
                Meer lezen
              </ButtonLink>
            </Row>
          </footer>
        </Card>
      </Column>
    ))}
  </Row>
);

export default NewsCards;
