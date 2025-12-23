import { Link } from '@nl-design-system-candidate/link-react/css';
import { Icon, PageContent, PageHeader, Image } from '@utrecht/component-library-react/dist/css-module';
import { UtrechtIconAlleen } from '@utrecht/web-component-library-react';
import React, { type FC, type ReactNode } from 'react';
import logo from '../../../../assets/logo.svg';
import { Column, Row } from '../../components/Layout';

export interface PageHeaderProps {
  actions?: Array<{ href: string; label: string; icon?: string }>;
  children?: ReactNode;
}

const DEFAULT_ACTIONS = [
  { href: '#', label: 'Contact' },
  { href: '#', icon: 'utrecht-icon-alleen', label: 'Mijn Omgeving' },
] as const;

const PageHeaderSection: FC<PageHeaderProps> = ({ actions = DEFAULT_ACTIONS, children }) => (
  <PageHeader>
    <PageContent>
      <div className="section">
        <Row align="center" justify="space-between">
          {children ?? (
            <>
              <Column cols={6}>
                <Link href="/">
                  <Image src={typeof logo === 'string' ? logo : logo.src} alt="Gemeente Voorbeeld" />
                </Link>
              </Column>

              <Column cols={6} className="page-header__actions">
                {actions.map(({ href, icon, label }) => (
                  <Link key={`${href}-${label}`} className="page-header__action-link" href={href}>
                    {icon && (
                      <Icon>
                        <UtrechtIconAlleen />
                      </Icon>
                    )}
                    {label}
                  </Link>
                ))}
              </Column>
            </>
          )}
        </Row>
      </div>
    </PageContent>
  </PageHeader>
);

export default PageHeaderSection;
