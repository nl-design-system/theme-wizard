# `<clippy-breadcrumb-navigation>`

A clippy breadcrumb navigation component.

## Usage

```js
import '@nl-design-system-community/clippy-components/clippy-breadcrumb-navigation';

const nav = document.querySelector('clippy-breadcrumb-navigation');
nav.items = [
  {
    label: 'Path',
    href: '#',
  },
  {
    label: 'To',
    href: '#',
  },
  {
    label: 'Page',
    href: '#',
    current: true,
  },
];
```

```html
<clippy-breadcrumb-navigation></clippy-breadcrumb-navigation>
```

## Attributes & properties

| Attribute / Property | Type                        | Description                                 | Default      |
| -------------------- | --------------------------- | ------------------------------------------- | ------------ |
| `items`              | [`NavigationItems`](#types) | Array of items to display in the navigation | `[]`         |
| `label`              | `string`                    | The description of the navigation           | `Kruimelpad` |

## Types

```ts
interface NavigationItem {
  label: string;
  href: string;
  current?: boolean;
  items?: NavigationItem[];
  target?: string;
  hreflang?: string;
  lang?: string;
}

type NavigationItems = NavigationItem[];
```
