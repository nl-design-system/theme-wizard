# `<clippy-table-of-content>`

A table of content component.

## Usage

```js
import '@nl-design-system-community/clippy-components/clippy-table-of-content';

const nav = document.querySelector('clippy-table-of-content');
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
<clippy-table-of-content></clippy-table-of-content>
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
