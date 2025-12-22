import type { FC } from 'react';
import { Heading3, LinkList, LinkListLink, PageContent } from '@utrecht/component-library-react/dist/css-module';
import { Column, Row } from './Layout';

export interface FooterLink {
  href: string;
  label: string;
}

export interface FooterColumn {
  heading?: string;
  links: FooterLink[];
}

export interface PageFooterProps {
  columns?: FooterColumn[];
}

const DEFAULT_COLUMNS: FooterColumn[] = [
  {
    heading: 'Footer',
    links: [],
  },
  {
    links: [
      { href: '#', label: 'Contact' },
      { href: '#', label: 'RSS' },
    ],
  },
  {
    links: [
      { href: '#', label: 'Bescherming persoonsgegevens' },
      { href: '#', label: 'Gebruikersvoorwaarden' },
      { href: '#', label: 'Proclaimer' },
      { href: '#', label: 'Cookieverklaring' },
    ],
  },
];

const PageFooterSection: FC<PageFooterProps> = ({ columns = DEFAULT_COLUMNS }) => (
  <PageContent>
    <div className="section">
      <Row columnGap="var(--basis-space-column-xl)" rowGap="var(--basis-space-column-xl)">
        {columns.map((column, index) => {
          const isFirstColumn = index === 0;
          const columnKey = column.heading ?? `column-${index}`;

          return (
            <Column key={columnKey} cols={isFirstColumn ? 6 : 3}>
              {column.heading && <Heading3>{column.heading}</Heading3>}

              {column.links.length > 0 && (
                <LinkList>
                  {column.links.map((link) => (
                    <LinkListLink key={`${link.href}-${link.label}`} href={link.href}>
                      {link.label}
                    </LinkListLink>
                  ))}
                </LinkList>
              )}
            </Column>
          );
        })}
      </Row>
    </div>
  </PageContent>
);

export default PageFooterSection;
