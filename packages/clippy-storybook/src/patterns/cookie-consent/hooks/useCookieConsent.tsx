import { useEffect, useState } from 'react';
import { CURRENT_VERSION, migratePreferences, type StoredPreferences } from './storage';

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
 * Handles localStorage, visibility state, and preference saving.
 *
 * @remarks
 * This is a demo/test hook. For production, implement server-side storage.
 * The stored data structure is versioned to allow for future migrations
 * (e.g., from localStorage to sessionStorage or server-side cookies).
 * When changing the structure, increment CURRENT_VERSION and add a migration case.
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
        try {
          const parsed = JSON.parse(saved) as Partial<StoredPreferences>;
          const migrated = migratePreferences(parsed);

          if (migrated?.version === CURRENT_VERSION) {
            // Save migrated data back to localStorage if it was migrated
            const originalVersion = parsed.version ?? 0;
            if (originalVersion !== CURRENT_VERSION) {
              globalThis.localStorage?.setItem(STORAGE_KEY, JSON.stringify(migrated));
            }
            setIsVisible(false);
            return;
          }
          // If migration failed or version mismatch, show banner again
        } catch {
          // Invalid JSON or migration failed, show banner again
        }
      }
    } catch {
      // localStorage not available
    }

    setIsVisible(true);
  }, [clearStorageOnMount]);

  const savePreferences = (prefs: string[]) => {
    try {
      const data: StoredPreferences = {
        preferences: prefs,
        timestamp: new Date().toISOString(),
        version: CURRENT_VERSION,
      };
      globalThis.localStorage?.setItem(STORAGE_KEY, JSON.stringify(data));
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
