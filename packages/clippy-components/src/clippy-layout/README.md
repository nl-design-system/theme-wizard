# `<clippy-layout>`

A component that provides a layout for a overview page. Roughly based on the `ma-layout-overview` grid on the NLDS website.

## Usage

```js
import '@nl-design-system-community/clippy-components/clippy-layout';
```

```html
<clippy-layout>
  <clippy-side-navigation slot="sidebar">
    <!-- Side navigation -->
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
| `sidebar`    | Sidebar content, typically side navigation                        |
| `breadcrumb` | Breadcrumb navigation area                                        |

## Attributes & properties

| Attribute / Property | Type   | Values                | Default   |
| -------------------- | ------ | --------------------- | --------- |
| `purpose`            | string | `default` \| `detail` | `default` |
| `size`               | string | `md` \| `sm` \| `xs`  | `md`      |

## CSS Custom Properties

| Property                                       | Type     | Description                                        | Default                                             |
| ---------------------------------------------- | -------- | -------------------------------------------------- | --------------------------------------------------- |
| `--clippy-layout-content-max-inline-size`      | `length` | Max inline size of the content area with size="md" | `var(--clippy-page-layout-content-max-inline-size)` |
| `--clippy-layout-content-sm-max-inline-size`   | `length` | Max inline size of the content area with size="sm" | `960px`                                             |
| `--clippy-layout-content-xs-max-inline-size`   | `length` | Max inline size of the content area with size="xs" | `640px`                                             |
| `--clippy-layout-content-padding-inline-start` | `length` | Inline start padding of the content element        | `var(--basis-space-inline-xl)`                      |
| `--clippy-layout-content-padding-inline-end`   | `length` | Inline end padding of the content element          | `var(--basis-space-inline-xl)`                      |
| `--clippy-layout-content-padding-block-start`  | `length` | Block start padding of the content element         | `var(--basis-space-block-3xl)`                      |
| `--clippy-layout-content-padding-block-end`    | `length` | Block end padding of the content element           | `var(--basis-space-block-3xl)`                      |
| `--clippy-layout-column-gap`                   | `length` | Column gap of the grid                             | `var(--basis-space-column-4xl)`                     |
| `--clippy-layout-row-gap`                      | `length` | Row gap of the grid                                | `var(--basis-space-row-xl)`                         |
| `--clippy-layout-sidebar-inline-size`          | `length` | Inline size of the sidebar and the aside           | `300px`                                             |
