# `<clippy-popover>`

A generic disclosure: a trigger button that toggles an anchored panel using the
native Popover API. Holds no text of its own — the trigger's icon/content, its
accessible name, and the panel content are all supplied by the caller.

## Usage

```js
import '@nl-design-system-community/clippy-components/clippy-popover';
```

```html
<clippy-popover trigger-label="Show details">
  <span slot="trigger" aria-hidden="true">ℹ️</span>
  <p>Panel content goes here.</p>
</clippy-popover>
```

## Attributes & properties

| Attribute / Property | Type   | Description                                          |
| --------------------- | ------ | ----------------------------------------------------- |
| `trigger-label`        | string | Accessible name for the trigger button. Required for icon-only triggers. |

## Slots

| Slot        | Description                          |
| ----------- | ------------------------------------- |
| `trigger`   | Content of the trigger button (icon)  |
| _(default)_ | Panel content                         |
