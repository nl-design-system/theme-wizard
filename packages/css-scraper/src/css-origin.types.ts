type UrlLike = string | URL;

export type CSSLocalFileResource = {
  type: 'local-file';
  name: string;
  css: string;
};

export type CSSFileResource = {
  type: 'file';
  href: string;
  css: string;
};

export type CSSImportResource = {
  type: 'import';
  href: string;
  css: string;
  url: UrlLike;
};

export type CSSLinkResource = {
  type: 'link';
  href: string;
  url: UrlLike;
  media?: string;
  rel: string;
  css: string;
};

export type PartialCSSLinkResource = Omit<CSSLinkResource, 'css'> & { css: undefined };

export type CSSStyleTagResource = {
  type: 'style';
  css: string;
  url: UrlLike;
};

export type CSSInlineStyleResource = {
  type: 'inline';
  css: string;
  url: UrlLike;
};

export type CSSResource =
  | CSSImportResource
  | CSSLinkResource
  | CSSFileResource
  | CSSStyleTagResource
  | CSSLocalFileResource
  | CSSInlineStyleResource;
