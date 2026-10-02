# `<clippy-layout-default>`

A component that provides a single column layout, eg. for a login- or a wizard/form page.

## Usage

```js
import '@nl-design-system-community/clippy-components/clippy-layout-default';
```

```html
<clippy-layout-default>
  <div slot="breadcrumb">
    <!-- Breadcrumb content -->
  </div>
  <clippy-main>
    <!-- Main page content -->
  </clippy-main>
</clippy-layout-default>
```

## Slots

| Slot         | Description                                                       |
| ------------ | ----------------------------------------------------------------- |
| _(default)_  | Main content of the page, place your `clippy-main` or `main` here |
| `breadcrumb` | Breadcrumb navigation area                                        |

## CSS Custom Properties

| Property                                               | Type     | Description                                 | Default                        |
| ------------------------------------------------------ | -------- | ------------------------------------------- | ------------------------------ |
| `--clippy-layout-default-content-max-inline-size`      | `length` | Max inline size of the content area         | `45rem`                        |
| `--clippy-layout-default-content-padding-inline-start` | `length` | Inline start padding of the content element | `var(--basis-space-inline-xl)` |
| `--clippy-layout-default-content-padding-inline-end`   | `length` | Inline end padding of the content element   | `var(--basis-space-inline-xl)` |
| `--clippy-layout-default-content-padding-block-start`  | `length` | Block start padding of the content element  | `var(--basis-space-block-3xl)` |
| `--clippy-layout-default-content-padding-block-end`    | `length` | Block end padding of the content element    | `var(--basis-space-block-3xl)` |
