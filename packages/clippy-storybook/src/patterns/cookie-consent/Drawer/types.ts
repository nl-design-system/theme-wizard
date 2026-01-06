export interface CookieConsentDrawerProps {
  buttonAccept?: string;
  buttonReject?: string;
  customizeLink?: {
    href: string;
    text: string;
  };
  children?: React.ReactNode;
  clearStorageOnMount?: boolean;
  showLogo: boolean;
  title?: string;
}
