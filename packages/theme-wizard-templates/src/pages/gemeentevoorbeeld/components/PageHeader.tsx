import type { FC } from 'react';
import { Heading1, Link, PageContent } from '@utrecht/component-library-react/dist/css-module';
import { Column, Row } from './Layout';

export interface PageHeaderProps {
  title?: string;
  actions?: Array<{ href: string; label: string }>;
}

const DEFAULT_ACTIONS = [
  { href: '#', label: 'Contact' },
  { href: '#', label: 'Mijn Omgeving' },
] as const;

const PageHeaderSection: FC<PageHeaderProps> = ({ actions = DEFAULT_ACTIONS, title = 'Gemeente Voorbeeld' }) => (
  <PageContent>
    <div className="section">
      <Row align="center" justify="space-between">
        <Column cols={6}>
          <Heading1>{title}</Heading1>
        </Column>

        <Column cols={6} className="page-header__actions">
          {actions.map(({ href, label }) => (
            <Link key={`${href}-${label}`} href={href}>
              {label}
            </Link>
          ))}
        </Column>
      </Row>
    </div>
  </PageContent>
);

export default PageHeaderSection;
