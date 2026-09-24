# `<clippy-page-header>`

A component that provides a page header with support for logo, navigation, actions, and a mobile drawer menu.

## Usage

```js
import '@nl-design-system-community/clippy-components/clippy-page-header';
```

```html
<clippy-page-header>
  <img slot="logo" src="logo.svg" alt="Logo" />
  <clippy-navigation-bar slot="navigation-bar"></clippy-navigation-bar>
  <clippy-side-navigation slot="navigation-drawer"></clippy-side-navigation>
</clippy-page-header>
```

## Attributes & properties

| Attribute / Property | Type   | Description                           | Default          |
| -------------------- | ------ | ------------------------------------- | ---------------- |
| `variant`            | string | `default` \| `compact`                | `default`        |
| `label-menu-item`    | string | Label for the mobile menu button      | `Menu`           |
| `label-drawer-title` | string | Title for the mobile drawer (sr-only) | `Hoofdnavigatie` |

## Slots

| Slot                | Description                                |
| ------------------- | ------------------------------------------ |
| _(default)_         | The main content of the page               |
| `logo`              | The logo to display                        |
| `navigation-bar`    | Navigation bar content                     |
| `navigation-drawer` | Navigation content for the mobile drawer   |
| `end`               | Content to display at the end, eg. actions |

## CSS Custom Properties

| Property                                       | Type     | Description                             | Default                                                                                |
| ---------------------------------------------- | -------- | --------------------------------------- | -------------------------------------------------------------------------------------- |
| `--clippy-page-header-content-max-inline-size` | `length` | Maximum inline size of the content area | `var(--clippy-page-layout-content-max-inline-size, var(--basis-page-max-inline-size))` |
