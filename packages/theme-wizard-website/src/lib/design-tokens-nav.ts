import type { NavigationItems } from '@nl-design-system-community/clippy-components/clippy-navigation-bar';
import type { TokenPath } from '@nl-design-system-community/design-tokens-schema';
import { mergeCustomNavigation, type CustomNavigationConfigItem } from './custom-navigation';
import { TOKEN_NAMESPACES, type TokenNamespaceId } from './token-namespaces';
import { DESIGN_TOKENS_BASE_URL } from './token-tree-nav';

export interface CurrentDesignTokenPage {
  namespace: TokenNamespaceId;
  segments: TokenPath;
}

export const customNavigationConfigBasis: CustomNavigationConfigItem[] = [
  {
    groups: ['basis.color.default', 'basis.color.default-inverse'],
    hideSubItems: true,
    href: `${DESIGN_TOKENS_BASE_URL}/basis/color/default-group`,
    insertAt: `${DESIGN_TOKENS_BASE_URL}/basis/color`,
    label: 'Standaard',
  },
  {
    groups: [
      'basis.color.accent-1',
      'basis.color.accent-1-inverse',
      'basis.color.accent-2',
      'basis.color.accent-2-inverse',
      'basis.color.accent-3',
      'basis.color.accent-3-inverse',
    ],
    hideSubItems: true,
    href: `${DESIGN_TOKENS_BASE_URL}/basis/color/accent`,
    insertAt: `${DESIGN_TOKENS_BASE_URL}/basis/color`,
    label: 'Accent',
  },
  {
    groups: [
      'basis.color.action-1',
      'basis.color.action-1-inverse',
      'basis.color.action-2',
      'basis.color.action-2-inverse',
    ],
    hideSubItems: true,
    href: `${DESIGN_TOKENS_BASE_URL}/basis/color/action`,
    insertAt: `${DESIGN_TOKENS_BASE_URL}/basis/color`,
    label: 'Interactie',
  },
  {
    groups: [
      'basis.color.info',
      'basis.color.info-inverse',
      'basis.color.positive',
      'basis.color.positive-inverse',
      'basis.color.negative',
      'basis.color.negative-inverse',
      'basis.color.warning',
      'basis.color.warning-inverse',
    ],
    hideSubItems: true,
    href: `${DESIGN_TOKENS_BASE_URL}/basis/color/signal`,
    insertAt: `${DESIGN_TOKENS_BASE_URL}/basis/color`,
    label: 'Signaal',
  },
  {
    groups: [
      'basis.color.disabled',
      'basis.color.disabled-inverse',
      'basis.color.highlight',
      'basis.color.highlight-inverse',
      'basis.color.selected',
      'basis.color.selected-inverse',
      'basis.color.transparent',
    ],
    hideSubItems: false,
    href: `${DESIGN_TOKENS_BASE_URL}/basis/color/misc`,
    insertAt: `${DESIGN_TOKENS_BASE_URL}/basis/color`,
    label: 'Overig',
  },
];

// Same sidebar everywhere under /design-tokens: one top-level group per namespace, each nesting
// its own tree. Only the section matching `current.namespace` gets its current-page markers; the
// other sections' trees render fully but with nothing marked current.
// The `basis` token tree needs some custom items and structure to make it easier to work with so
// we merge a custom navigation structure with the basis token tree.
export const getDesignTokensNavItems = (current?: CurrentDesignTokenPage): NavigationItems => {
  const tokenNavigationTree = TOKEN_NAMESPACES.map((namespace) => ({
    current: current?.namespace === namespace.id && current.segments.length === 0,
    href: namespace.href,
    items: namespace.nav.toNavigationItems(
      namespace.getTree(),
      current?.namespace === namespace.id ? current.segments : [],
    ),
    label: namespace.label,
  }));

  return mergeCustomNavigation(tokenNavigationTree, customNavigationConfigBasis, DESIGN_TOKENS_BASE_URL);
};
