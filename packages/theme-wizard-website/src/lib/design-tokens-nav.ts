import type { NavigationItems } from '@nl-design-system-community/clippy-components/clippy-navigation-bar';
import type { TokenPath } from '@nl-design-system-community/design-tokens-schema';
import { addTokenGroupsToNavigation, type NavigationConfigItem } from './custom-navigation';
import { TOKEN_NAMESPACES, type TokenNamespaceId } from './token-namespaces';
import { DESIGN_TOKENS_BASE_URL } from './token-tree-nav';

export interface CurrentDesignTokenPage {
  namespace: TokenNamespaceId;
  segments: TokenPath;
}

export const customNavigationConfigNewBasis: NavigationConfigItem[] = [
  {
    astroFragment: 'colorOverview',
    href: `${DESIGN_TOKENS_BASE_URL}/basis/color`,
    items: [
      {
        astroFragment: 'colorCollection',
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
        label: 'Accent',
      },
      {
        astroFragment: 'colorCollection',
        groups: ['basis.color.default', 'basis.color.default-inverse'],
        hideSubItems: true,
        href: `${DESIGN_TOKENS_BASE_URL}/basis/color/default-group`,
        label: 'Standaard',
      },
      {
        astroFragment: 'colorCollection',
        groups: [
          'basis.color.action-1',
          'basis.color.action-1-inverse',
          'basis.color.action-2',
          'basis.color.action-2-inverse',
        ],
        hideSubItems: true,
        href: `${DESIGN_TOKENS_BASE_URL}/basis/color/action`,
        label: 'Interactie',
      },
      {
        astroFragment: 'colorCollection',
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
        label: 'Overig',
      },
    ],
    label: 'Kleur',
  },
  {
    groups: ['basis.text.font-family', 'basis.text.font-size', 'basis.text.font-weight', 'basis.text.line-height'],
    href: `${DESIGN_TOKENS_BASE_URL}/basis/text`,
    label: 'Typography',
  },
  {
    groups: [
      'basis.space.block',
      'basis.space.inline',
      'basis.space.block',
      'basis.space.row',
      'basis.space.column',
      'basis.space.text',
      'basis.space.none',
    ],
    href: `${DESIGN_TOKENS_BASE_URL}/basis/space`,
    label: 'Ruimte',
  },
  {
    href: `${DESIGN_TOKENS_BASE_URL}/basis/size`,
    label: 'Grootte',
  },
  {
    href: `${DESIGN_TOKENS_BASE_URL}/basis/border`,
    label: 'Randen en lijnen',
  },
  {
    href: `${DESIGN_TOKENS_BASE_URL}/basis/misc`,
    label: 'Overig',
  },
];

// Same sidebar everywhere under /design-tokens: one top-level group per namespace, each nesting
// its own tree. Only the section matching `current.namespace` gets its current-page markers; the
// other sections' trees render fully but with nothing marked current.
// The `basis` token tree uses customNavigationConfigNewBasis as its structure.
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

  // Find the basis namespace in the token tree
  const basisNamespace = tokenNavigationTree.find((n) => n.href === `${DESIGN_TOKENS_BASE_URL}/basis`);

  if (basisNamespace) {
    // Merge the custom navigation structure with the basis token tree
    basisNamespace.items = addTokenGroupsToNavigation(
      customNavigationConfigNewBasis,
      tokenNavigationTree,
      DESIGN_TOKENS_BASE_URL,
    );
  }

  return tokenNavigationTree;
};
