import type { TokenPath, TokenTreeNode } from '@nl-design-system-community/design-tokens-schema';
import { findTreeNode } from '@nl-design-system-community/design-tokens-schema';
import { dequal } from 'dequal';
import { capitalize } from 'es-toolkit';
import type { NavigationItem, NavigationItems } from '@/types';

export const DESIGN_TOKENS_BASE_URL = '/design-tokens';

export const createTokenTreeNav = (basePath: string, namespace: string) => {
  const hrefFor = (path: TokenPath) => `${basePath}/${path.join('/')}`;

  const toNavigationItems = (tree: TokenTreeNode[], currentPath: TokenPath): NavigationItems =>
    tree.map((node): NavigationItem => ({
      current: dequal(node.path, currentPath),
      href: hrefFor(node.path),
      items: node.children.length > 0 ? toNavigationItems(node.children, currentPath) : undefined,
      label: capitalize(node.key),
      metaData: {
        astroPageFragment:
          node.path[0] === 'color' && node.path.length === 2 && node.path[1] !== 'transparent'
            ? 'colorBranch'
            : node.isLeaf
              ? 'leaf'
              : 'branch',
        tokenPath: node.path,
      },
    }));

  const resolveSlugPage = (tree: TokenTreeNode[], slugParam: string) => {
    const segments = slugParam.split('/') as TokenPath;
    return {
      navigationItems: toNavigationItems(tree, segments),
      node: findTreeNode(tree, segments)!,
      segments,
      tokenPath: `${namespace}.${segments.join('.')}`,
    };
  };

  return { hrefFor, resolveSlugPage, toNavigationItems };
};
