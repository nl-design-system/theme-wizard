export interface CookieConsentDrawerProps {
  buttonAccept?: string;
  buttonReject?: string;
  customizeLink?: {
    href: string;
    text: string;
  };
  children?: React.ReactNode;
  clearStorageOnMount?: boolean;
  title?: string;
}
