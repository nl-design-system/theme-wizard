# `<clippy-card-as-link-horizontal>`

A compact, horizontal [`clippy-card-as-link`](../clippy-card-as-link/README.md)
composition: `header` and `footer` sit side by side in a single row instead
of stacking. Typically used for a short link row — a leading icon, a title
(plus optional subtitle), and a trailing icon.

Slot a real `<a slot="link" href>` as a direct child, with its text content
carrying the link's accessible name, to make the whole row a single
clickable link. See
[`clippy-card-as-link`'s README](../clippy-card-as-link/README.md) for how
the `link` slot is stretched to cover the whole row, and the general
caveats of the pattern (e.g. z-index if you need a second interactive
element inside the row).

For a stacked, image-led card instead, see
[`clippy-card-as-link-article`](../clippy-card-as-link-article/README.md).

```html
<clippy-card-as-link-horizontal>
  <a slot="link" href="/settings/theme">Met de huisstijl van een bestaande website</a>
  <span slot="header">
    <span slot="start">🔗</span>
    <h2>Met de huisstijl van een bestaande website</h2>
    <span>Vul een URL in.</span>
  </span>
  <span slot="footer">→</span>
</clippy-card-as-link-horizontal>
```

## Usage

```js
import '@nl-design-system-community/clippy-components/clippy-card-as-link-horizontal';
```

## CSS Custom Properties

Inherits `clippy-card`'s full token surface — see
[`clippy-card`'s README](../clippy-card/README.md). This component adds no
custom properties of its own: the row layout (`flex-direction: row`,
centered/spread alignment, zero footer start-padding) is a baked-in default,
and the hover/focus/active states are styled directly from `--basis-*`
design tokens, not through an additional overridable layer.
