import type { AccordionSectionProps } from '@utrecht/component-library-react';
import { Button } from '@nl-design-system-candidate/button-react/css';
import { AccordionProvider, ButtonGroup, Link } from '@utrecht/component-library-react/dist/css-module';
import React, { type FC, useCallback, useEffect, useMemo, useState } from 'react';
import type { CookieConsentFormProps, CookieOption, CookieType } from './types';
import { useCookieConsent } from '../hooks/useCookieConsent';
import { CookieOptionList } from './components';
import defaultCookieOptionsData from './defaultCookieOptions.json';
import './styles.css';

const DEFAULT_COOKIE_OPTIONS: CookieOption[] = defaultCookieOptionsData as CookieOption[];

const LABELS = {
  acceptAll: 'Alle cookies accepteren',
  contact: 'Contact',
  preferencesSaved: 'Je cookievoorkeuren zijn opgeslagen.',
  privacyPolicy: 'Privacybeleid',
  rejectAll: 'Cookies weigeren',
  save: 'Selectie opslaan',
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
 * A comprehensive, accessible cookie consent form that allows users to:
 * - View and select cookie preferences by category
 * - See detailed information about each cookie (via infoSections)
 * - Accept all, reject all, or save custom preferences
 *
 * Supports two legal bases:
 * - Consent: opt-in (checkbox unchecked by default)
 * - Legitimate interest: opt-out (checkbox checked by default)
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
  const { isVisible: hookIsVisible, savePreferences } = useCookieConsent({ clearStorageOnMount });

  const [isVisible, setIsVisible] = useState(hookIsVisible);
  const [statusMessage, setStatusMessage] = useState('');
  const [selectedCookies, setSelectedCookies] = useState<Set<CookieType>>(() =>
    getInitialSelectedCookies(cookieOptions),
  );

  useEffect(() => {
    setIsVisible(hookIsVisible);
  }, [hookIsVisible]);

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

  const handleSaveAndClose = useCallback(
    (preferences: CookieType[]) => {
      savePreferences(preferences);
      setStatusMessage(LABELS.preferencesSaved);
      setIsVisible(false);
    },
    [savePreferences],
  );

  const handleAcceptAll = useCallback(() => {
    const allCookieIds = cookieOptions.map((opt) => opt.id);
    handleSaveAndClose(allCookieIds);
  }, [cookieOptions, handleSaveAndClose]);

  const handleRejectAll = useCallback(() => {
    const requiredOnly = cookieOptions.filter((opt) => opt.required).map((opt) => opt.id);
    handleSaveAndClose(requiredOnly);
  }, [cookieOptions, handleSaveAndClose]);

  const handleSave = useCallback(() => {
    handleSaveAndClose(Array.from(selectedCookies));
  }, [selectedCookies, handleSaveAndClose]);

  const infoAccordionSections: AccordionSectionProps[] = useMemo(
    () =>
      infoSections.map((section) => ({
        body: section.body,
        expanded: section.expanded,
        label: section.label,
      })),
    [infoSections],
  );

  if (!isVisible) {
    return null;
  }

  return (
    <section aria-label="Cookie-instellingen" className="utrecht-cookie-consent">
      {/* Live region for screen reader announcements */}
      <div aria-atomic="true" aria-live="polite" className="utrecht-cookie-consent__status">
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

      <div className="utrecht-cookie-settings">
        <CookieOptionList
          cookieOptions={cookieOptions}
          onCheckboxChange={handleCheckboxChange}
          selectedCookies={selectedCookies}
          showLegitimateInterest={showLegitimateInterest}
        />
      </div>

      <ButtonGroup className="utrecht-cookie-actions">
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

      <AccordionProvider headingLevel={2} sections={infoAccordionSections} />
    </section>
  );
};

export default CookieConsentForm;
