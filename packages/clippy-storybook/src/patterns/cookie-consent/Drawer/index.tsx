/* @license CC0-1.0 */

import { Button } from '@nl-design-system-candidate/button-react';
import { Heading } from '@nl-design-system-candidate/heading-react';
import { ButtonGroup, Drawer, Link } from '@utrecht/component-library-react/dist/css-module';
import React, { FC } from 'react';
import logo from '../assets/logo.svg';
import { useCookieConsent } from '../hooks/useCookieConsent';
import { CookieConsentDrawerProps } from './types';

/**
 * CookieConsentDrawer React Component
 *
 * This component builds a non-blocking cookie consent drawer using Utrecht React components.
 * It appears at the top of the page and allows users to accept, reject, or customize cookies.
 */
export const CookieConsentDrawer: FC<CookieConsentDrawerProps> = ({
  buttonAccept = 'Aanvullende cookies accepteren',
  buttonReject = 'Aanvullende cookies weigeren',
  children,
  clearStorageOnMount = false,
  customizeLink = {
    href: '/templates/cookies',
    text: 'Zelf instellen',
  },
  showLogo,
  title,
}) => {
  const { handleAccept, handleReject, isVisible } = useCookieConsent({ clearStorageOnMount });

  if (!isVisible) {
    return null;
  }

  return (
    <Drawer align="block-start" open style={{ position: 'static' }}>
      {showLogo && (
        <div style={{ marginBlockEnd: 'var(--basis-space-block-lg, 1.5rem)' }}>
          <Link href="#" style={{ display: 'inline-block', textDecoration: 'none' }}>
            <img
              src={logo}
              alt="Organisatie logo"
              style={{ maxHeight: '50px', width: 'auto' }}
            />
          </Link>
        </div>
      )}

      {title && (
        <Heading level={2} id="cookie-consent-title" style={{ marginBlockEnd: 'var(--basis-space-block-lg, 1.5rem)' }}>
          {title}
        </Heading>
      )}

      <div
        style={{
          marginBlockEnd: 'var(--basis-space-block-xl, 2rem)',
          maxHeight: '200px',
          overflowY: 'auto',
        }}
      >
        {children}
      </div>

      <form method="dialog">
        <ButtonGroup style={{ marginBlockStart: 'var(--basis-space-block-xl, 2rem)' }}>
          <Button onClick={handleAccept} purpose="secondary" type="submit" value="accept">
            {buttonAccept}
          </Button>

          <Button onClick={handleReject} purpose="secondary" type="submit" value="reject">
            {buttonReject}
          </Button>

          <Link href={customizeLink.href}>{customizeLink.text}</Link>
        </ButtonGroup>
      </form>
    </Drawer>
  );
};

export default CookieConsentDrawer;
