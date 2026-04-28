# `<clippy-icon>`

Decorative icon wrapper. Automatically sets `aria-hidden="true"` on itself so screen readers skip the icon. Size and color are controlled via CSS custom properties.

## Usage

```js
import '@nl-design-system-community/clippy-components/clippy-icon';
```

```html
<clippy-button purpose="primary">
  <clippy-icon slot="iconStart">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">…</svg>
  </clippy-icon>
  Download
</clippy-button>
```

Standalone:

```html
<clippy-icon style="--clippy-icon-size: 24px;">
  <svg>…</svg>
</clippy-icon>
```

## Slots

| Slot        | Description |
| ----------- | ----------- |
| _(default)_ | SVG icon    |

## CSS custom properties

| Property                          | Description                      | Default |
| --------------------------------- | -------------------------------- | ------- |
| `--clippy-icon-size`              | Width and height of the icon     | —       |
| `--clippy-icon-color`             | Color of the icon (sets `color`) | —       |
| `--clippy-icon-inset-block-start` | Vertical offset from baseline    | `0`     |
