/* @license CC0-1.0 */

import { Paragraph } from '@utrecht/component-library-react/dist/css-module';
import React, { useEffect, useState } from 'react';

export const STORAGE_KEY = 'cookie-consent-preferences';

export interface UseCookieConsentOptions {
  clearStorageOnMount?: boolean;
}

export interface UseCookieConsentReturn {
  handleAccept: () => void;
  handleReject: () => void;
  isVisible: boolean;
  savePreferences: (prefs: string[]) => void;
}

/**
 * Custom hook for cookie consent functionality
 * Handles localStorage, visibility state, and preference saving
 */
export const useCookieConsent = (options: UseCookieConsentOptions = {}): UseCookieConsentReturn => {
  const { clearStorageOnMount = false } = options;
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (clearStorageOnMount && globalThis.window !== undefined && globalThis.localStorage) {
      globalThis.localStorage.removeItem(STORAGE_KEY);
    }

    // Check if user has already made a choice
    try {
      const saved = globalThis.localStorage?.getItem(STORAGE_KEY);
      if (saved) {
        setIsVisible(false);
        return;
      }
    } catch {
      // localStorage not available
    }

    setIsVisible(true);
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
  };

  const handleReject = () => {
    savePreferences([]);
    setIsVisible(false);
  };

  return {
    handleAccept,
    handleReject,
    isVisible,
    savePreferences,
  };
};

/**
 * Helper function to get default content
 */
export const getDefaultCookieContent = (organization?: string): React.ReactNode => {
  return (
    <>
      <Paragraph style={{ marginBlockEnd: 'var(--basis-space-block-md, 1rem)' }}>
        {organization
          ? `${organization} gebruikt enkele essentiële cookies om deze website goed te laten werken.`
          : 'We gebruiken enkele essentiële cookies om deze website goed te laten werken.'}
      </Paragraph>
      <Paragraph style={{ marginBlockEnd: 'var(--basis-space-block-md, 1rem)' }}>
        We willen graag aanvullende cookies plaatsen om te begrijpen hoe je deze website gebruikt, je instellingen te
        onthouden en onze diensten te verbeteren.
      </Paragraph>
      <Paragraph>
        We gebruiken ook cookies die door andere sites zijn geplaatst om ons te helpen content van hun diensten te
        leveren.
      </Paragraph>
    </>
  );
};

/**
 * Helper function to get consent title
 */
export const getConsentTitle = (title?: string, organization?: string): string => {
  return title || (organization ? `Cookies op de website van ${organization}` : 'Cookies op deze website');
};
