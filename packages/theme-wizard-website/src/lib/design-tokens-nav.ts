import type { NavigationItems } from '@nl-design-system-community/clippy-components/clippy-navigation-bar';
import type { NavigationItem } from '@nl-design-system-community/clippy-components/src/clippy-navigation-bar/types.js';
import type { TokenPath } from '@nl-design-system-community/design-tokens-schema';
import { TOKEN_NAMESPACES, type TokenNamespaceId } from './token-namespaces';
import { DESIGN_TOKENS_BASE_URL } from './token-tree-nav';

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

interface ExtendedNavigationItem extends NavigationItem {
  groups?: string[];
  insertAt: string;
}

export const customNavigationConfigBasis: ExtendedNavigationItem[] = [
  {
    groups: [`${DESIGN_TOKENS_BASE_URL}/basis/color/default`, `${DESIGN_TOKENS_BASE_URL}/basis/color/default-inverse`],
    href: `${DESIGN_TOKENS_BASE_URL}/basis/color/default-group`,
    insertAt: `${DESIGN_TOKENS_BASE_URL}/basis/color`,
    label: 'Standaard',
  },
  {
    groups: [
      `${DESIGN_TOKENS_BASE_URL}/basis/color/accent-1`,
      `${DESIGN_TOKENS_BASE_URL}/basis/color/accent-1-inverse`,
      `${DESIGN_TOKENS_BASE_URL}/basis/color/accent-2`,
      `${DESIGN_TOKENS_BASE_URL}/basis/color/accent-2-inverse`,
      `${DESIGN_TOKENS_BASE_URL}/basis/color/accent-3`,
      `${DESIGN_TOKENS_BASE_URL}/basis/color/accent-3-inverse`,
    ],
    href: `${DESIGN_TOKENS_BASE_URL}/basis/color/accent`,
    insertAt: `${DESIGN_TOKENS_BASE_URL}/basis/color`,
    label: 'Accent',
  },
  {
    groups: [
      `${DESIGN_TOKENS_BASE_URL}/basis/color/action-1`,
      `${DESIGN_TOKENS_BASE_URL}/basis/color/action-1-inverse`,
      `${DESIGN_TOKENS_BASE_URL}/basis/color/action-2`,
      `${DESIGN_TOKENS_BASE_URL}/basis/color/action-2-inverse`,
    ],
    href: `${DESIGN_TOKENS_BASE_URL}/basis/color/action`,
    insertAt: `${DESIGN_TOKENS_BASE_URL}/basis/color`,
    label: 'Interactie',
  },
  {
    groups: [
      `${DESIGN_TOKENS_BASE_URL}/basis/color/info`,
      `${DESIGN_TOKENS_BASE_URL}/basis/color/info-inverse`,
      `${DESIGN_TOKENS_BASE_URL}/basis/color/positive`,
      `${DESIGN_TOKENS_BASE_URL}/basis/color/positive-inverse`,
      `${DESIGN_TOKENS_BASE_URL}/basis/color/negative`,
      `${DESIGN_TOKENS_BASE_URL}/basis/color/negative-inverse`,
      `${DESIGN_TOKENS_BASE_URL}/basis/color/warning`,
      `${DESIGN_TOKENS_BASE_URL}/basis/color/warning-inverse`,
    ],
    href: `${DESIGN_TOKENS_BASE_URL}/basis/color/signal`,
    insertAt: `${DESIGN_TOKENS_BASE_URL}/basis/color`,
    label: 'Signaal',
  },
  {
    groups: [
      `${DESIGN_TOKENS_BASE_URL}/basis/color/disabled`,
      `${DESIGN_TOKENS_BASE_URL}/basis/color/disabled-inverse`,
      `${DESIGN_TOKENS_BASE_URL}/basis/color/highlight`,
      `${DESIGN_TOKENS_BASE_URL}/basis/color/highlight-inverse`,
      `${DESIGN_TOKENS_BASE_URL}/basis/color/selected`,
      `${DESIGN_TOKENS_BASE_URL}/basis/color/selected-inverse`,
      `${DESIGN_TOKENS_BASE_URL}/basis/color/transparent`,
    ],
    href: `${DESIGN_TOKENS_BASE_URL}/basis/color/misc`,
    insertAt: `${DESIGN_TOKENS_BASE_URL}/basis/color`,
    label: 'Overig',
  },
];

