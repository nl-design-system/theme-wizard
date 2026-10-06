# `<clippy-layout>`

A component that provides a single column layout, eg. for a login- or a wizard/form page.

## Usage

```js
import '@nl-design-system-community/clippy-components/clippy-layout';
```

```html
<clippy-layout>
  <clippy-side-navigation slot="sidebar">
    <!-- Side navigation content -->
  </clippy-side-navigation>
  <div slot="breadcrumb">
    <!-- Breadcrumb content -->
  </div>
  <clippy-main>
    <!-- Main page content -->
  </clippy-main>
</clippy-layout>
```

## Slots

| Slot         | Description                                                       |
| ------------ | ----------------------------------------------------------------- |
| _(default)_  | Main content of the page, place your `clippy-main` or `main` here |
| `breadcrumb` | Breadcrumb navigation area                                        |

## CSS Custom Properties

| Property                                       | Type     | Description                                 | Default                        |
| ---------------------------------------------- | -------- | ------------------------------------------- | ------------------------------ |
| `--clippy-layout-content-max-inline-size`      | `length` | Max inline size of the content area         | `45rem`                        |
| `--clippy-layout-content-padding-inline-start` | `length` | Inline start padding of the content element | `var(--basis-space-inline-xl)` |
| `--clippy-layout-content-padding-inline-end`   | `length` | Inline end padding of the content element   | `var(--basis-space-inline-xl)` |
| `--clippy-layout-content-padding-block-start`  | `length` | Block start padding of the content element  | `var(--basis-space-block-3xl)` |
| `--clippy-layout-content-padding-block-end`    | `length` | Block end padding of the content element    | `var(--basis-space-block-3xl)` |
