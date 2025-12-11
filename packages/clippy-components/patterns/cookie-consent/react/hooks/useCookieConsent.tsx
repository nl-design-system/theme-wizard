/* @license CC0-1.0 */

import { useEffect, useState } from 'react';

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
