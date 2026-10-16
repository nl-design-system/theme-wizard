import { NavigationItems } from '@src/clippy-navigation-bar';

export const simple: NavigationItems = [
  {
    href: '#path',
    label: 'Path',
  },
  {
    href: '#to',
    label: 'To',
  },
  {
    current: true,
    href: '#page',
    label: 'Page',
  },
];

export const single: NavigationItems = [
  {
    href: '#path',
    label: 'Path',
  },
];
