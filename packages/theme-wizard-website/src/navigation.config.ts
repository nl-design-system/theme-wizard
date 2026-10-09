import type { NavigationItems } from '@nl-design-system-community/clippy-components/clippy-navigation-bar';
import { getBasisTokenTree, toNavigationItems } from '@/lib/basis-token-nav';
import { componentsNavigationItems } from '@/lib/components';
const basisTokenTree = getBasisTokenTree();
const basisTokenNavItems = toNavigationItems(basisTokenTree, []);
const styleGuideItems: NavigationItems = [
  { href: '/style-guide/color-system', label: 'Kleur systeem' },
  { href: '/style-guide/typography-system', label: 'Typografie systeem' },
  { href: '/style-guide/spacing-system', label: 'Witruimte systeem' },
  { href: '/style-guide/border-system', label: 'Randen en lijnen systeem' },
  { href: '/style-guide/design-tokens', label: 'Design tokens' },
];

// @TODO: translations
const navigationItems: NavigationItems = [
  { href: '/wizard', label: 'Start' },
  { href: '/basis-tokens', items: basisTokenNavItems, label: 'Huisstijl' },
  { href: '/components', items: componentsNavigationItems, label: 'Componenten' },
  { href: '/style-guide', items: styleGuideItems, label: 'Stijlgids' },
  { href: '/publish-tokens', label: 'Publiceren' },
];

const isCurrentPage = (href: string, slug: string): boolean => {
  return slug.endsWith(href);
};

const setCurrentRecursive = (items: NavigationItems, slug: string): NavigationItems => {
  return items.map((item) => ({
    ...item,
    current: isCurrentPage(item.href, slug),
    items: item.items ? setCurrentRecursive(item.items, slug) : undefined,
  }));
};

export const getNavigationItems = (slug: string): NavigationItems => {
  return setCurrentRecursive(navigationItems, slug);
};

export const getSubNavigationItems = (items: NavigationItems, slug: string): NavigationItems => {
  const currentItem = items.find((item) => item.href === slug);
  return currentItem?.items || [];
};
