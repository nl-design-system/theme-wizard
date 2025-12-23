import { Link, PageContent } from '@utrecht/component-library-react/dist/css-module';
import React, { type FC } from 'react';
import logo from '../../../assets/logo.svg';
import { Column, Row } from './Layout';

export interface PageHeaderProps {
  actions?: Array<{ href: string; label: string }>;
}

const DEFAULT_ACTIONS = [
  { href: '#', label: 'Contact' },
  { href: '#', label: 'Mijn Omgeving' },
] as const;

const PageHeaderSection: FC<PageHeaderProps> = ({ actions = DEFAULT_ACTIONS }) => (
  <PageContent>
    <div className="section">
      <Row align="center" justify="space-between">
        <Column cols={6}>
          <Link href="/" aria-label="home / logo">
            <img src={logo.src} alt="Gemeente Voorbeeld" />
          </Link>
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
