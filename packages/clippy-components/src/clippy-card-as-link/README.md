# `<clippy-card-as-link>`

- **Low-level building block.** A [`clippy-card`](../clippy-card/README.md) made entirely clickable by a single `<a slot="link">` — a direct child of the host, whose text content is the link's accessible name.
- The top-level `slot="link"` both forces the author to come up with an accessible label for the anchor tag and lets the `clippy-card` component put the link in a relevant position in the accessibility tree.
- This inversion-of-control pattern also keeps any link-related logic out of the component, so any affordances of an `<a>` work out of the box! (shift+click to open in a new tab, right click for context menu, middle-click to open in background tab, etc.)

```html
<clippy-card-as-link>
  <h2 slot="header">Huisstijl bewerken</h2>
  <a slot="link" href="/settings/theme">Ga naar <q>Huisstijl bewerken</q></a>
</clippy-card-as-link>
```

## Variants

Set `variant="list-item"` for a compact, horizontal composition.

```html
<clippy-card-as-link variant="list-item">
  <span slot="header">
    <span slot="start">🔗</span>
    <h2>Met de huisstijl van een bestaande website</h2>
    <span>Vul een URL in.</span>
  </span>
  <span slot="footer">→</span>
  <a slot="link" href="/settings/theme">Navigeer naar <q>huisstijl van een bestaande website halen</q></a>
</clippy-card-as-link>
```

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

## Attributes

| Attribute | Description                                                                       |
| --------- | --------------------------------------------------------------------------------- |
| `variant` | `"list-item"` switches to the compact, horizontal row layout — see Variants above |
