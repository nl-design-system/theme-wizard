import type { FC } from 'react';
import { Card } from '@amsterdam/design-system-react';
import { Icon } from '@utrecht/component-library-react';
import { Heading4, Paragraph } from '@utrecht/component-library-react/dist/css-module';
import { UtrechtIconKalender, UtrechtIconChevronRight } from '@utrecht/web-component-library-react';
import { Column, Row } from './Layout';

interface NewsCard {
  body: string;
  date: string;
  href: string;
  title: string;
}

interface NewsCardsProps {
  cards: NewsCard[];
}

const NewsCards: FC<NewsCardsProps> = ({ cards }) => (
  <Row columnGap="var(--basis-space-column-xl)" rowGap="var(--basis-space-row-xl)" justify="flex-start">
    {cards.map((card, index) => (
      <Column key={`${card.href}-${card.title}-${index}`} cols={6}>
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
