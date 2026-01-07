import type { AccordionSectionProps } from '@utrecht/component-library-react';
import {
  AccordionProvider,
  Button,
  ButtonGroup,
  DataList,
  DataListItem,
  DataListKey,
  DataListValue,
  Fieldset,
  FieldsetLegend,
  FormFieldCheckbox,
  Heading2,
  Link,
  Paragraph,
} from '@utrecht/component-library-react/dist/css-module';
import React, { FC, useCallback, useMemo, useState } from 'react';
import { useCookieConsent } from '../hooks/useCookieConsent';
import defaultCookieOptionsData from './defaultCookieOptions.json';
import { CookieConsentFormProps, CookieOption, CookieType } from './types';
import './styles.css';

const DEFAULT_COOKIE_OPTIONS: CookieOption[] = defaultCookieOptionsData as CookieOption[];

/**
 * CookieConsentForm React Component
 *
 * This component builds a non-blocking cookie consent form with checkboxes
 * allowing users to select which cookie types to accept.
 */
export const CookieConsentForm: FC<CookieConsentFormProps> = ({
  buttonAccept = 'Alle cookies accepteren',
  buttonReject = 'Geen cookies',
  buttonSave = 'Selectie opslaan',
  children,
  clearStorageOnMount = false,
  cookieOptions = DEFAULT_COOKIE_OPTIONS,
  customizeLink,
  showLogo,
  title,
}) => {
  const { isVisible: hookIsVisible, savePreferences } = useCookieConsent({ clearStorageOnMount });
  const [isVisible, setIsVisible] = useState(hookIsVisible);
  const [selectedCookies, setSelectedCookies] = useState<Set<CookieType>>(
    new Set(cookieOptions.filter((opt) => opt.required).map((opt) => opt.id)),
  );
  const [expandedCookieDetails, setExpandedCookieDetails] = useState<Set<CookieType>>(new Set());

  const handleCheckboxChange = useCallback(
    (cookieId: CookieType, checked: boolean) => {
      const option = cookieOptions.find((opt) => opt.id === cookieId);
      if (option?.required) {
        return; // Don't allow unchecking required cookies
      }

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

  const handleAcceptAll = () => {
    const allCookieIds = cookieOptions.map((opt) => opt.id);
    savePreferences(allCookieIds);
    setIsVisible(false);
  };

  const handleRejectAll = () => {
    const requiredOnly = cookieOptions.filter((opt) => opt.required).map((opt) => opt.id);
    savePreferences(requiredOnly);
    setIsVisible(false);
  };

  const handleSave = () => {
    savePreferences(Array.from(selectedCookies));
    setIsVisible(false);
  };

  const toggleCookieDetails = useCallback((cookieId: CookieType) => {
    setExpandedCookieDetails((prev) => {
      const next = new Set(prev);
      if (next.has(cookieId)) {
        next.delete(cookieId);
      } else {
        next.add(cookieId);
      }
      return next;
    });
  }, []);

  const accordionSections: AccordionSectionProps[] = useMemo(() => {
    const settingsBody = (
      <>
        <div
          style={{
            marginBlockEnd: 'var(--basis-space-block-xl, 2rem)',
            maxHeight: '200px',
            overflowY: 'auto',
          }}
        >
          {children || (
            <Paragraph>
              Wij willen graag uw toestemming om uw gegevens te gebruiken voor de volgende doeleinden:
            </Paragraph>
          )}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            savePreferences(Array.from(selectedCookies));
            setIsVisible(false);
          }}
        >
          <Fieldset style={{ marginBlockEnd: 'var(--basis-space-block-xl, 2rem)' }}>
            <FieldsetLegend>
              <strong>Kies welke cookies je wilt accepteren:</strong>
            </FieldsetLegend>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--basis-space-block-md, 1rem)' }}>
              {cookieOptions.map((option) => {
                const isExpanded = expandedCookieDetails.has(option.id);
                const hasCookies = option.cookies && option.cookies.length > 0;
                const cookieCount = option.cookies?.length || 0;
                const labelWithCount = `${option.label} (${cookieCount})`;
                const accessibleLabel = `${option.label}, ${cookieCount} ${cookieCount === 1 ? 'cookie' : 'cookies'}`;

                return (
                  <div
                    key={option.id}
                    style={{
                      border: '1px solid var(--utrecht-color-border, #ccc)',
                      borderRadius: '4px',
                      overflow: 'hidden',
                    }}
                  >
                    <div style={{ padding: 'var(--basis-space-block-md, 1rem)' }}>
                      <div
                        style={{
                          alignItems: 'flex-start',
                          display: 'flex',
                          gap: 'var(--basis-space-inline-sm, 0.5rem)',
                          justifyContent: 'space-between',
                        }}
                      >
                        <div style={{ flex: 1 }}>
                          <FormFieldCheckbox
                            aria-label={accessibleLabel}
                            defaultChecked={selectedCookies.has(option.id)}
                            description={option.description}
                            disabled={option.required}
                            id={`cookie-option-${option.id}`}
                            label={labelWithCount}
                            name={`cookie-option-${option.id}`}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                              handleCheckboxChange(option.id, e.target.checked);
                            }}
                            required={option.required}
                            value={option.id}
                          />
                        </div>
                        {hasCookies && (
                          <button
                            aria-expanded={isExpanded}
                            aria-label={`${isExpanded ? 'Verberg' : 'Toon'} cookie details voor ${option.label} (${cookieCount} ${cookieCount === 1 ? 'cookie' : 'cookies'})`}
                            onClick={() => toggleCookieDetails(option.id)}
                            style={{
                              appearance: 'none',
                              backgroundColor: 'transparent',
                              border: 'none',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              flexShrink: 0,
                              padding: '0.25rem',
                            }}
                            type="button"
                          >
                            <span
                              style={{
                                display: 'inline-block',
                                rotate: isExpanded ? '180deg' : '0deg',
                                transition: 'rotate 0.2s ease',
                              }}
                            >
                              ▼
                            </span>
                          </button>
                        )}
                      </div>
                    </div>
                    {hasCookies && isExpanded && option.cookies && (
                      <div
                        style={{
                          backgroundColor: 'var(--utrecht-color-background-alt, #f4f4f4)',
                          borderTop: '1px solid var(--utrecht-color-border, #ccc)',
                          padding: 'var(--basis-space-block-md, 1rem)',
                        }}
                      >
                        <div
                          style={{
                            display: 'grid',
                            gap: 'var(--basis-space-inline-md, 1rem)',
                            gridTemplateColumns: '1fr 2fr',
                          }}
                        >
                          <DataList appearance="rows">
                            <DataListItem>
                              <DataListKey>Cookie</DataListKey>
                            </DataListItem>
                          </DataList>
                          <DataList appearance="rows">
                            <DataListItem>
                              <DataListKey>Details</DataListKey>
                            </DataListItem>
                          </DataList>
                        </div>
                        {option.cookies.map((cookie) => (
                          <div
                            key={cookie.name}
                            style={{
                              alignItems: 'flex-start',
                              display: 'grid',
                              gap: 'var(--basis-space-inline-md, 1rem)',
                              gridTemplateColumns: '1fr 2fr',
                              paddingBlockStart: 'var(--basis-space-block-md, 1rem)',
                            }}
                          >
                            <div style={{ height: '100%' }}>
                              <DataList appearance="rows" style={{ height: '100%' }}>
                                <DataListItem style={{ height: '100%', padding: '0' }}>
                                  <DataListValue>{cookie.name}</DataListValue>
                                </DataListItem>
                              </DataList>
                            </div>
                            <div>
                              <DataList appearance="rows">
                                <DataListItem>
                                  <DataListKey>Cookie type</DataListKey>
                                  <DataListValue>
                                    {cookie.type === 'local-storage'
                                      ? 'Lokale HTML opslag'
                                      : cookie.type === 'session-storage'
                                        ? 'Sessie opslag'
                                        : 'HTTP cookie'}
                                  </DataListValue>
                                </DataListItem>
                                <DataListItem>
                                  <DataListKey>Looptijd</DataListKey>
                                  <DataListValue>{cookie.duration}</DataListValue>
                                </DataListItem>
                                <DataListItem>
                                  <DataListKey>Beschrijving</DataListKey>
                                  <DataListValue>{cookie.description}</DataListValue>
                                </DataListItem>
                              </DataList>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </Fieldset>
        </form>
      </>
    );

    const policyBody = (
      <>
        <Heading2 style={{ fontSize: '1.5rem', marginBlockEnd: 'var(--basis-space-block-md, 1rem)' }}>
          Cookieverklaring
        </Heading2>
        <Paragraph style={{ marginBlockEnd: 'var(--basis-space-block-md, 1rem)' }}>
          Op deze website gebruiken wij cookies en vergelijkbare technieken. Cookies zijn kleine tekstbestanden die door
          een internetpagina op een pc, tablet of mobiele telefoon worden geplaatst.
        </Paragraph>
        <Paragraph style={{ marginBlockEnd: 'var(--basis-space-block-md, 1rem)' }}>Wij gebruiken cookies om:</Paragraph>
        <ul style={{ marginBlockEnd: 'var(--basis-space-block-md, 1rem)', paddingInlineStart: '1.5rem' }}>
          <li>de functionaliteit van de website te garanderen;</li>
          <li>de website te verbeteren en te analyseren;</li>
          <li>voorkeuren te onthouden;</li>
          <li>relevante content en advertenties te tonen.</li>
        </ul>
        <Paragraph style={{ marginBlockEnd: 'var(--basis-space-block-md, 1rem)' }}>
          Je kunt zelf kiezen welke cookies je accepteert. Je kunt je keuze altijd weer aanpassen via de
          cookie-instellingen.
        </Paragraph>
        {customizeLink && (
          <Paragraph>
            <Link href={customizeLink.href} target="_blank" rel="noopener noreferrer">
              Lees meer in ons privacybeleid
            </Link>
          </Paragraph>
        )}
      </>
    );

    const dataBody = (
      <>
        <Heading2 style={{ fontSize: '1.5rem', marginBlockEnd: 'var(--basis-space-block-md, 1rem)' }}>
          Mijn gegevens
        </Heading2>
        <Paragraph style={{ marginBlockEnd: 'var(--basis-space-block-md, 1rem)' }}>
          Je hebt het recht om je gegevens in te zien, te corrigeren, te verwijderen of over te dragen. Ook kun je
          bezwaar maken tegen het gebruik van je gegevens.
        </Paragraph>
        <Paragraph style={{ marginBlockEnd: 'var(--basis-space-block-md, 1rem)' }}>
          Je huidige cookievoorkeuren:
        </Paragraph>
        <div
          style={{
            background: 'var(--utrecht-color-background-alt, #f5f5f5)',
            border: '1px solid var(--utrecht-color-border, #ccc)',
            borderRadius: '4px',
            marginBlockEnd: 'var(--basis-space-block-md, 1rem)',
            padding: 'var(--basis-space-block-md, 1rem)',
          }}
        >
          <ul style={{ margin: 0, paddingInlineStart: '1.5rem' }}>
            {cookieOptions.map((option) => (
              <li key={option.id} style={{ marginBlockEnd: '0.5rem' }}>
                {option.label}: {selectedCookies.has(option.id) ? 'Geaccepteerd' : 'Geweigerd'}
              </li>
            ))}
          </ul>
        </div>
        <Paragraph style={{ marginBlockEnd: 'var(--basis-space-block-md, 1rem)' }}>
          Om je cookievoorkeuren te wijzigen, ga naar het tabblad &quot;Instellingen&quot;.
        </Paragraph>
        <Paragraph>
          Voor vragen over je privacyrechten kun je contact opnemen via{' '}
          <Link href="mailto:privacy@example.nl">privacy@example.nl</Link>
        </Paragraph>
      </>
    );

    return [
      {
        body: settingsBody,
        expanded: true,
        label: 'Instellingen',
      },
      {
        body: policyBody,
        label: 'Cookieverklaring',
      },
      {
        body: dataBody,
        label: 'Mijn gegevens',
      },
    ];
  }, [
    children,
    cookieOptions,
    selectedCookies,
    Array.from(expandedCookieDetails).join(','),
    customizeLink,
    savePreferences,
    setIsVisible,
    handleCheckboxChange,
    toggleCookieDetails,
  ]);

  // Sync with hook visibility
  React.useEffect(() => {
    setIsVisible(hookIsVisible);
  }, [hookIsVisible]);

  if (!isVisible) {
    return null;
  }

  return (
    <section
      aria-labelledby="cookie-consent-title"
      style={{
        marginInline: 'auto',
        maxWidth: '48rem',
        padding: 'var(--basis-space-block-xl, 2rem) 1.5rem',
      }}
    >
      {showLogo && (
        <div style={{ marginBlockEnd: 'var(--basis-space-block-lg, 1.5rem)' }}>
          <Link href="#" style={{ display: 'inline-block', textDecoration: 'none' }}>
            <img
              src="/src/patterns/cookie-consent/assets/logo.svg"
              alt="Organisatie logo"
              style={{ maxHeight: '50px', width: 'auto' }}
            />
          </Link>
        </div>
      )}

      <div
        style={{
          alignItems: 'flex-start',
          display: 'flex',
          flexWrap: 'wrap',
          gap: 'var(--basis-space-block-md, 1rem)',
          justifyContent: 'space-between',
          marginBlockEnd: 'var(--basis-space-block-lg, 1.5rem)',
        }}
      >
        {title && (
          <Heading2 id="cookie-consent-title" style={{ margin: 0 }}>
            {title}
          </Heading2>
        )}
        <div style={{ alignItems: 'center', display: 'flex', gap: 'var(--basis-space-inline-sm, 0.5rem)' }}>
          {customizeLink && (
            <>
              <Link href={customizeLink.href} target="_blank" rel="noopener noreferrer">
                Privacybeleid
              </Link>
              <span>|</span>
              <Link href="#" target="_blank" rel="noopener noreferrer">
                Contact
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Accordion */}
      <AccordionProvider
        key={Array.from(expandedCookieDetails).join(',')}
        sections={accordionSections}
        headingLevel={2}
      />

      {/* Footer Actions */}
      <div
        style={{
          borderTop: '1px solid var(--utrecht-color-border, #ccc)',
          marginBlockStart: 'var(--basis-space-block-lg, 1.5rem)',
          paddingBlockStart: 'var(--basis-space-block-lg, 1.5rem)',
        }}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
        >
          <ButtonGroup>
            <Button appearance="secondary-action-button" onClick={handleAcceptAll} type="button">
              {buttonAccept}
            </Button>
            <Button appearance="secondary-action-button" onClick={handleRejectAll} type="button">
              {buttonReject}
            </Button>
            <Button appearance="secondary-action-button" type="submit">
              {buttonSave}
            </Button>
          </ButtonGroup>
        </form>
      </div>
    </section>
  );
};

export default CookieConsentForm;
