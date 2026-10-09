import type {
  NavigationItem,
  NavigationItems,
} from '@nl-design-system-community/clippy-components/clippy-navigation-bar';
import type { TokenPath, TokenTreeNode } from '@nl-design-system-community/design-tokens-schema';
import { findTreeNode, flattenTreePaths } from '@nl-design-system-community/design-tokens-schema';
import { dequal } from 'dequal';

export const DESIGN_TOKENS_BASE_URL = '/design-tokens';

export interface BreadcrumbItem {
  href: string;
  title: string;
  current?: boolean;
}

export const createTokenTreeNav = (basePath: string, namespace: string) => {
  const hrefFor = (path: TokenPath) => `${basePath}/${path.join('/')}`;

  const toNavigationItems = (tree: TokenTreeNode[], currentPath: TokenPath): NavigationItems =>
    tree.map((node): NavigationItem => ({
      current: dequal(node.path, currentPath),
      href: hrefFor(node.path),
      items: node.children.length > 0 ? toNavigationItems(node.children, currentPath) : undefined,
      label: node.key,
    }));

  const getBreadcrumbTrail = (tree: TokenTreeNode[], currentPath: TokenPath): BreadcrumbItem[] => {
    const breadcrumbs: BreadcrumbItem[] = [
      { href: DESIGN_TOKENS_BASE_URL, title: 'Design tokens' },
      { href: basePath, title: namespace },
    ];
    let nodes = tree;
    for (const segment of currentPath) {
      const node = nodes.find((candidate) => candidate.key === segment);
      if (!node) {
        break;
      }
      breadcrumbs.push({ current: dequal(node.path, currentPath), href: hrefFor(node.path), title: node.key });
      nodes = node.children;
    }
    return breadcrumbs;
  };

  const getStaticSlugs = (tree: TokenTreeNode[]) =>
    flattenTreePaths(tree).map((path) => ({ params: { slug: path.join('/') } }));

  const resolveSlugPage = (tree: TokenTreeNode[], slugParam: string) => {
    const segments = slugParam.split('/') as TokenPath;
    return {
      breadcrumbs: getBreadcrumbTrail(tree, segments),
      navigationItems: toNavigationItems(tree, segments),
      node: findTreeNode(tree, segments)!,
      segments,
      tokenPath: `${namespace}.${segments.join('.')}`,
    };
  };

  return { getBreadcrumbTrail, getStaticSlugs, hrefFor, resolveSlugPage, toNavigationItems };
};
