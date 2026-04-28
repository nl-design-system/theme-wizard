# `<clippy-toggletip>`

Shows a tooltip popup above (or beside) the slotted trigger element on hover or focus. The popup has `role="tooltip"` and is shown purely via CSS `:hover`/`:focus-within`.

## Usage

```js
import '@nl-design-system-community/clippy-components/clippy-toggletip';
```

```html
<clippy-toggletip text="Copy to clipboard" position="block-start">
  <clippy-button purpose="subtle">Copy</clippy-button>
</clippy-toggletip>
```

## Attributes

| Attribute  | Type   | Values                                                         | Default       |
| ---------- | ------ | -------------------------------------------------------------- | ------------- |
| `text`     | string | Tooltip text                                                   | `''`          |
| `position` | string | `block-start` \| `block-end` \| `inline-start` \| `inline-end` | `block-start` |

An invalid `position` value logs a console warning and falls back to `block-start`.

## Slots

| Slot        | Description                                    |
| ----------- | ---------------------------------------------- |
| _(default)_ | The trigger element (button, link, or similar) |

## CSS custom properties

| Property                              | Description                   | Default                                       |
| ------------------------------------- | ----------------------------- | --------------------------------------------- |
| `--clippy-toggletip-background-color` | Tooltip background            | `--basis-color-default-inverse-bg-document`   |
| `--clippy-toggletip-color`            | Tooltip text color            | `--basis-color-default-inverse-color-default` |
| `--clippy-toggletip-font-size`        | Tooltip font size             | `--basis-text-font-size-sm`                   |
| `--clippy-toggletip-line-height`      | Tooltip line height           | `--basis-text-line-height-sm`                 |
| `--clippy-toggletip-border-radius`    | Tooltip corner radius         | `--basis-border-radius-sm`                    |
| `--clippy-toggletip-padding-block`    | Block (vertical) padding      | `--basis-space-block-sm`                      |
| `--clippy-toggletip-padding-inline`   | Inline (horizontal) padding   | `--basis-space-inline-md`                     |
| `--clippy-toggletip-max-inline-size`  | Maximum tooltip width         | `18rem`                                       |
| `--clippy-toggletip-arrow-size`       | Arrow size                    | `0.5rem`                                      |
| `--clippy-toggletip-offset`           | Gap between trigger and popup | `--clippy-toggletip-arrow-size`               |
| `--clippy-toggletip-z-index`          | Stacking order                | `10`                                          |
