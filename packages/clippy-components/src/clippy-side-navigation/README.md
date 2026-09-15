# `<clippy-side-navigation>`

A side navigation component. Based on [SideNavigation from Gemeente Den Haag](https://nl-design-system.github.io/denhaag/?path=/docs/css-sidenavigation--docs) and some [enhancements for nested items from the NL Design System website](https://github.com/nl-design-system/documentatie/blob/5f1e57f4d601fd3926ada8f968d137366e263825/packages/website/src/styles/missing-tokens.css#L160).

## Usage

```js
import '@nl-design-system-community/clippy-components/clippy-side-navigation';
```

```html
<clippy-side-navigation></clippy-side-navigation>
```

## Attributes & properties

| Attribute / Property | Type                  | Description                                               | Default              |
| -------------------- | --------------------- | --------------------------------------------------------- | -------------------- |
| `items`              | `SideNavigationItems` | Array of items to display in the navigation               | `[]`                 |
| `eagerCollapse`      | `boolean`             | When an item is collapsed, collapse all sub-items as well | `false`              |
| `label`              | `string`              | The description of the navigation                         | `undefined`          |
| `label-expand-open`  | `string`              | Label for the expand button in closed state               | `Open submenu for:`  |
| `label-expand-close` | `string`              | Label for the expand button in open state                 | `Close submenu for:` |
