import { Card } from '@amsterdam/design-system-react';
import { Heading } from '@nl-design-system-candidate/heading-react/css';
import { Link } from '@nl-design-system-candidate/link-react/css';
import { IconCalendar } from '@tabler/icons-react';
import { Icon } from '@utrecht/component-library-react';
import { Paragraph } from '@utrecht/component-library-react/dist/css-module';
import React from 'react';
import type { NewsItem } from './types';
import { Column, Row } from '../Layout';

export interface NewsCardsProps {
  cards: NewsItem[];
}

const NewsCards = ({ cards }: NewsCardsProps) => (
  <Row columnGap="var(--basis-space-column-xl)" justify="flex-start" rowGap="var(--basis-space-row-xl)" role="list">
    {cards.map((card) => (
      <Column key={`${card.href}-${card.title}`} cols={6} role="listitem">
        <Card className="clippy-voorbeeld__link">
          <header>
            <Heading level={3} appearance="level-3">
              {card.title}
            </Heading>

            <Icon>
              <IconCalendar />
            </Icon>

            <time dateTime={card.dateTime}>{card.date}</time>
          </header>

          <Paragraph>{card.body}</Paragraph>

          <footer>
            <Link href={card.href} aria-label={`Lees meer over ${card.title}`}>
              Meer lezen
            </Link>
          </footer>
        </Card>
      </Column>
    ))}
  </Row>
);

export default NewsCards;
