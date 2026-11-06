import type { NavigationItem, NavigationItems } from '@/types';

export interface NavigationConfigItem extends NavigationItem {
  groups?: string[];
  hideSubItems?: boolean;
  astroPageFragment?: string;
  items?: NavigationConfigItem[];
}

/**
 * Convert a token path (e.g., "basis.color.accent-1") to a design tokens href.
 */
function tokenPathToHref(baseUrl: string, tokenPath: string): string {
  return `${baseUrl}/${tokenPath.replaceAll('.', '/')}`;
}

/**
 * Find a node by its href in the navigation tree.
 */
function findNodeByHref(items: NavigationItems, targetHref: string): NavigationItem | null {
  for (const item of items) {
    if (item.href === targetHref) {
      return item;
    }
    if (item.items) {
      const result = findNodeByHref(item.items, targetHref);
      if (result) {
        return result;
      }
    }
  }
  return null;
}

/**
 * Collect all nodes referenced by group paths from the navigation tree.
 * Returns copies of the found nodes (to avoid modifying the original tree).
 */
function collectGroupedItems(navTree: NavigationItems, groupPaths: string[], baseUrl: string): NavigationItem[] {
  const collected: NavigationItem[] = [];

  for (const path of groupPaths) {
    const groupHref = tokenPathToHref(baseUrl, path);
    const node = findNodeByHref(navTree, groupHref);
    if (node) {
      // Create a deep copy to avoid modifying the original
      collected.push(structuredClone(node));
    }
  }

  return collected;
}

/**
 * Recursively set hideUntilCurrent on a navigation item and all its children.
 *
 * @param item - The navigation item to update
 * @param value - The value to set for hideUntilCurrent
 */
export function setHideUntilCurrent(item: NavigationItem, value: boolean): void {
  item.hideUntilCurrent = value;
  if (item.items) {
    item.items.forEach((child) => setHideUntilCurrent(child, value));
  }
}

/**
 * Recursively merge items from tokenNavigationTree into customNavigationConfigNewBasis.
 * For each item with a `groups` property, find the corresponding items in the token tree
 * and populate its `items` property. If a matching node exists in the token tree with the
 * same href and has existing sub-items, those are merged with the grouped items (with
 * token tree items filtered out if they have the same href as any grouped item).
 * For leaf items (no items, no groups), copy child items from matching token tree node.
 */
export function addTokenGroupsToNavigation(
  config: NavigationConfigItem[],
  tokenNavTree: NavigationItems,
  baseUrl: string,
): NavigationItems {
  return config.map((item) => {
    const configItem = item as NavigationConfigItem;
    const newItem: NavigationItem = { ...item };

    // Remove the groups property from the output
    delete (newItem as NavigationConfigItem).groups;

    // If the item has groups, collect the corresponding items from the token tree
    if (configItem.groups && configItem.groups.length > 0) {
      const groupedItems = collectGroupedItems(tokenNavTree, configItem.groups, baseUrl);

      // Check if there's a matching node in tokenNavTree with the same href
      const matchingTokenNode = findNodeByHref(tokenNavTree, newItem.href);

      if (matchingTokenNode?.items) {
        // Filter out token tree items that have the same href as any grouped item
        const groupedHrefs = new Set(groupedItems.map((item) => item.href));
        const filteredTokenItems = structuredClone(
          matchingTokenNode.items.filter((tokenItem) => !groupedHrefs.has(tokenItem.href)),
        );
        // Merge filtered token items with grouped items
        newItem.items = [...filteredTokenItems, ...groupedItems];
      } else {
        newItem.items = groupedItems;
      }

      // Set hideUntilCurrent on all items if specified
      if (configItem.hideSubItems && newItem.items) {
        newItem.items.forEach((child) => {
          setHideUntilCurrent(child, true);
        });
      }
    }
    // If item has no items and no groups, try to copy items from matching token tree node
    else if (!configItem.items && !newItem.items) {
      const matchingTokenNode = findNodeByHref(tokenNavTree, newItem.href);
      if (matchingTokenNode?.items) {
        // Deep copy the items to avoid modifying the original
        newItem.items = structuredClone(matchingTokenNode.items);
      }
    }

    // Recursively process nested items
    if (configItem.items) {
      newItem.items = addTokenGroupsToNavigation(configItem.items, tokenNavTree, baseUrl);
    }

    return newItem;
  });
}
