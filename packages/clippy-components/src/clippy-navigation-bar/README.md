# `<clippy-navigation-bar>`

A navigation bar component. Renders one layer of navigation items.

## Usage

```js
import '@nl-design-system-community/clippy-components/clippy-navigation-bar';

const nav = document.querySelector('clippy-navigation-bar');
nav.items = [
  {
    label: 'Page 1',
    href: '#',
    current: true,
  },
  {
    label: 'Page 2',
    href: '#',
  },
];
```

```html
<clippy-navigation-bar></clippy-navigation-bar>
```

## Attributes & properties

| Attribute / Property | Type                        | Description                                 | Default     |
| -------------------- | --------------------------- | ------------------------------------------- | ----------- |
| `items`              | [`NavigationItems`](#types) | Array of items to display in the navigation | `[]`        |
| `label`              | `string`                    | The description of the navigation           | `undefined` |

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
