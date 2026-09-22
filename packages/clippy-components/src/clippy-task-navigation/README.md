# `<clippy-task-navigation>`

A compact, horizontal [`clippy-card-as-link`](../clippy-card-as-link/README.md)
composition for a single row in a task/step navigation list: `header` and
`footer` sit side by side in a row, with an optional `body` slot for
supplementary detail (e.g. a due date) between them.

Slot a real `<a slot="link" href>` as a direct child, with its text content
carrying the link's accessible name, to make the whole row a single
clickable link. See
[`clippy-card-as-link`'s README](../clippy-card-as-link/README.md) for how
the `link` slot is stretched to cover the whole row, and the general
caveats of the pattern (e.g. z-index if you need a second interactive
element inside the row).

This is the same composition as
[`clippy-card-as-link-horizontal`](../clippy-card-as-link-horizontal/README.md),
with an added `body` slot for a piece of detail between the label and the
trailing content.

```html
<clippy-task-navigation>
  <a slot="link" href="/wizard/typography">Task description</a>
  <span slot="header">
    <span slot="start">🎨</span>
    <span>Task description</span>
  </span>
  <time slot="body" datetime="2025-01-01">1 jan 2025</time>
  <span slot="footer">→</span>
</clippy-task-navigation>
```

## Usage

```js
import '@nl-design-system-community/clippy-components/clippy-task-navigation';
```

## CSS Custom Properties

Inherits `clippy-card`'s full token surface — see
[`clippy-card`'s README](../clippy-card/README.md). This component adds no
custom properties of its own: the row layout (`flex-direction: row`, centered
alignment, the header growing to fill the row, zero footer start-padding) is
a baked-in default, and the hover/focus/active states are styled directly
from `--basis-*` design tokens, not through an additional overridable layer.
