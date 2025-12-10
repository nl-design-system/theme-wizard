/* @license CC0-1.0 */

import { Button, ButtonGroup, Heading1, Heading2, Paragraph } from '@utrecht/component-library-react/dist/css-module';
import React, { useEffect, useRef, useState } from 'react';

export interface CookieConsentModalProps {
  /**
   * Clear localStorage on mount to force modal to show
   */
  clearStorageOnMount?: boolean;
  /**
   * Organization name to personalize the modal
   */
  organization?: string;
}

const STORAGE_KEY = 'cookie-consent-preferences';

/**
 * CookieConsentModal React Component
 *
 * This component builds a cookie consent modal using Utrecht React components.
 * It provides a simple view with accept/reject options and a detailed view for customization.
 */
export const CookieConsentModal: React.FC<CookieConsentModalProps> = ({
  clearStorageOnMount = false,
  organization,
}) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [showDetailedView, setShowDetailedView] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [preferences, setPreferences] = useState({
    analytics: false,
    preferences: false,
  });

  useEffect(() => {
    if (clearStorageOnMount && globalThis.window !== undefined && globalThis.localStorage) {
      globalThis.localStorage.removeItem(STORAGE_KEY);
    }

    // Check if user has already made a choice
    let timer: ReturnType<typeof setTimeout> | null = null;
    try {
      const saved = globalThis.localStorage?.getItem(STORAGE_KEY);
      if (saved) {
        setIsVisible(false);
        return () => {
          // No cleanup needed
        };
      }
    } catch {
      // localStorage not available
    }

    setIsVisible(true);

    // Show modal after a short delay to ensure the element is mounted
    timer = setTimeout(() => {
      if (dialogRef.current) {
        dialogRef.current.showModal();
      }
    }, 100);

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [clearStorageOnMount]);

  const savePreferences = (prefs: string[]) => {
    try {
      globalThis.localStorage?.setItem(
        STORAGE_KEY,
        JSON.stringify({
          preferences: prefs,
          timestamp: new Date().toISOString(),
        }),
      );
    } catch {
      // localStorage not available
    }
  };

  const handleAccept = () => {
    savePreferences(['analytics', 'preferences']);
    setIsVisible(false);
    dialogRef.current?.close();
  };

  const handleReject = () => {
    savePreferences([]);
    setIsVisible(false);
    dialogRef.current?.close();
  };

  const handleCustomize = () => {
    setShowDetailedView(true);
  };

  const handleBack = () => {
    setShowDetailedView(false);
  };

  const handleSaveCustom = () => {
    const prefs: string[] = [];
    if (preferences.analytics) prefs.push('analytics');
    if (preferences.preferences) prefs.push('preferences');
    savePreferences(prefs);
    setIsVisible(false);
    dialogRef.current?.close();
  };

  if (!isVisible) {
    return null;
  }

  const title = organization ? `Cookies op de website van ${organization}` : 'Cookies op deze website';

  const introFirstParagraph = organization
    ? `${organization} gebruikt enkele essentiële cookies om deze website goed te laten werken.`
    : 'We gebruiken enkele essentiële cookies om deze website goed te laten werken.';

  return (
    <>
      <style>
        {`
          dialog::backdrop {
            background: rgba(0, 0, 0, 0.5);
          }
          dialog[open] {
            display: block;
          }
        `}
      </style>
      <dialog
        ref={dialogRef}
        style={{
          border: '1px solid #ccc',
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          margin: 'auto',
          maxHeight: '90vh',
          maxWidth: '40rem',
          overflowY: 'auto',
          padding: 'var(--basis-space-block-xl, 2rem)',
        }}
      >
        {showDetailedView ? (
          <div>
            <Heading2 style={{ marginBlockEnd: 'var(--basis-space-block-lg, 1.5rem)' }}>Cookie-instellingen</Heading2>

            <div style={{ marginBlockEnd: 'var(--basis-space-block-xl, 2rem)' }}>
              <Paragraph>
                Je kunt zelf kiezen welke soorten optionele cookies je toestaat. We gebruiken een cookie om je
                instellingen op te slaan.
              </Paragraph>
            </div>

            <fieldset
              style={{
                border: 'none',
                margin: 0,
                marginBlockEnd: 'var(--basis-space-block-xl, 2rem)',
                padding: 0,
              }}
            >
              <legend
                style={{
                  fontWeight: 'bold',
                  marginBlockEnd: 'var(--basis-space-block-md, 1rem)',
                }}
              >
                Cookie voorkeuren
              </legend>

              <div style={{ marginBlockEnd: 'var(--basis-space-block-md, 1rem)' }}>
                <label>
                  <input
                    type="radio"
                    name="cookie-preference"
                    value="all"
                    checked={preferences.analytics && preferences.preferences}
                    onChange={() => setPreferences({ analytics: true, preferences: true })}
                    style={{ marginInlineEnd: '0.5rem' }}
                  />{' '}
                  Alle cookies accepteren
                </label>
              </div>

              <div style={{ marginBlockEnd: 'var(--basis-space-block-md, 1rem)' }}>
                <label>
                  <input
                    type="radio"
                    name="cookie-preference"
                    value="essential"
                    checked={!preferences.analytics && !preferences.preferences}
                    onChange={() => setPreferences({ analytics: false, preferences: false })}
                    style={{ marginInlineEnd: '0.5rem' }}
                  />{' '}
                  Alleen essentiële cookies
                </label>
              </div>

              <div>
                <label>
                  <input
                    type="radio"
                    name="cookie-preference"
                    value="custom"
                    checked={
                      (preferences.analytics && !preferences.preferences) ||
                      (!preferences.analytics && preferences.preferences)
                    }
                    onChange={() => {}}
                    style={{ marginInlineEnd: '0.5rem' }}
                  />{' '}
                  Aangepast
                </label>

                {((preferences.analytics && !preferences.preferences) ||
                  (!preferences.analytics && preferences.preferences)) && (
                  <div
                    style={{
                      marginBlockStart: 'var(--basis-space-block-sm, 0.5rem)',
                      marginInlineStart: '1.5rem',
                    }}
                  >
                    <div style={{ marginBlockEnd: 'var(--basis-space-block-sm, 0.5rem)' }}>
                      <label>
                        <input
                          type="checkbox"
                          checked={preferences.analytics}
                          onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
                          style={{ marginInlineEnd: '0.5rem' }}
                        />{' '}
                        Analytics cookies
                      </label>
                    </div>
                    <div>
                      <label>
                        <input
                          type="checkbox"
                          checked={preferences.preferences}
                          onChange={(e) => setPreferences({ ...preferences, preferences: e.target.checked })}
                          style={{ marginInlineEnd: '0.5rem' }}
                        />{' '}
                        Voorkeuren cookies
                      </label>
                    </div>
                  </div>
                )}
              </div>
            </fieldset>

            <ButtonGroup>
              <Button appearance="primary-action-button" onClick={handleSaveCustom}>
                Opslaan
              </Button>
              <Button appearance="secondary-action-button" onClick={handleBack}>
                Terug
              </Button>
            </ButtonGroup>
          </div>
        ) : (
          <div>
            <Heading1 style={{ marginBlockEnd: 'var(--basis-space-block-lg, 1.5rem)' }}>{title}</Heading1>

            <div style={{ marginBlockEnd: 'var(--basis-space-block-xl, 2rem)' }}>
              <Paragraph style={{ marginBlockEnd: 'var(--basis-space-block-md, 1rem)' }}>
                {introFirstParagraph}
              </Paragraph>
              <Paragraph style={{ marginBlockEnd: 'var(--basis-space-block-md, 1rem)' }}>
                We willen graag aanvullende cookies plaatsen om te begrijpen hoe je deze website gebruikt, je
                instellingen te onthouden en onze diensten te verbeteren.
              </Paragraph>
              <Paragraph>
                We gebruiken ook cookies die door andere sites zijn geplaatst om ons te helpen content van hun diensten
                te leveren.
              </Paragraph>
            </div>

            <ButtonGroup style={{ marginBlockStart: 'var(--basis-space-block-xl, 2rem)' }}>
              <Button appearance="primary-action-button" onClick={handleAccept}>
                Accepteren
              </Button>
              <Button appearance="secondary-action-button" onClick={handleReject}>
                Weigeren
              </Button>
              <Button appearance="secondary-action-button" onClick={handleCustomize}>
                Zelf instellen
              </Button>
            </ButtonGroup>
          </div>
        )}
      </dialog>
    </>
  );
};

export default CookieConsentModal;
