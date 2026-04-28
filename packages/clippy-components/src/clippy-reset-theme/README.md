# `<clippy-reset-theme>`

Resets all NL Design System CSS custom properties to their basis token values inside its shadow DOM. Use it to neutralize any inherited theme and render content at its default appearance, for example in a live preview.

The reset stylesheet is a module-level singleton parsed only once and shared across all instances.

## Usage

```js
import '@nl-design-system-community/clippy-components/clippy-reset-theme';
```

```html
<clippy-reset-theme>
  <clippy-button purpose="primary">Default theme</clippy-button>
</clippy-reset-theme>
```

Wrapping content with `<clippy-reset-theme>` ensures that any CSS custom properties set by a parent theme do not bleed through into the slotted content.

## Slots

| Slot        | Description                                  |
| ----------- | -------------------------------------------- |
| _(default)_ | Content to render with a reset (basis) theme |
