import type {
  SideNavigationItem,
  SideNavigationItems,
} from '@nl-design-system-community/clippy-components/clippy-side-navigation';
import type { TokenPath, TokenTreeNode } from '@nl-design-system-community/design-tokens-schema';
import { buildTokenTree } from '@nl-design-system-community/design-tokens-schema';
import basisTokens from '@nl-design-system-unstable/basis-design-tokens/src/tokens.json' with { type: 'json' };

const BASIS_TOKENS_BASE_PATH = '/basis-tokens';

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

const hrefFor = (path: TokenPath) => `${BASIS_TOKENS_BASE_PATH}/${path.join('/')}`;

const pathsEqual = (a: TokenPath, b: TokenPath) => a.length === b.length && a.every((segment, i) => segment === b[i]);

export const getBasisTokenTree = (): TokenTreeNode[] =>
  buildTokenTree(basisTokens.basis as Record<string, unknown>).sort(byTopLevelOrder);

export const toSideNavigationItems = (tree: TokenTreeNode[], currentPath: TokenPath): SideNavigationItems =>
  tree.map((node): SideNavigationItem => ({
    current: pathsEqual(node.path, currentPath),
    href: hrefFor(node.path),
    items: node.children.length > 0 ? toSideNavigationItems(node.children, currentPath) : undefined,
    label: node.key,
  }));

export interface BreadcrumbItem {
  href: string;
  title: string;
  current?: boolean;
}

export const getBreadcrumbTrail = (tree: TokenTreeNode[], currentPath: TokenPath): BreadcrumbItem[] => {
  const crumbs: BreadcrumbItem[] = [
    {
      href: BASIS_TOKENS_BASE_PATH,
      title: 'basis',
    },
  ];
  let nodes = tree;
  for (const segment of currentPath) {
    const node = nodes.find((candidate) => candidate.key === segment);
    if (!node) {
      break;
    }
    crumbs.push({
      current: pathsEqual(node.path, currentPath),
      href: hrefFor(node.path),
      title: node.key,
    });
    nodes = node.children;
  }
  return crumbs;
};
