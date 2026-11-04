import type {
  NavigationItem,
  NavigationItems,
} from '@nl-design-system-community/clippy-components/src/clippy-navigation-bar/types.js';

export interface CustomNavigationConfigItem extends NavigationItem {
  insertAt: string;
  groups: string[];
}

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
function tokenPathToHref(baseUrl: string, tokenPath: string): string {
  return `${baseUrl}/${tokenPath.replaceAll('.', '/')}`;
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
function collectGroupedItems(navTree: NavigationItems, groupPaths: string[], baseUrl: string): NavigationItem[] {
  const collected: NavigationItem[] = [];

  for (const path of groupPaths) {
    const groupHref = tokenPathToHref(baseUrl, path);
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
  if (!parentNode.items) {
    parentNode.items = [];
  }
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
  baseUrl: string,
): NavigationItems {
  // Process in reverse order so that unshift maintains configuration order
  customConfig.reverse().forEach((configItem) => {
    // Find where to insert the new item
    const insertResult = findNodeByHref(sourceNav, configItem.insertAt);
    if (!insertResult.node) {
      return; // Skip if insertAt not found
    }

    // Collect all items that should be grouped under the new item
    const groupedItems = collectGroupedItems(sourceNav, configItem.groups, baseUrl);

    // Create the new navigation item
    const newItem = createNavigationItem(configItem, groupedItems);
    if (!newItem) {
      return; // Skip if we couldn't create a valid item
    }

    // Insert the new item at the beginning
    insertItemAtBeginning(insertResult.node, newItem);
  });

  return sourceNav;
}
