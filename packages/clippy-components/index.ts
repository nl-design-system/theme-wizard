import './src/clippy-modal';

export { CookieConsentDrawer } from './patterns/cookie-consent/react/CookieConsentDrawer';
export type { CookieConsentDrawerProps } from './patterns/cookie-consent/react/CookieConsentDrawer';
export {
  getConsentTitle,
  getDefaultCookieContent,
  useCookieConsent,
  type UseCookieConsentOptions,
  type UseCookieConsentReturn,
} from './patterns/cookie-consent/react/hooks/useCookieConsent';
