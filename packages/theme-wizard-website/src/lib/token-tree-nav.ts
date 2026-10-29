import type {
  NavigationItem,
  NavigationItems,
} from '@nl-design-system-community/clippy-components/clippy-navigation-bar';
import type { TokenPath, TokenTreeNode } from '@nl-design-system-community/design-tokens-schema';
import { findTreeNode, flattenTreePaths } from '@nl-design-system-community/design-tokens-schema';
import { dequal } from 'dequal';

export const DESIGN_TOKENS_BASE_URL = '/design-tokens';

// `tokenPathPrefix` null means tree keys already start the token path, e.g. `ams.page-header`
export const createTokenTreeNav = (basePath: string, tokenPathPrefix: string | null) => {
  const hrefFor = (path: TokenPath) => `${basePath}/${path.join('/')}`;

  const toNavigationItems = (tree: TokenTreeNode[], currentPath: TokenPath): NavigationItems =>
    tree.map((node): NavigationItem => ({
      current: dequal(node.path, currentPath),
      href: hrefFor(node.path),
      items: node.children.length > 0 ? toNavigationItems(node.children, currentPath) : undefined,
      label: node.key,
    }));

  const getStaticSlugs = (tree: TokenTreeNode[]) =>
    flattenTreePaths(tree).map((path) => ({ params: { slug: path.join('/') } }));

  const resolveSlugPage = (tree: TokenTreeNode[], slugParam: string) => {
    const segments = slugParam.split('/') as TokenPath;
    return {
      navigationItems: toNavigationItems(tree, segments),
      node: findTreeNode(tree, segments)!,
      segments,
      tokenPath: tokenPathPrefix ? `${tokenPathPrefix}.${segments.join('.')}` : segments.join('.'),
    };
  };

  return { getStaticSlugs, hrefFor, resolveSlugPage, toNavigationItems };
};
