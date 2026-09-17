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

## CSS Custom Properties

| Attribute / Property                     | Type     | Description                                                                                                        | Default                                  |
| ---------------------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------ | ---------------------------------------- |
| `--clippy-page-layout-header-block-size` | `length` | The block-size of the header, for use in you own application. Is automatically updated with JS on load and resize. | `1lh`                                    |
| `--clippy-page-layout-background-color`  | `color`  | The background color                                                                                               | `var(--basis-color-default-bg-document)` |
