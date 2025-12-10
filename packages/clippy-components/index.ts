import './src/clippy-modal';
import { CookieConsentDrawer as _CookieConsentDrawer } from './patterns/cookie-consent/react/CookieConsentDrawer';

// Ensure displayName is preserved after export
export const CookieConsentDrawer = _CookieConsentDrawer;

export type { CookieConsentDrawerProps } from './patterns/cookie-consent/react/CookieConsentDrawer';
export {
  getConsentTitle,
  getDefaultCookieContent,
  useCookieConsent,
  type UseCookieConsentOptions,
  type UseCookieConsentReturn,
} from './patterns/cookie-consent/react/hooks/useCookieConsent';
