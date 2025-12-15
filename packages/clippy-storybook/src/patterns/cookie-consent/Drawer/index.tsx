/* @license CC0-1.0 */

import { Button, ButtonGroup, Drawer, Heading2, Link } from '@utrecht/component-library-react/dist/css-module';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, { FC } from 'react';
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
  title,
}) => {
  const { handleAccept, handleReject, isVisible } = useCookieConsent({ clearStorageOnMount });

  if (!isVisible) {
    return null;
  }

  return (
    <Drawer align="block-start" open style={{ position: 'static' }}>
      {title && (
        <Heading2 id="cookie-consent-title" style={{ marginBlockEnd: 'var(--basis-space-block-lg, 1.5rem)' }}>
          {title}
        </Heading2>
      )}

      <div style={{ marginBlockEnd: 'var(--basis-space-block-xl, 2rem)' }}>{children}</div>

      <form method="dialog">
        <ButtonGroup style={{ marginBlockStart: 'var(--basis-space-block-xl, 2rem)' }}>
          <Button appearance="primary-action-button" onClick={handleAccept} type="submit" value="accept">
            {buttonAccept}
          </Button>

          <Button appearance="primary-action-button" onClick={handleReject} type="submit" value="reject">
            {buttonReject}
          </Button>

          <Link href={customizeLink.href}>{customizeLink.text}</Link>
        </ButtonGroup>
      </form>
    </Drawer>
  );
};

export default CookieConsentDrawer;
