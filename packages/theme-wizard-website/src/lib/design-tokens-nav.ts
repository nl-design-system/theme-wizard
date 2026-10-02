import type { NavigationItems } from '@nl-design-system-community/clippy-components/clippy-navigation-bar';
import type { TokenPath } from '@nl-design-system-community/design-tokens-schema';
import { getBasisTokenTree, toNavigationItems as toBasisNavigationItems } from './basis-token-nav';
import { getNlTokenTree, toNavigationItems as toNlNavigationItems } from './nl-token-nav';

export interface CurrentDesignTokenPage {
  namespace: 'basis' | 'nl';
  segments: TokenPath;
}

// Same sidebar everywhere under /design-tokens: two top-level groups, "Basis tokens" and
// "Candidate components", each nesting its own tree. Only the section matching
// `current.namespace` gets its current-page markers; the other section's tree renders fully
// but with nothing marked current.
export const getDesignTokensNavItems = (current?: CurrentDesignTokenPage): NavigationItems => [
  {
    current: current?.namespace === 'basis' && current.segments.length === 0,
    href: '/design-tokens/basis',
    items: toBasisNavigationItems(getBasisTokenTree(), current?.namespace === 'basis' ? current.segments : []),
    label: 'Basis tokens',
  },
  {
    current: current?.namespace === 'nl' && current.segments.length === 0,
    href: '/design-tokens/nl',
    items: toNlNavigationItems(getNlTokenTree(), current?.namespace === 'nl' ? current.segments : []),
    label: 'Candidate components',
  },
];
