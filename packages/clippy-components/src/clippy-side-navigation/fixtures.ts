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
                href: '#',
                label: 'Page 3.2.1.1',
              },
            ],
            label: 'Page 3.2.1',
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
