# `<clippy-table-of-contents>`

A table of contents component.

## Usage

```js
import '@nl-design-system-community/clippy-components/clippy-table-of-contents';

const nav = document.querySelector('clippy-table-of-contents');
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
<clippy-table-of-contents></clippy-table-of-contents>
```

## Attributes & properties

| Attribute / Property | Type                        | Description                                 | Default         |
| -------------------- | --------------------------- | ------------------------------------------- | --------------- |
| `items`              | [`NavigationItems`](#types) | Array of items to display in the navigation | `[]`            |
| `label`              | `string`                    | The description of the navigation           | 'Inhoudsopgave' |

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
