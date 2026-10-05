import type { NavigationItems } from '@nl-design-system-community/clippy-components/clippy-navigation-bar';
import type { TokenPath } from '@nl-design-system-community/design-tokens-schema';
import { TOKEN_NAMESPACES, type TokenNamespaceId } from './token-namespaces';

export interface CurrentDesignTokenPage {
  namespace: TokenNamespaceId;
  segments: TokenPath;
}

// Same sidebar everywhere under /design-tokens: one top-level group per namespace, each nesting
// its own tree. Only the section matching `current.namespace` gets its current-page markers; the
// other sections' trees render fully but with nothing marked current.
export const getDesignTokensNavItems = (current?: CurrentDesignTokenPage): NavigationItems =>
  TOKEN_NAMESPACES.map((namespace) => ({
    current: current?.namespace === namespace.id && current.segments.length === 0,
    href: namespace.href,
    items: namespace.nav.toNavigationItems(
      namespace.getTree(),
      current?.namespace === namespace.id ? current.segments : [],
    ),
    label: namespace.label,
  }));
