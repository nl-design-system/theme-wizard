# `<clippy-card>`

**Low-level building block.** Intended to be extended or composed into concrete card components. Non-interactive bare card. Provides the `pre-header`/`header`/`body`/`footer` slots and a generic card design-token surface as CSS custom properties.
Use this component as a primitive for building components like `clippy-card-as-link` or `clippy-card-radio-option` (a selectable card).

## Usage

```js
import '@nl-design-system-community/clippy-components/clippy-card';
```

```html
<clippy-card>
  <h2 slot="header">Card title</h2>
  <span slot="pre-header">Status: open</span>
  <p slot="body">Card description text.</p>
  <div slot="footer">Footer actions</div>
</clippy-card>
```

Each region only renders a wrapper `<div>` (for padding/gap) when it actually
has slotted content — an empty region contributes no layout.

## Features

- Highly composable element
- Solves DOM order vs. visual order for the 'eyebrow'/pre-header slot
- Renders a 1px border by default as an affordance that this is in fact a card

## Slots

| Slot         | Description                                                                                                                                                                         |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `link`       | Reserved for card-as-link variants (e.g. [`clippy-card-as-link`](../clippy-card-as-link/README.md)) — a direct-child `<a>` here is inert unless paired with such a variant's styles |
| `pre-header` | Content above the header, e.g. a status/category label                                                                                                                              |
| `header`     | Card heading region                                                                                                                                                                 |
| `body`       | Main card content                                                                                                                                                                   |
| `footer`     | Footer content, e.g. actions or metadata                                                                                                                                            |

## Extending

`ClippyCard`'s `renderPreHeader()`/`renderHeader()`/`renderBody()`/
`renderFooter()` methods (and the `hasPreHeader`/`hasHeader`/`hasBody`/
`hasFooter` state they read) are `protected`, so a subclass can reuse the
conditional-wrapper regions it needs while replacing the rest of `render()`.
`ClippyCardRadioOption` is an example: it composes its own header markup
(a hidden radio input, `start`/`description` slots) but reuses
`renderBody()`/`renderFooter()` as-is.
