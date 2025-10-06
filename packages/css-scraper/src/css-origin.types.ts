type UrlLike = string | URL;

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
  url: UrlLike;
};

export type CSSLinkOrigin = {
  type: 'link';
  href: string;
  url: UrlLike;
  media?: string;
  rel: string;
  css: string;
};

export type PartialCSSLinkOrigin = Omit<CSSLinkOrigin, 'css'> & { css?: undefined };

export type CSSStyleTagOrigin = {
  type: 'style';
  css: string;
  url: UrlLike;
};

export type CSSInlineStyleOrigin = {
  type: 'inline';
  css: string;
  url: UrlLike;
};

export type CSSOrigin =
  | CSSImportOrigin
  | CSSLinkOrigin
  | CSSFileOrigin
  | CSSStyleTagOrigin
  | CSSLocalFileOrigin
  | CSSInlineStyleOrigin;
