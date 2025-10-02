export type CSSRawInputOrigin = {
  type: 'raw';
  css: string;
};

export type CSSLocalFileOrigin = {
  type: 'local-file';
  name: string;
  css: string;
};

export type CSSFileOrigin = {
  type: 'file';
  href: string;
  css: string;
};

export type CSSImportOrigin = {
  type: 'import';
  href: string;
  css: string;
};

export type CSSLinkOrigin = {
  type: 'link';
  href: string;
  url: string;
  media?: string;
  rel: string;
  css: string;
};

export type CSSStyleTagOrigin = {
  type: 'style';
  css: string;
  url: string;
};

export type CSSOrigin =
  | CSSImportOrigin
  | CSSLinkOrigin
  | CSSFileOrigin
  | CSSStyleTagOrigin
  | CSSRawInputOrigin
  | CSSLocalFileOrigin;
