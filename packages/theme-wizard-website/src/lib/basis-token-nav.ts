import type { TokenTreeNode } from '@nl-design-system-community/design-tokens-schema';
import { buildTokenTree } from '@nl-design-system-community/design-tokens-schema';
import basisTokens from '@nl-design-system-unstable/basis-design-tokens/src/tokens.json' with { type: 'json' };
import { createTokenTreeNav } from './token-tree-nav';

const BASIS_TOKENS_BASE_PATH = '/design-tokens/basis';

// Display order for the top-level basis groups. Groups not listed here (e.g. new ones added
// upstream later) are appended after these, in their original source order.
const TOP_LEVEL_ORDER = [
  'text',
  'color',
  'space',
  'size',
  'pointer-target',
  'border-radius',
  'border-width',
  'box-shadow',
  'heading',
  'form-control',
  'focus',
];

const byTopLevelOrder = (a: TokenTreeNode, b: TokenTreeNode): number => {
  const indexOfA = TOP_LEVEL_ORDER.indexOf(a.key);
  const indexOfB = TOP_LEVEL_ORDER.indexOf(b.key);
  if (indexOfA === -1) {
    return indexOfB === -1 ? 0 : 1;
  }
  if (indexOfB === -1) {
    return -1;
  }
  return indexOfA - indexOfB;
};

export const getBasisTokenTree = (): TokenTreeNode[] =>
  buildTokenTree(basisTokens.basis as Record<string, unknown>).sort(byTopLevelOrder);

export const { getStaticSlugs, resolveSlugPage, toNavigationItems } = createTokenTreeNav(
  BASIS_TOKENS_BASE_PATH,
  'basis',
);
