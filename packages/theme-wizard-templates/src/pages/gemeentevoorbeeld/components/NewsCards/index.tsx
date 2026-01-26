import { Card, Column as AmsColumn } from '@amsterdam/design-system-react';
import { Heading } from '@nl-design-system-candidate/heading-react';
import { Link } from '@nl-design-system-candidate/link-react';
import { Paragraph } from '@nl-design-system-candidate/paragraph-react';
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
        <Card>
          {card.image && (
            <div style={{ blockSize: '18rem', overflow: 'hidden' }}>
              <Card.Image
                src={getImageSrc(card.image.src)}
                alt={card.image.alt}
                style={{
                  blockSize: '18rem',
                  inlineSize: '100%',
                  objectFit: 'cover',
                  objectPosition: card.image.focalPoint || 'center center',
                  paddingBlockEnd: '1rem',
                }}
              />
            </div>
          )}
          <Card.HeadingGroup tagline="Nieuws">
            <Heading level={3}>
              <Link href={card.href || '#'}>{card.title}</Link>
            </Heading>
          </Card.HeadingGroup>

          <AmsColumn gap="small">
            <Paragraph>{card.body}</Paragraph>
            <Paragraph>
              <time dateTime={card.dateTime}>{card.date}</time>
            </Paragraph>
          </AmsColumn>
        </Card>
      </Column>
    ))}
  </Row>
);

export default NewsCards;
