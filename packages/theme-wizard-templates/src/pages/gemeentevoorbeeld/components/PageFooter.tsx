import { Link, LinkList, LinkListLink, PageContent } from '@utrecht/component-library-react/dist/css-module';
import React, { type FC, type ReactNode } from 'react';
import logo from '../../../assets/logo.svg';
import { Column, Row } from './Layout';

export interface PageFooterProps {
  children?: ReactNode;
}

const PageFooterSection: FC<PageFooterProps> = ({ children }) => (
  <PageContent>
    <div className="section">
      <Row columnGap="var(--basis-space-column-xl)" rowGap="var(--basis-space-column-xl)">
        {children ?? (
          <>
            <Column cols={6}>
              <Link href="/" aria-label="home / logo">
                <img src={typeof logo === 'string' ? logo : logo.src} alt="Gemeente Voorbeeld" />
              </Link>
            </Column>

            <Column cols={3}>
              <LinkList>
                <LinkListLink href="#">Contact</LinkListLink>
                <LinkListLink href="#">RSS</LinkListLink>
              </LinkList>
            </Column>

            <Column cols={3}>
              <LinkList>
                <LinkListLink href="#">Bescherming persoonsgegevens</LinkListLink>
                <LinkListLink href="#">Gebruikersvoorwaarden</LinkListLink>
                <LinkListLink href="#">Proclaimer</LinkListLink>
                <LinkListLink href="#">Cookieverklaring</LinkListLink>
              </LinkList>
            </Column>
          </>
        )}
      </Row>
    </div>
  </PageContent>
);

export default PageFooterSection;
