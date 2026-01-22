import { Card } from '@amsterdam/design-system-react';
import { Heading } from '@nl-design-system-candidate/heading-react';
import { Link } from '@nl-design-system-candidate/link-react';
import { Paragraph } from '@nl-design-system-candidate/paragraph-react';
import { IconCalendar } from '@tabler/icons-react';
import { Icon } from '@utrecht/component-library-react';
import React from 'react';
import type { NewsItem } from './types';
import { Column, Row } from '../Layout';

export interface NewsCardsProps {
  cards: NewsItem[];
}

const getImageSrc = (src: string | { src: string }): string => {
  return typeof src === 'string' ? src : src.src;
};

const NewsCards = ({ cards }: NewsCardsProps) => (
  <Row columnGap="var(--basis-space-column-xl)" justify="flex-start" rowGap="var(--basis-space-row-xl)" role="list">
    {cards.map((card) => (
      <Column key={`${card.href}-${card.title}`} cols={6} role="listitem">
        <Card className="clippy-voorbeeld__link">
          {card.image && (
            <div style={{ blockSize: '18rem', inlineSize: '100%', overflow: 'hidden' }}>
              <Card.Image
                src={getImageSrc(card.image.src)}
                alt={card.image.alt}
                style={{
                  blockSize: '18rem',
                  inlineSize: '100%',
                  objectFit: 'cover',
                  objectPosition: card.image.focalPoint || 'center center',
                }}
              />
            </div>
          )}

          <div className="clippy-voorbeeld__content">
            <header>
              <Card.HeadingGroup tagline="Nieuws">
                <Heading level={3}>{card.title}</Heading>
              </Card.HeadingGroup>

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
          </div>
        </Card>
      </Column>
    ))}
  </Row>
);

export default NewsCards;
