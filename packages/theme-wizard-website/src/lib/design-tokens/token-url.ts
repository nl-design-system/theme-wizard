import { flattenNavigation, getDesignTokensNavItems } from './design-tokens-nav';
import { DESIGN_TOKENS_BASE_URL } from './token-tree-nav';

/**
 * Maps every token path to the URL of the design-token page generated for it.
 *
 * Built from the same navigation tree that `getStaticPaths` uses, so a token path only gets
 * a URL when a page is actually generated for it (i.e. the navigation item has an
 * `astroPageFragment`). Custom pages whose URL differs from the token path (e.g. color
 * collections like `/design-tokens/basis/color/accent`) are keyed by their URL segments, so
 * group paths such as `basis.color.accent` resolve to them as well.
 */
const buildTokenPageUrls = (): Map<string, string> => {
  const urls = new Map<string, string>();

  for (const page of flattenNavigation(getDesignTokensNavItems())) {
    if (!page.metaData?.astroPageFragment) {
      continue;
    }
    // href looks like `/design-tokens/<namespace>/<segment>/...`; the token path is the
    // same segments joined with dots, namespace included.
    const tokenPath = page.href.slice(DESIGN_TOKENS_BASE_URL.length + 1).replaceAll('/', '.');
    urls.set(tokenPath, page.href);
  }

  return urls;
};

let tokenPageUrls: Map<string, string> | undefined;

/**
 * Resolves a token path (e.g. `basis.color.accent-1`) to the URL of its design-token page,
 * or `undefined` when no page is generated for that path. Provided to the theme-wizard-app
 * via `provideTokenUrlResolver`, so wizard components only link to pages that exist.
 */
export const resolveTokenUrl = (tokenPath: string): string | undefined => {
  tokenPageUrls ??= buildTokenPageUrls();
  return tokenPageUrls.get(tokenPath);
};
