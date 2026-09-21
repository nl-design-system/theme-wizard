# `<clippy-task-navigation>`

A compact, horizontal [`clippy-card`](../clippy-card/README.md) composition
for a single row in a task/step navigation list: `header` and `footer` sit
side by side in a row, with an optional `body` slot for supplementary detail
(e.g. a due date) between them.

Slot a real `<a href>` as a **direct child** of the `header` slot (with any
icon/label nested inside it, not the other way around) to make the whole row
a single clickable link — a `::slotted(a)::after` overlay stretches that
anchor's clickable/hoverable/focusable area to cover the whole row, purely
via CSS. See [`clippy-card`'s README](../clippy-card/README.md) for why the
nesting has to go this way, and the general caveats of the pattern (e.g.
z-index if you need a second interactive element inside the row).

This is the same composition as
[`clippy-card-as-link-horizontal`](../clippy-card-as-link-horizontal/README.md),
with an added `body` slot for a piece of detail between the label and the
trailing content.

```html
<clippy-task-navigation>
  <span slot="start">🎨</span>
  <a slot="header" href="/wizard/typography"> Task description </a>
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
