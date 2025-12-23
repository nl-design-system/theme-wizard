import { Card } from '@amsterdam/design-system-react';
import { Heading } from '@nl-design-system-candidate/heading-react/css';
import { Link } from '@nl-design-system-candidate/link-react';
import { Icon } from '@utrecht/component-library-react';
import { Paragraph } from '@utrecht/component-library-react/dist/css-module';
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
          <Heading level={3} appearance="level-3">
            {card.title}
          </Heading>

          <Icon>
            <UtrechtIconKalender />
          </Icon>

          <Paragraph>{card.date}</Paragraph>

          <Paragraph>{card.body}</Paragraph>

          <Row justify="flex-end">
            {/* https://www.w3.org/WAI/WCAG21/Techniques/aria/ARIA8 */}
            <Link href={card.href} aria-label={`Lees meer over ${card.title}`}>
              <Icon aria-hidden="true">
                <UtrechtIconChevronRight />
              </Icon>
            </Link>
          </Row>
        </Card>
      </Column>
    ))}
  </Row>
);

export default NewsCards;
