import { NavigationItems } from '../clippy-navigation-bar/types';

export const simple: NavigationItems = [
  {
    current: true,
    href: '#',
    label: 'Page 1',
  },
  {
    href: '#',
    label: 'Page 2',
  },
];

export const linkAttributes: NavigationItems = [
  {
    current: true,
    href: '#',
    hreflang: 'nl',
    label: 'Page 1',
    lang: 'nl',
    target: '_blank',
  },
];
