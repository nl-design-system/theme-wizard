import { NavigationItems } from '@src/clippy-navigation-bar';

export const simple: NavigationItems = [
  {
    href: '#anchor-1',
    label: 'Anchor 1',
  },
  {
    href: '#anchor-2',
    label: 'Anchor 2',
  },
];

export const empty: NavigationItems = [];

export const nested: NavigationItems = [
  {
    href: '#',
    label: 'Parent 1',
  },
  {
    href: '#',
    items: [
      {
        href: '#',
        label: 'Child 1',
      },
    ],
    label: 'Parent 2',
  },
];
