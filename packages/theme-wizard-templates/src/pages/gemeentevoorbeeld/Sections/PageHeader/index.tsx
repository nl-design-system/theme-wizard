import { Link } from '@nl-design-system-candidate/link-react/css';
import { IconUser } from '@tabler/icons-react';
import { Icon, PageHeader, PageContent, Image } from '@utrecht/component-library-react/dist/css-module';
import React, { type ReactNode, type PropsWithChildren } from 'react';
import logo from '../../../../assets/logo.svg';
import { Column, Row } from '../../components/Layout';

export interface PageHeaderProps {
  actions?: Array<{ href: string; label: string; icon?: string }>;
  children?: ReactNode;
}

const DEFAULT_ACTIONS = [{ href: '#', icon: 'utrecht-icon-alleen', label: 'Mijn Omgeving' }];

const PageHeaderSection = ({ actions = DEFAULT_ACTIONS, children }: PropsWithChildren<PageHeaderProps>) => (
  <PageHeader>
    <PageContent className="utrecht-page-header__content">
      <Row align="center" justify="space-between">
        {children ?? (
          <>
            <Column cols={6}>
              <Link href="/">
                <Image src={typeof logo === 'string' ? logo : logo.src} alt="Gemeente Voorbeeld" />
              </Link>
            </Column>

            <Column cols={6} className="clippy-page-header__actions">
              {actions.map(({ href, icon, label }) => (
                <Link key={`${href}-${label}`} className="clippy-page-header__action-link" href={href}>
                  {icon && (
                    <Icon>
                      <IconUser />
                    </Icon>
                  )}
                  {label}
                </Link>
              ))}
            </Column>
          </>
        )}
      </Row>
    </PageContent>
  </PageHeader>
);

export default PageHeaderSection;
