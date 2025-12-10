/* @license CC0-1.0 */

import { Button, ButtonGroup, Drawer, Heading2, Link } from '@utrecht/component-library-react/dist/css-module';
import React from 'react';
import { getConsentTitle, getDefaultCookieContent, useCookieConsent } from './hooks/useCookieConsent';

export interface CookieConsentDrawerProps {
  buttonAccept?: string;
  buttonReject?: string;
  buttonCustomize?: string;
  customizeHref?: string;
  children?: React.ReactNode;
  clearStorageOnMount?: boolean;
  organization?: string;
  title?: string;
}

/**
 * CookieConsentDrawer React Component
 *
 * This component builds a non-blocking cookie consent drawer using Utrecht React components.
 * It appears at the top of the page and allows users to accept, reject, or customize cookies.
 */
export const CookieConsentDrawer: React.FC<CookieConsentDrawerProps> = ({
  buttonAccept = 'Accepteren',
  buttonCustomize = 'Zelf instellen',
  buttonReject = 'Weigeren',
  children,
  clearStorageOnMount = false,
  customizeHref = '/templates/cookies',
  organization,
  title,
}) => {
  const { handleAccept, handleReject, isVisible } = useCookieConsent({ clearStorageOnMount });

  if (!isVisible) {
    return null;
  }

  const drawerTitle = getConsentTitle(title, organization);
  const defaultContent = getDefaultCookieContent(organization);

  return (
    <Drawer align="block-start" open>
      <Heading2 id="cookie-consent-title" style={{ marginBlockEnd: 'var(--basis-space-block-lg, 1.5rem)' }}>
        {drawerTitle}
      </Heading2>

      <div style={{ marginBlockEnd: 'var(--basis-space-block-xl, 2rem)' }}>{children || defaultContent}</div>

      <form method="dialog">
        <ButtonGroup style={{ marginBlockStart: 'var(--basis-space-block-xl, 2rem)' }}>
          <Button appearance="primary-action-button" onClick={handleAccept} type="submit" value="accept">
            {buttonAccept}
          </Button>

          <Button appearance="secondary-action-button" onClick={handleReject} type="submit" value="reject">
            {buttonReject}
          </Button>

          <Link href={customizeHref}>{buttonCustomize}</Link>
        </ButtonGroup>
      </form>
    </Drawer>
  );
};

export default CookieConsentDrawer;
