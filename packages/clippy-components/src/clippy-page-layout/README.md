# `<clippy-page-layout>`

A component that provides a page layout with a header, content and footer. Pushes the footer to the bottom of the page. Provides a custom property with the size of the header content to use in your application (eg. when the header is sticky).

## Usage

```js
import '@nl-design-system-community/clippy-components/clippy-page-layout';
```

```html
<clippy-page-layout></clippy-page-layout>
```

## Slots

| Attribute / Property | Description             |
| -------------------- | ----------------------- |
| _(default)_          | The content of the page |
| `header`             | The header of the page  |
| `footer`             | The footer of the page  |

## Properties

| Attribute / Property     | Type                  | Description                        | Default   |
| ------------------------ | --------------------- | ---------------------------------- | --------- |
| `layout-block-alignment` | `"start" \| "center"` | Layout alignment on the block-axis | `"start"` |

## CSS Custom Properties

| Attribute / Property                           | Type     | Description                                                                                                        | Default                                  |
| ---------------------------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------ | ---------------------------------------- |
| `--clippy-page-layout-header-block-size`       | `length` | The block-size of the header, for use in you own application. Is automatically updated with JS on load and resize. | `1lh`                                    |
| `--clippy-page-layout-background-color`        | `color`  | The background color                                                                                               | `var(--basis-color-default-bg-document)` |
| `--clippy-page-layout-content-max-inline-size` | `length` | Shared max-inline-size for layouts                                                                                 | `var(--basis-page-max-inline-size)`      |
| `--clippy-page-layout-content-inline-padding`  | `length` | Shared inline padding for layouts                                                                                  | `var(--basis-space-inline-xl)`           |
| `--clippy-page-layout-content-block-padding`   | `length` | Shared block padding for layouts                                                                                   | `var(--basis-space-block-3xl)`           |
