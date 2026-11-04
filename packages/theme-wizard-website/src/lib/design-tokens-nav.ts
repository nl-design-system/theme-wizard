import type { NavigationItems } from '@nl-design-system-community/clippy-components/clippy-navigation-bar';
import type { NavigationItem } from '@nl-design-system-community/clippy-components/src/clippy-navigation-bar/types.js';
import type { TokenPath } from '@nl-design-system-community/design-tokens-schema';
import { klona } from 'klona/json';
import { TOKEN_NAMESPACES, type TokenNamespaceId } from './token-namespaces';
import { DESIGN_TOKENS_BASE_URL } from './token-tree-nav';

export interface CurrentDesignTokenPage {
  namespace: TokenNamespaceId;
  segments: TokenPath;
}

interface CustomNavigationConfigItem extends NavigationItem {
  insertAt: string;
  groups: string[];
}

export const customNavigationConfigBasis: CustomNavigationConfigItem[] = [
  {
    groups: ['basis.color.default', 'basis.color.default-inverse'],
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

  return mergeCustomNavigation(tokenNavigationTree, customNavigationConfigBasis);
};

/**
 * Result of finding a node in the navigation tree
 */
interface FindResult {
  node?: NavigationItem;
  parent?: NavigationItem;
  parentItemsArray?: NavigationItems;
}

/**
 * Recursively find a node by its href in the navigation tree.
 * Returns the node, its parent, and the parent's items array for easy manipulation.
 */
function findNodeByHref(
  items: NavigationItems,
  targetHref: string,
  parent?: NavigationItem,
  parentItemsArray?: NavigationItems,
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
  return {};
}

/**
 * Convert a token path (e.g., "basis.color.accent-1") to a design tokens href.
 */
function tokenPathToHref(tokenPath: string): string {
  return `${DESIGN_TOKENS_BASE_URL}/${tokenPath.replaceAll('.', '/')}`;
}

/**
 * Remove a node from its parent's items array by reference.
 * Also cleans up empty items arrays on the parent.
 */
function removeNodeFromParent(node: NavigationItem, parentItemsArray: NavigationItems, parent?: NavigationItem): void {
  const index = parentItemsArray.indexOf(node);
  if (index !== -1) {
    parentItemsArray.splice(index, 1);
    // Clean up empty items arrays
    if (parent && parentItemsArray.length === 0) {
      delete parent.items;
    }
  }
}

/**
 * Ensure a navigation item has an items array, creating one if it doesn't exist.
 */
function ensureItemsArray(node: NavigationItem): NavigationItems {
  if (!node.items) {
    node.items = [];
  }
  return node.items;
}

/**
 * Create a NavigationItem from a CustomNavigationConfigItem.
 * Strips out the custom config properties (groups, insertAt) to create a standard NavigationItem.
 */
function createNavigationItem(
  configItem: CustomNavigationConfigItem,
  groupedItems: NavigationItem[],
): NavigationItem | null {
  // Strip out the custom config properties
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { groups: _groups, insertAt: _insertAt, ...navigationItem } = configItem;

  const newItem: NavigationItem = {
    ...navigationItem,
    items: groupedItems.length > 0 ? groupedItems : undefined,
  };

  return newItem;
}

/**
 * Collect all nodes referenced by group paths from the navigation tree.
 * Each found node is removed from its original location.
 */
function collectGroupedItems(navTree: NavigationItems, groupPaths: string[]): NavigationItem[] {
  const collected: NavigationItem[] = [];

  for (const path of groupPaths) {
    const groupHref = tokenPathToHref(path);
    const result = findNodeByHref(navTree, groupHref);

    if (result.node && result.parentItemsArray) {
      removeNodeFromParent(result.node, result.parentItemsArray, result.parent);
      collected.push(result.node);
    }
    // Silently skip if group href not found
  }

  return collected;
}

/**
 * Insert a new navigation item at the beginning of a target node's items.
 */
function insertItemAtBeginning(parentNode: NavigationItem, newItem: NavigationItem): void {
  ensureItemsArray(parentNode);
  parentNode.items!.unshift(newItem);
}

/**
 * Merge custom navigation config into the design tokens navigation tree.
 *
 * Rules:
 * - Items from customNavigationConfig are inserted at the point where `insertAt` matches a node's href
 * - Items referenced in `groups` are moved from their original location to the new item's `items` array
 * - Missing references (insertAt or groups) are silently skipped
 * - New items are added at the beginning, in configuration order
 *
 * @param sourceNav - The navigation tree from getDesignTokensNavItems
 * @param customConfig - The custom navigation configuration
 * @returns A new navigation tree with custom items merged in
 */
export function mergeCustomNavigation(
  sourceNav: NavigationItems,
  customConfig: CustomNavigationConfigItem[],
): NavigationItems {
  const clonedNav = klona(sourceNav);

  // Process in reverse order so that unshift maintains configuration order
  for (let i = customConfig.length - 1; i >= 0; i--) {
    const configItem = customConfig[i];

    // Find where to insert the new item
    const insertResult = findNodeByHref(clonedNav, configItem.insertAt);
    if (!insertResult.node) {
      continue; // Skip if insertAt not found
    }

    // Collect all items that should be grouped under the new item
    const groupedItems = collectGroupedItems(clonedNav, configItem.groups);

    // Create the new navigation item
    const newItem = createNavigationItem(configItem, groupedItems);
    if (!newItem) {
      continue; // Skip if we couldn't create a valid item
    }

    // Insert the new item at the beginning
    insertItemAtBeginning(insertResult.node, newItem);
  }

  return clonedNav;
}
