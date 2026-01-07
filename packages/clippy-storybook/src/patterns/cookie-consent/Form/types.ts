import type React from 'react';

export type CookieType = 'analytics' | 'marketing' | 'preferences' | 'functional';

export interface Cookie {
  description: string;
  duration: string;
  name: string;
  type?: 'http-cookie' | 'local-storage' | 'session-storage';
}

export interface CookieOption {
  cookies?: Cookie[];
  description?: string;
  id: CookieType;
  label: string;
  required?: boolean;
}

export interface CookieConsentFormProps {
  buttonAccept?: string;
  buttonReject?: string;
  buttonSave?: string;
  children?: React.ReactNode;
  clearStorageOnMount?: boolean;
  cookieOptions?: CookieOption[];
  customizeLink?: {
    href: string;
    text: string;
  };
  showLogo?: boolean;
  title?: string;
}
