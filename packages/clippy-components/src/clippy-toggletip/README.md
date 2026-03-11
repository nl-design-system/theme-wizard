# clippy-toggletip

A wrapper component that shows a stylable popup tooltip (Semantic UI-like) for a slotted `clippy-button`.

## Usage

```html
<clippy-toggletip text="Copy value to clipboard" position="top">
  <clippy-button purpose="subtle">Copy value</clippy-button>
</clippy-toggletip>
```

## Attributes

- `text`: Fallback tooltip text when the default slot is empty.
- `position`: `top` | `right` | `bottom` | `left` (default: `top`).

## CSS Custom Properties

- `--clippy-toggletip-background-color`
- `--clippy-toggletip-border-radius`
- `--clippy-toggletip-color`
- `--clippy-toggletip-font-size`
- `--clippy-toggletip-line-height`
- `--clippy-toggletip-max-inline-size`
- `--clippy-toggletip-padding-block`
- `--clippy-toggletip-padding-inline`
- `--clippy-toggletip-arrow-size`
- `--clippy-toggletip-offset`
- `--clippy-toggletip-z-index`
