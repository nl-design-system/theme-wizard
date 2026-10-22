# `<clippy-theme-provider>`

Applies a theme — a plain design-token JSON object, the same shape as any imported token file — to its subtree as CSS custom properties. Under the hood it builds a `CSSStyleSheet` from the `theme` tokens and adopts it onto its own host element (`shadowRoot.adoptedStyleSheets`), so the custom properties cascade into the shadow tree and any slotted content. Does exactly one thing: tokens in, CSS custom properties out. No framework or state-management coupling.

## Usage

```js
import '@nl-design-system-community/clippy-components/clippy-theme-provider';
```

```html
<clippy-reset-theme>
  <clippy-theme-provider .theme="${myTheme}">
    <clippy-button purpose="primary">Themed button</clippy-button>
  </clippy-theme-provider>
</clippy-reset-theme>
```

`theme` is an object property (bind it with `.theme=`, not as a string attribute). Pair it with [`<clippy-reset-theme>`](../clippy-reset-theme) as the outermost wrapper to guarantee no custom properties leak in from an ancestor theme before this theme's values are applied.

Updating `.theme` on an existing instance updates its custom properties live.

## Nesting

Custom properties set on a provider's `:host` cascade into its own shadow tree and into any slotted content, through further nested providers' shadow boundaries. A nested `<clippy-theme-provider>` only needs to set the tokens it wants to override — everything else inherits from the ancestor provider:

```html
<clippy-theme-provider .theme=${brandTheme}>
  <clippy-card>
    <clippy-theme-provider .theme=${{ color: { accent: { $value: 'purple', $type: 'color' } } }}>
      <!-- only --color-accent changes here; everything else still comes from brandTheme -->
    </clippy-theme-provider>
  </clippy-card>
</clippy-theme-provider>
```

## Properties

| Property | Type         | Description                                                      |
| -------- | ------------ | ---------------------------------------------------------------- |
| `theme`  | `TokenGroup` | A design-token JSON tree (DTCG-shaped, `$value`/`$type` leaves). |

## Slots

| Slot        | Description                            |
| ----------- | -------------------------------------- |
| _(default)_ | Content to render with the given theme |
