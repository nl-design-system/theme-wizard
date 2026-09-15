import { SideNavigationItems } from './types';

export const full: SideNavigationItems = [
  {
    href: '#',
    label: 'Page 1',
  },
  {
    href: '#',
    items: [
      {
        href: '#',
        label: 'Page 2.1',
      },
      {
        href: '#',
        label: 'Page 2.2',
      },
      {
        href: '#',
        label: 'Page 2.3',
      },
    ],
    label: 'Page 2',
  },
  {
    href: '#',
    items: [
      {
        href: '#',
        label: 'Page 3.1',
      },
      {
        href: '#',
        items: [
          {
            href: '#',
            items: [
              {
                current: true,
                href: '#',
                label: 'Page 3.2.1.1',
              },
              {
                href: '#',
                label: 'Page 3.2.1.2 with a very long title',
              },
            ],
            label: 'Page 3.2.1 with a very long title',
          },
          {
            href: '#',
            label: 'Page 3.2.2',
          },
        ],
        label: 'Page 3.2',
      },
    ],
    label: 'Page 3',
  },
  {
    href: '#',
    label: 'Page 4',
  },
];

export const simple: SideNavigationItems = [
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

export const nestedWithActive: SideNavigationItems = [
  { href: '#', label: 'Page 1' },
  {
    href: '#',
    items: [
      { href: '#', label: 'Page 1.1' },
      {
        href: '#',
        items: [
          { href: '#', label: 'Page 1.1.1' },
          { current: true, href: '#', label: 'Page 1.1.2' },
        ],
        label: 'Page 1.2',
      },
    ],
    label: 'Page 2',
  },
];

export const twoBranches: SideNavigationItems = [
  {
    href: '#',
    items: [{ href: '#', label: 'Page 1.1' }],
    label: 'Page 1',
  },
  {
    href: '#',
    items: [{ href: '#', label: 'Page 2.1' }],
    label: 'Page 2',
  },
];

export const unrelatedActive: SideNavigationItems = [
  {
    href: '#',
    items: [
      { href: '#', label: 'Page 1.1' },
      { current: true, href: '#', label: 'Page 1.2' },
    ],
    label: 'Page 1',
  },
  {
    href: '#',
    items: [{ href: '#', label: 'Page 2.2' }],
    label: 'Page 2',
  },
];

export const linkAttributes: SideNavigationItems = [
  {
    current: true,
    href: '#',
    hreflang: 'nl',
    label: 'Page 1',
    lang: 'nl',
    target: '_blank',
  },
];
