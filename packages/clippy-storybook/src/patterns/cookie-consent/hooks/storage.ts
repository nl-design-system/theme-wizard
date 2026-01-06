/**
 * Current version of the data structure.
 * Increment this when the structure changes and add a migration function.
 * Example: when migrating from localStorage to sessionStorage or server-side cookies.
 */
export const CURRENT_VERSION = 1;

export interface StoredPreferencesV1 {
  preferences: string[];
  timestamp: string;
  version: 1;
}

export type StoredPreferences = StoredPreferencesV1;

/**
 * Migrates stored preferences to the current version.
 * Migrations are chainable: 0 -> 1 -> 2 -> ... -> CURRENT_VERSION
 * Add new migration cases when incrementing CURRENT_VERSION.
 * Example: when migrating from localStorage to sessionStorage or server-side cookies.
 */
export function migratePreferences(data: Partial<StoredPreferences>): StoredPreferences | null {
  let current = data;
  let version = current.version ?? 0;

  // Chain migrations until we reach CURRENT_VERSION
  while (version < CURRENT_VERSION) {
    if (version === 0) {
      // Version 0 -> 1: Add version field to existing data
      current = {
        preferences: current.preferences ?? [],
        timestamp: current.timestamp ?? new Date().toISOString(),
        version: 1,
      };
      version = 1;
    } else if (version === 1) {
      // Version 1 -> 2: Future migration example
      // current = migrateV1ToV2(current);
      // version = 2;
      // For now, version 1 is current, so break
      break;
    } else {
      // Unknown version: return null to trigger re-consent
      return null;
    }
  }

  // Validate migrated data
  if (version === CURRENT_VERSION && current.version === CURRENT_VERSION) {
    return current as StoredPreferencesV1;
  }

  return null;
}
