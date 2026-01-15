// Main form component
export { CookieConsentForm, CookieConsentForm as default } from './CookieConsentForm';

// Dumb/presentational components for custom compositions
export { CookieOption, CookieOptionList, CookieDescriptionList, DataPanel, PolicyPanel } from './components';
export type {
  CookieOptionListProps,
  CookieOptionProps,
  CookieDescriptionListProps,
  DataPanelProps,
  PolicyPanelProps,
} from './components';

// Types
export type { Cookie, CookieConsentFormProps, CookieOption as CookieOptionType, CookieType, LegalBasis } from './types';
