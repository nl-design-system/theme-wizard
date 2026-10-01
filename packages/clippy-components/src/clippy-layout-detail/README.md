# `<clippy-layout-detail>`

A component that provides a layout for a detail view. Roughly based on the `ma-layout-detail` grid on the NLDS website.

## Usage

```js
import '@nl-design-system-community/clippy-components/clippy-layout-detail';
```

```html
<clippy-layout-detail>
  <clippy-side-nav slot="sidebar">
    <!-- Side navigation -->
  </clippy-side-nav>
  <div slot="breadcrumb">
    <!-- Breadcrumb content -->
  </div>
  <clippy-main>
    <!-- Main page content -->
  </clippy-main>
</clippy-layout-detail>
```

## Slots

| Slot         | Description                                |
| ------------ | ------------------------------------------ |
| _(default)_  | Main content of the page                   |
| `sidebar`    | Sidebar content, typically side navigation |
| `breadcrumb` | Breadcrumb navigation area                 |

## CSS Custom Properties

| Property                                              | Type     | Description                                 | Default                                             |
| ----------------------------------------------------- | -------- | ------------------------------------------- | --------------------------------------------------- |
| `--clippy-layout-detail-content-max-inline-size`      | `length` | Max inline size of the content area         | `var(--clippy-page-layout-content-max-inline-size)` |
| `--clippy-layout-detail-content-padding-inline-start` | `length` | Inline start padding of the content element | `var(--basis-space-inline-xl)`                      |
| `--clippy-layout-detail-content-padding-inline-end`   | `length` | Inline end padding of the content element   | `var(--basis-space-inline-xl)`                      |
| `--clippy-layout-detail-content-padding-block-start`  | `length` | Block start padding of the content element  | `var(--basis-space-block-3xl)`                      |
| `--clippy-layout-detail-content-padding-block-end`    | `length` | Block end padding of the content element    | `var(--basis-space-block-3xl)`                      |
| `--clippy-layout-detail-column-gap`                   | `length` | Column gap of the grid                      | `var(--basis-space-column-4xl)`                     |
| `--clippy-layout-detail-sidebar-inline-size`          | `length` | Inline size of the sidebar and the aside    | `300px`                                             |
