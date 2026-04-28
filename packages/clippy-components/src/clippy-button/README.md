# `<clippy-button>`

Styled button following NL Design System conventions. Supports purposes, hints, sizes, toggle state, busy state, and icon-only mode.

Based on [`@nl-design-system-candidate/button-css`](https://www.npmjs.com/package/@nl-design-system-candidate/button-css). See the [NL Design System button documentation](https://nldesignsystem.nl/button) for available design tokens and guidelines.

## Usage

```js
import '@nl-design-system-community/clippy-components/clippy-button';
```

```html
<clippy-button purpose="primary">Save</clippy-button>

<clippy-button purpose="secondary" hint="negative" busy>Deleting&hellip;</clippy-button>

<clippy-button icon-only purpose="subtle">
  <clippy-icon slot="iconStart"><svg>…</svg></clippy-icon>
  Close
</clippy-button>

<clippy-button toggle .pressed="${isActive}" @click="${toggle}"> Notifications </clippy-button>
```

## Attributes

| Attribute   | Type    | Values                               | Default  |
| ----------- | ------- | ------------------------------------ | -------- |
| `purpose`   | string  | `primary` \| `secondary` \| `subtle` | —        |
| `hint`      | string  | `positive` \| `negative`             | —        |
| `size`      | string  | `small` \| `medium`                  | `medium` |
| `type`      | string  | `button` \| `submit` \| `reset`      | `button` |
| `busy`      | boolean | —                                    | `false`  |
| `toggle`    | boolean | —                                    | —        |
| `pressed`   | boolean | —                                    | `false`  |
| `icon-only` | boolean | —                                    | `false`  |
| `disabled`  | boolean | —                                    | `false`  |

Invalid values for `purpose`, `hint`, `size`, and `type` log a console warning and fall back to the default.

## Slots

| Slot        | Description                 |
| ----------- | --------------------------- |
| _(default)_ | Button label text           |
| `iconStart` | Icon displayed before label |
| `iconEnd`   | Icon displayed after label  |

## CSS custom properties

These apply when `size="small"`:

| Property                                | Default |
| --------------------------------------- | ------- |
| `--clippy-button-small-min-inline-size` | `32px`  |
| `--clippy-button-small-min-block-size`  | `32px`  |
| `--clippy-button-small-icon`            | `18px`  |
