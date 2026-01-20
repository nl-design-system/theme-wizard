import { Button } from '@nl-design-system-candidate/button-react/css';
import { Alert, ButtonGroup, Link } from '@utrecht/component-library-react/dist/css-module';
import React, { type FC, useCallback, useState } from 'react';
import type { CookieConsentFormProps, CookieOption, CookieType } from './types';
import { useCookieConsent } from '../hooks/useCookieConsent';
import { CookieOptionList } from './components';
import defaultCookieOptionsData from './defaultCookieOptions.json';
import './styles.css';

const DEFAULT_COOKIE_OPTIONS: CookieOption[] = defaultCookieOptionsData as CookieOption[];

const LABELS = {
  acceptAll: 'Alle cookies accepteren',
  contact: 'Contact',
  privacyPolicy: 'Privacybeleid',
  rejectAll: 'Cookies weigeren',
  save: 'Selectie opslaan',
} as const;

const STATUS_MESSAGES = {
  acceptAll: 'Alle cookies zijn geaccepteerd. Je voorkeuren zijn opgeslagen.',
  rejectAll: 'Alle cookies zijn geweigerd. Alleen noodzakelijke cookies zijn toegestaan.',
  save: 'Je cookievoorkeuren zijn opgeslagen.',
} as const;

/**
 * Get the initial set of selected cookies based on legal basis:
 * - Required cookies: always selected
 * - Legitimate interest cookies: selected by default (opt-out)
 * - Consent cookies: not selected by default (opt-in)
 */
const getInitialSelectedCookies = (options: CookieOption[]): Set<CookieType> => {
  return new Set(
    options.filter((opt) => opt.required || opt.legalBasis === 'legitimate-interest').map((opt) => opt.id),
  );
};

/**
 * CookieConsentForm Component
 *
 * A comprehensive, accessible cookie consent form for a dedicated settings page.
 * Allows users to:
 * - View and select cookie preferences by category
 * - See detailed information about each cookie (via infoSections)
 * - Accept all, reject all, or save custom preferences
 *
 * Supports two legal bases:
 * - Consent: opt-in (checkbox unchecked by default)
 * - Legitimate interest: opt-out (checkbox checked by default)
 *
 * Note: This component is intended for standalone pages (e.g. /cookies),
 * not for use in modals or drawers. For initial consent, use the Drawer pattern.
 *
 * @example
 * ```tsx
 * <CookieConsentForm
 *   customizeLink={{ href: "/privacy", text: "Privacybeleid" }}
 *   infoSections={[
 *     { label: 'Wat zijn cookies?', body: <WhatAreCookiesPanel /> },
 *     { label: 'Cookieverklaring', body: <PolicyPanel /> },
 *   ]}
 *   showLegitimateInterest
 * />
 * ```
 */
export const CookieConsentForm: FC<CookieConsentFormProps> = ({
  buttonAccept = LABELS.acceptAll,
  buttonReject = LABELS.rejectAll,
  buttonSave = LABELS.save,
  clearStorageOnMount = false,
  cookieOptions = DEFAULT_COOKIE_OPTIONS,
  customizeLink,
  infoSections = [],
  showLegitimateInterest = true,
}) => {
  const { savePreferences } = useCookieConsent({ clearStorageOnMount });

  const [selectedCookies, setSelectedCookies] = useState<Set<CookieType>>(() =>
    getInitialSelectedCookies(cookieOptions),
  );
  const [statusMessage, setStatusMessage] = useState('');

  const handleCheckboxChange = useCallback(
    (cookieId: CookieType, checked: boolean) => {
      const option = cookieOptions.find((opt) => opt.id === cookieId);

      // Prevent unchecking required cookies
      if (option?.required) return;

      setSelectedCookies((prev) => {
        const next = new Set(prev);
        if (checked) {
          next.add(cookieId);
        } else {
          next.delete(cookieId);
        }
        return next;
      });
    },
    [cookieOptions],
  );

  const handleAcceptAll = useCallback(() => {
    const allCookieIds = cookieOptions.map((opt) => opt.id);
    savePreferences(allCookieIds);
    setStatusMessage(STATUS_MESSAGES.acceptAll);
  }, [cookieOptions, savePreferences]);

  const handleRejectAll = useCallback(() => {
    const requiredOnly = cookieOptions.filter((opt) => opt.required).map((opt) => opt.id);
    savePreferences(requiredOnly);
    setStatusMessage(STATUS_MESSAGES.rejectAll);
  }, [cookieOptions, savePreferences]);

  const handleSave = useCallback(() => {
    savePreferences(Array.from(selectedCookies));
    setStatusMessage(STATUS_MESSAGES.save);
  }, [selectedCookies, savePreferences]);

  return (
    <section aria-label="Cookie-instellingen" className="clippy-cookie-consent">
      {/* Visible status message for all users */}
      {statusMessage && <Alert type="ok">{statusMessage}</Alert>}

      {/* Screen reader announcement (visually hidden) */}
      <div aria-atomic="true" aria-live="polite" className="ams-visually-hidden">
        {statusMessage}
      </div>

      {customizeLink && (
        <>
          <Link href={customizeLink.href} rel="noopener noreferrer" target="_blank">
            {LABELS.privacyPolicy}
          </Link>

          <span aria-hidden="true">|</span>
          <Link href="/contact">{LABELS.contact}</Link>
        </>
      )}

      <div className="clippy-cookie-settings">
        <CookieOptionList
          cookieOptions={cookieOptions}
          onCheckboxChange={handleCheckboxChange}
          selectedCookies={selectedCookies}
          showLegitimateInterest={showLegitimateInterest}
        />
      </div>

      <ButtonGroup className="clippy-cookie-actions">
        <Button onClick={handleAcceptAll} purpose="secondary" type="button">
          {buttonAccept}
        </Button>

        <Button onClick={handleRejectAll} purpose="secondary" type="button">
          {buttonReject}
        </Button>

        <Button onClick={handleSave} purpose="secondary" type="button">
          {buttonSave}
        </Button>
      </ButtonGroup>

      {infoSections.length > 0 && (
        <div className="clippy-cookie-info-sections">
          {infoSections.map((section, index) => (
            <section key={section.label ?? index} className="clippy-cookie-info-section">
              {section.body}
            </section>
          ))}
        </div>
      )}
    </section>
  );
};

export default CookieConsentForm;
