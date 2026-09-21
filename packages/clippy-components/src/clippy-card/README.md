# `<clippy-card>`

Non-interactive bare card. Provides the `pre-header`/`header`/`body`/`footer`
slots and a generic card design-token surface as CSS custom properties.
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

## Slots

| Slot         | Description                                            |
| ------------ | ------------------------------------------------------ |
| `pre-header` | Content above the header, e.g. a status/category label |
| `header`     | Card heading region                                    |
| `body`       | Main card content                                      |
| `footer`     | Footer content, e.g. actions or metadata               |

## Extending

`ClippyCard`'s `renderPreHeader()`/`renderHeader()`/`renderBody()`/
`renderFooter()` methods (and the `hasPreHeader`/`hasHeader`/`hasBody`/
`hasFooter` state they read) are `protected`, so a subclass can reuse the
conditional-wrapper regions it needs while replacing the rest of `render()`.
`ClippyCardRadioOption` is an example: it composes its own header markup
(a hidden radio input, `start`/`description` slots) but reuses
`renderBody()`/`renderFooter()` as-is.
