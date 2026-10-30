import type {
  NavigationItem,
  NavigationItems,
} from '@nl-design-system-community/clippy-components/clippy-navigation-bar';
import type { TokenPath, TokenTreeNode } from '@nl-design-system-community/design-tokens-schema';
import { findTreeNode, flattenTreePaths } from '@nl-design-system-community/design-tokens-schema';
import { dequal } from 'dequal';

type PageType = 'leaf' | 'branch' | 'basisColorBranch';

export const DESIGN_TOKENS_BASE_URL = '/design-tokens';

export const createTokenTreeNav = (basePath: string, namespace: string) => {
  const hrefFor = (path: TokenPath) => `${basePath}/${path.join('/')}`;

  const toNavigationItems = (tree: TokenTreeNode[], currentPath: TokenPath): NavigationItems =>
    tree.map((node): NavigationItem => ({
      current: dequal(node.path, currentPath),
      href: hrefFor(node.path),
      items: node.children.length > 0 ? toNavigationItems(node.children, currentPath) : undefined,
      label: node.key,
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

  const getStaticPaths = ({ fragment, tree }: { fragment: PageType; tree: TokenTreeNode[] }) =>
    flattenTreePaths(tree)
      .map((path) => {
        const slug = path.join('/');
        const pageData = resolveSlugPage(tree, slug);
        let type: PageType = 'branch';

        if (pageData.node.isLeaf) {
          type = 'leaf';
        } else if (path[0] === 'color' && path.length === 2 && path[1] !== 'transparent') {
          type = 'basisColorBranch';
        }

        return {
          params: { [fragment]: slug, namespace },
          props: {
            namespace,
            pageData,
            type,
          },
        };
      })
      .filter(({ props }) => props.type === fragment);

  return { getStaticPaths, hrefFor, resolveSlugPage, toNavigationItems };
};
