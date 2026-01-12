// Main form component
export { CookieConsentForm, CookieConsentForm as default } from './CookieConsentForm';

// Dumb/presentational components for custom compositions
export { CookieOption, CookieOptionList, CookieTable, DataPanel, PolicyPanel } from './components';
export type {
  CookieOptionListProps,
  CookieOptionProps,
  CookieTableProps,
  DataPanelProps,
  PolicyPanelProps,
} from './components';

// Types
export type { Cookie, CookieConsentFormProps, CookieOption as CookieOptionType, CookieType, LegalBasis } from './types';
