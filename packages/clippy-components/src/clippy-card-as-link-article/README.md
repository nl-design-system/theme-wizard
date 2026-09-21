# `<clippy-card-as-link-article>`

An article-style [`clippy-card`](../clippy-card/README.md) composition:
`pre-header` is edge-to-edge media — an image, a status banner — with zero
padding and rounded top corners baked in, stacked above `header`/`body`/
`footer`.

Slot a real `<a href>` as a **direct child** of the `header` slot (with any
heading nested inside it, not the other way around) to make the whole card
a single clickable link — a `::slotted(a)::after` overlay stretches that
anchor's clickable/hoverable/focusable area to cover the whole card, purely
via CSS. See [`clippy-card`'s README](../clippy-card/README.md) for why the
nesting has to go this way, and the general caveats of the pattern (e.g.
z-index if you need a second interactive element inside the card).

For a compact, single-row variant instead, see
[`clippy-card-as-link-horizontal`](../clippy-card-as-link-horizontal/README.md).

```html
<clippy-card-as-link-article>
  <img slot="pre-header" src="..." alt="" />
  <a slot="header" href="/news/123">
    <span>Pre-heading</span>
    <h2>Article title</h2>
  </a>
  <p slot="body">Article summary text.</p>
</clippy-card-as-link-article>
```

## Usage

```js
import '@nl-design-system-community/clippy-components/clippy-card-as-link-article';
```

## CSS Custom Properties

Inherits `clippy-card`'s full token surface — see
[`clippy-card`'s README](../clippy-card/README.md). This component adds no
custom properties of its own: the zeroed pre-header padding is a baked-in
default expressed through `clippy-card`'s existing public custom properties
(still overridable the normal way), and the hover/focus/active states are
styled directly from `--basis-*` design tokens, not through an additional
overridable layer.
