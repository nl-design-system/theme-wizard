import type {
  NavigationItem,
  NavigationItems,
} from '@nl-design-system-community/clippy-components/src/clippy-navigation-bar/types.js';

export interface NavigationConfigItem extends NavigationItem {
  groups?: string[];
  hideSubItems?: boolean;
  astroFragment?: string;
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
      collected.push(JSON.parse(JSON.stringify(node)));
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
 * and populate its `items` property.
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

      // Set hideUntilCurrent on all grouped items if specified
      if (configItem.hideSubItems) {
        groupedItems.forEach((groupedItem) => {
          setHideUntilCurrent(groupedItem, true);
        });
      }

      newItem.items = groupedItems;
    }

    // Recursively process nested items
    if (configItem.items) {
      newItem.items = addTokenGroupsToNavigation(configItem.items, tokenNavTree, baseUrl);
    }

    return newItem;
  });
}
