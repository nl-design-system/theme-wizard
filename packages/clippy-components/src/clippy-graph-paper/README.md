# `<clippy-graph-paper>`

Renders slotted content on top of a graph paper style background grid. Useful as a neutral backdrop for previewing typography or spacing tokens.

## Usage

```js
import '@nl-design-system-community/clippy-components/clippy-graph-paper';
```

```html
<clippy-graph-paper>
  <p>Placeholder content</p>
</clippy-graph-paper>

<!-- Custom grid -->
<clippy-graph-paper style="--clippy-graph-paper-cell-size: 16px;">
  <p>Placeholder content</p>
</clippy-graph-paper>
```

## Slots

| Slot        | Description |
| ----------- | ----------- |
| _(default)_ | Content     |

## CSS custom properties

| Property                                   | Description                              |
| ------------------------------------------ | ---------------------------------------- |
| `--clippy-graph-paper-cell-size`           | Size of one grid cell                    |
| `--clippy-graph-paper-line-size`           | Thickness of the grid lines              |
| `--clippy-graph-paper-minor-line-color`    | Color of the minor (per-cell) grid lines |
| `--clippy-graph-paper-major-line-color`    | Color of the major grid lines            |
| `--clippy-graph-paper-major-line-interval` | Number of cells between major grid lines |
