import type { NavigationItems } from '@nl-design-system-community/clippy-components/clippy-navigation-bar';
import { componentsNavigationItems } from '@/lib/components';
import { getDesignTokensNavItems } from '@/lib/design-tokens-nav';
import { DESIGN_TOKENS_BASE_URL } from '@/lib/token-tree-nav';
const designTokensNavItems = getDesignTokensNavItems();
const styleGuideItems: NavigationItems = [
  { href: '/style-guide/color-system', label: 'Kleur systeem' },
  { href: '/style-guide/typography-system', label: 'Typografie systeem' },
  { href: '/style-guide/spacing-system', label: 'Witruimte systeem' },
  { href: '/style-guide/border-system', label: 'Randen en lijnen systeem' },
  { href: '/style-guide/design-tokens', label: 'Design tokens' },
];

const navigationItems: NavigationItems = [
  { href: '/wizard', label: 'Start' },
  { href: DESIGN_TOKENS_BASE_URL, items: designTokensNavItems, label: 'Huisstijl' },
  { href: '/components', items: componentsNavigationItems, label: 'Componenten' },
  { href: '/style-guide', items: styleGuideItems, label: 'Stijlgids' },
  { href: '/publish-tokens', label: 'Publiceren' },
];

const isCurrentPage = (href: string, slug: string): boolean => {
  return slug === href;
};

const setCurrentRecursive = (items: NavigationItems, slug: string): NavigationItems => {
  return items.map((item) => ({
    ...item,
    current: isCurrentPage(item.href, slug),
    items: item.items ? setCurrentRecursive(item.items, slug) : undefined,
  }));
};

export const getNavigationItems = (slug: string): NavigationItems => {
  // In build mode `Astro.url.pathname` returns a trailing `/`, so we need to strip it.
  const parsedSlug = slug.replace(/\/+$/, '');
  return setCurrentRecursive(navigationItems, parsedSlug);
};

export const getSubNavigationItems = (items: NavigationItems, slug: string): NavigationItems => {
  const currentItem = items.find((item) => item.href === slug);
  return currentItem?.items || [];
};

export const getBreadcrumbNavigationItems = (items: NavigationItems): NavigationItems => {
  const path = items.reduce((acc: NavigationItems, item) => {
    if (item.current) {
      return [...acc, item];
    }
    if (item.items) {
      const subPath = getBreadcrumbNavigationItems(item.items);
      if (subPath.length > 0) {
        return [...acc, item, ...subPath];
      }
    }
    return acc;
  }, []);
  return path;
};
