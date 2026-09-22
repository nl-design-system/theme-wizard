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
[`clippy-card-as-link`](../clippy-card-as-link/README.md)'s `variant="list-item"`,
with an added `body` slot for a piece of detail between the label and the
trailing content.

```html
<clippy-task-navigation>
  <span slot="header">
    <span slot="start">🎨</span>
    <span>Task description</span>
  </span>
  <time slot="body" datetime="2025-01-01">1 jan 2025</time>
  <span slot="footer">→</span>
  <a slot="link" href="/tasks/1">Navigate to <q>Task</q></a>
</clippy-task-navigation>
```

## Usage

```js
import '@nl-design-system-community/clippy-components/clippy-task-navigation';
```
