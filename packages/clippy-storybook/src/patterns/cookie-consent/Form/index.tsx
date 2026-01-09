import type { AccordionSectionProps } from '@utrecht/component-library-react';
import {
  AccordionProvider,
  Button,
  ButtonGroup,
  Heading2,
  Link,
} from '@utrecht/component-library-react/dist/css-module';
import React, { type FC, useCallback, useEffect, useMemo, useState } from 'react';
import type { CookieConsentFormProps, CookieOption, CookieType } from './types';
import { useCookieConsent } from '../hooks/useCookieConsent';
import defaultCookieOptionsData from './defaultCookieOptions.json';
import { DataSection, PolicySection, SettingsSection } from './sections';
import './styles.css';

const DEFAULT_COOKIE_OPTIONS: CookieOption[] = defaultCookieOptionsData as CookieOption[];

const LABELS = {
  acceptAll: 'Alle cookies accepteren',
  contact: 'Contact',
  dataTab: 'Mijn gegevens',
  logoAlt: 'Terug naar homepage',
  policyTab: 'Cookieverklaring',
  preferencesSaved: 'Je cookievoorkeuren zijn opgeslagen.',
  privacyPolicy: 'Privacybeleid',
  rejectAll: 'Geen cookies',
  save: 'Selectie opslaan',
  settingsTab: 'Instellingen',
} as const;

/**
 * CookieConsentForm Component
 *
 * A comprehensive, accessible cookie consent form that allows users to:
 * - View and select cookie preferences by category
 * - See detailed information about each cookie
 * - Accept all, reject all, or save custom preferences
 *
 * @example
 * ```tsx
 * <CookieConsentForm
 *   title="Cookie-instellingen"
 *   customizeLink={{ href: "/privacy", text: "Privacybeleid" }}
 * />
 * ```
 */
export const CookieConsentForm: FC<CookieConsentFormProps> = ({
  buttonAccept = LABELS.acceptAll,
  buttonReject = LABELS.rejectAll,
  buttonSave = LABELS.save,
  children,
  clearStorageOnMount = false,
  cookieOptions = DEFAULT_COOKIE_OPTIONS,
  customizeLink,
  showLogo,
  title,
}) => {
  const { isVisible: hookIsVisible, savePreferences } = useCookieConsent({ clearStorageOnMount });

  const [isVisible, setIsVisible] = useState(hookIsVisible);
  const [statusMessage, setStatusMessage] = useState('');
  const [selectedCookies, setSelectedCookies] = useState<Set<CookieType>>(
    () => new Set(cookieOptions.filter((opt) => opt.required).map((opt) => opt.id)),
  );

  // Sync visibility with hook
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

  const handleSubmit = useCallback(
    (event: React.FormEvent) => {
      event.preventDefault();
      handleSave();
    },
    [handleSave],
  );

  const accordionSections: AccordionSectionProps[] = useMemo(
    () => [
      {
        body: (
          <SettingsSection
            cookieOptions={cookieOptions}
            onCheckboxChange={handleCheckboxChange}
            selectedCookies={selectedCookies}
          >
            {children}
          </SettingsSection>
        ),
        expanded: true,
        label: LABELS.settingsTab,
      },
      {
        body: <PolicySection privacyPolicyUrl={customizeLink?.href} />,
        label: LABELS.policyTab,
      },
      {
        body: <DataSection cookieOptions={cookieOptions} selectedCookies={selectedCookies} />,
        label: LABELS.dataTab,
      },
    ],
    [children, cookieOptions, customizeLink?.href, handleCheckboxChange, selectedCookies],
  );

  if (!isVisible) {
    return null;
  }

  return (
    <section aria-labelledby="cookie-consent-title" className="utrecht-cookie-consent">
      {/* Live region for screen reader announcements */}
      <div aria-live="polite" aria-atomic="true" className="utrecht-cookie-consent__status">
        {statusMessage}
      </div>

      {showLogo && (
        <div className="utrecht-cookie-consent__logo">
          <Link href="/">
            <img
              alt={LABELS.logoAlt}
              className="utrecht-cookie-consent__logo-image"
              src="/src/patterns/cookie-consent/assets/logo.svg"
            />
          </Link>
        </div>
      )}

      <div className="utrecht-cookie-consent__header">
        {title && (
          <Heading2 className="utrecht-cookie-consent__title" id="cookie-consent-title">
            {title}
          </Heading2>
        )}

        {customizeLink && (
          <div className="utrecht-cookie-consent__header-links">
            <Link href={customizeLink.href} rel="noopener noreferrer" target="_blank">
              {LABELS.privacyPolicy}
            </Link>
            <span aria-hidden="true">|</span>
            <Link href="/contact">{LABELS.contact}</Link>
          </div>
        )}
      </div>

      <AccordionProvider headingLevel={2} sections={accordionSections} />

      <div className="utrecht-cookie-consent__footer">
        <form onSubmit={handleSubmit}>
          <ButtonGroup>
            <Button appearance="secondary-action-button" onClick={handleAcceptAll} type="button">
              {buttonAccept}
            </Button>
            <Button appearance="secondary-action-button" onClick={handleRejectAll} type="button">
              {buttonReject}
            </Button>
            <Button appearance="primary-action-button" type="submit">
              {buttonSave}
            </Button>
          </ButtonGroup>
        </form>
      </div>
    </section>
  );
};

export default CookieConsentForm;
