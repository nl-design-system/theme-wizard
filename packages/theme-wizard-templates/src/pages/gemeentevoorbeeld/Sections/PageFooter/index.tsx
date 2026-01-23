import { Link } from '@nl-design-system-candidate/link-react/css';
import { LinkList, PageFooter, Image, PageContent } from '@utrecht/component-library-react/dist/css-module';
import React, { type ReactNode } from 'react';
import logo from '../../../../assets/logo.svg';
import { Column, Row } from '../../components/Layout';

export interface PageFooterProps {
  children?: ReactNode;
}

const PageFooterSection = ({ children }: PageFooterProps) => (
  <PageFooter>
    <PageContent className="utrecht-page-footer__content">
      <Row columnGap="var(--basis-space-column-xl)" rowGap="var(--basis-space-column-xl)">
        {children ?? (
          <>
            <Column cols={6}>
              <Link href="/">
                <Image src={typeof logo === 'string' ? logo : logo.src} alt="Gemeente Voorbeeld" />
              </Link>
            </Column>

            <Column cols={3}>
              <LinkList>
                <li>
                  <Link href="#">Contact</Link>
                </li>
                <li>
                  <Link href="#">RSS</Link>
                </li>
              </LinkList>
            </Column>

            <Column cols={3}>
              <LinkList>
                <li>
                  <Link href="#">Bescherming persoonsgegevens</Link>
                </li>
                <li>
                  <Link href="#">Gebruikersvoorwaarden</Link>
                </li>
                <li>
                  <Link href="#">Proclaimer</Link>
                </li>
                <li>
                  <Link href="#">Cookieverklaring</Link>
                </li>
              </LinkList>
            </Column>
          </>
        )}
      </Row>
    </PageContent>
  </PageFooter>
);

export default PageFooterSection;
