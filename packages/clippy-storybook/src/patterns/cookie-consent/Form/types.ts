import type React from 'react';

export type CookieType = 'analytics' | 'external-content' | 'functional' | 'marketing' | 'preferences';

/**
 * Legal basis for cookie processing under GDPR/AVG.
 * - 'consent': Requires explicit opt-in from the user
 * - 'legitimate-interest': Active by default, user can opt-out (object)
 */
export type LegalBasis = 'consent' | 'legitimate-interest';

export interface Cookie {
  description: string;
  duration: string;
  name: string;
  type?: string;
}

export interface CookieOption {
  cookies?: Cookie[];
  description?: string;
  id: CookieType;
  label: string;
  legalBasis?: LegalBasis;
  required?: boolean;
}

export interface InfoSection {
  body: React.ReactNode;
  expanded?: boolean;
  label: string;
}

export interface CookieConsentFormProps {
  buttonAccept?: string;
  buttonReject?: string;
  buttonSave?: string;
  clearStorageOnMount?: boolean;
  cookieOptions?: CookieOption[];
  customizeLink?: {
    href: string;
    text: string;
  };
  infoSections?: InfoSection[];
  showLegitimateInterest?: boolean;
}