/**
 * Result of finding a node in the navigation tree
 */
interface FindResult {
  node: NavigationItem | null;
  parent: NavigationItem | null;
  parentItemsArray: NavigationItems | null;
}

/**
 * Recursively find a node by its href in the navigation tree.
 * Returns the node, its parent, and the parent's items array for easy manipulation.
 */
function findNodeByHref(
  items: NavigationItems,
  targetHref: string,
  parent: NavigationItem | null = null,
  parentItemsArray: NavigationItems | null = null,
): FindResult {
  for (const item of items) {
    if (item.href === targetHref) {
      return { node: item, parent, parentItemsArray };
    }
    if (item.items) {
      const result = findNodeByHref(item.items, targetHref, item, item.items);
      if (result.node) {
        return result;
      }
    }
  }
  return { node: null, parent: null, parentItemsArray: null };
}

/**
 * Merge custom navigation config into the design tokens navigation tree.
 *
 * Rules:
 * - Items from customNavigationConfig are inserted at the point where `insertAt` matches a node's href
 * - Items referenced in `groups` are moved from their original location to the new item's `items` array
 * - Missing references (insertAt or groups) are silently skipped
 *
 * @param sourceNav - The navigation tree from getDesignTokensNavItems
 * @param customConfig - The custom navigation configuration
 * @returns A new navigation tree with custom items merged in
 */
export function mergeCustomNavigation(
  sourceNav: NavigationItems,
  customConfig: ExtendedNavigationItem[],
): NavigationItems {
  // Deep clone the source navigation to avoid mutating the original
  const deepClone = (items: NavigationItems): NavigationItems => {
    return items.map((item) => ({
      ...item,
      items: item.items ? deepClone(item.items) : undefined,
    }));
  };

  const clonedNav = deepClone(sourceNav);

  // Process in reverse order so that unshift maintains configuration order
  for (let i = customConfig.length - 1; i >= 0; i--) {
    const { groups = [], insertAt, ...navigationItem } = customConfig[i];

    // Find the insertion point parent
    const insertResult = findNodeByHref(clonedNav, insertAt);
    if (!insertResult.node) {
      continue; // Skip if insertAt not found
    }

    // Create the new navigation item
    const newItem: NavigationItem = {
      ...navigationItem,
      items: [],
    };

    // Collect and move all group items
    for (const groupHref of groups) {
      // Find the node to move
      const groupResult = findNodeByHref(clonedNav, groupHref);
      if (!groupResult.node || !groupResult.parentItemsArray) {
        continue; // Skip if group href not found
      }

      // Remove from original location
      const index = groupResult.parentItemsArray.indexOf(groupResult.node);
      if (index !== -1) {
        groupResult.parentItemsArray.splice(index, 1);
        // Clean up empty items arrays
        if (groupResult.parent && groupResult.parentItemsArray.length === 0) {
          delete groupResult.parent.items;
        }
      }

      // Add to new item's items
      if (newItem.items) {
        newItem.items.push(groupResult.node);
      }
    }

    // If no groups were found, still insert the item but without items array
    if (newItem.items && newItem.items.length === 0) {
      delete newItem.items;
    }

    // Insert the new item at the beginning of the insertion point's items
    const targetNode = insertResult.node;
    if (!targetNode.items) {
      targetNode.items = [];
    }
    targetNode.items.unshift(newItem);
  }

  return clonedNav;
}
