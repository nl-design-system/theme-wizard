# `<clippy-card-as-link>`

A [`clippy-card`](../clippy-card/README.md) made entirely clickable by a
single `<a slot="link">` — a direct child of the host, whose text content is
the link's accessible name.

```html
<clippy-card-as-link>
  <a slot="link" href="/settings/theme">Met de huisstijl van een bestaande website</a>
  <h2 slot="header">Met de huisstijl van een bestaande website</h2>
</clippy-card-as-link>
```

## How it works

`clippy-card` itself already renders the `link` slot (right after `header`,
for assistive-technology reading order) — this component adds no markup of
its own beyond a small focus listener. The slotted anchor is stretched
(`position: absolute; inset: 0`) to cover the whole card, and its own text
is visually hidden — not `display: none`, assistive tech still reads it —
since the visible heading/icon/etc. live independently in the regular
`pre-header`/`header`/`body`/`footer` slots. `:host` must not set its own
`position`; the component sets `position: relative` for the anchor to
stretch against.

`:hover`/`:active` read as "the whole card" via plain `:host(:hover)`/
`:host(:active)` — normal event bubbling, no special handling needed.
`:focus-visible` does need a small JS assist: `:host(:has(:focus-visible))`
doesn't reliably re-invalidate across the shadow boundary on dynamic
pseudo-class changes ([w3c/csswg-drafts#5893](https://github.com/w3c/csswg-drafts/issues/5893)),
and `::slotted(a:focus-visible)` can only style the anchor itself, not the
whole card. So a `focusin`/`focusout` listener reflects a `link-focus-visible`
attribute onto the host, which `:host([link-focus-visible])` styles instead.

If a card needs a second interactive element (e.g. a button in the footer),
give it `position: relative` and a higher `z-index` than the link so it
stays reachable above it.

For a compact, horizontal row layout built on top of this, see
[`clippy-card-as-link-horizontal`](../clippy-card-as-link-horizontal/README.md).

## Usage

```js
import '@nl-design-system-community/clippy-components/clippy-card-as-link';
```

## Slots

| Slot         | Description                                                                  |
| ------------ | ---------------------------------------------------------------------------- |
| `link`       | The card's link — a direct-child `<a href>`; its text is the accessible name |
| `pre-header` | Content above the header, e.g. a status/category label                       |
| `header`     | Card heading region                                                          |
| `body`       | Main card content                                                            |
| `footer`     | Footer content, e.g. actions or metadata                                     |

## CSS Custom Properties

Inherits `clippy-card`'s full token surface — see
[`clippy-card`'s README](../clippy-card/README.md). This component adds no
custom properties of its own: the link's hover/focus/active states are
styled directly from `--basis-*` design tokens.
