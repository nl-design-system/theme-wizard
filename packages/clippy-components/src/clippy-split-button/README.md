# `<clippy-split-button>`

Joins a button at the start and a button at the end, which opens a menu or is a second action, into one control. The corners where the two buttons meet are squared, and their borders form a single line: the divider of a `purpose="primary"` start button, otherwise the border of the end button.

The slotted buttons are expected to render an `nl-button` (such as `<clippy-button>`), which reads its corners from `--nl-button-border-radius`. The split button overrides that per button with the theme's own value, also in right-to-left layouts.

The menu is anchored to the buttons with [CSS anchor positioning](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_anchor_positioning): it opens below them, aligned to the start, and is at least as wide as them. When there is no room, it flips to the other side. Opening and closing the menu, and keyboard handling inside it, are up to the application.

## Usage

```js
import '@nl-design-system-community/clippy-components/clippy-split-button';
```

```html
<clippy-split-button>
  <clippy-button slot="start" purpose="primary">Primary</clippy-button>
  <clippy-button slot="end" purpose="primary" icon-only expanded controls="split-button-menu">
    <clippy-icon slot="iconStart"><svg>…</svg></clippy-icon>
    Primary
  </clippy-button>
  <ul slot="menu" id="split-button-menu" role="menu">
    <li role="none">
      <button class="nl-button nl-button--subtle menu-item" type="button" role="menuitem">Action one</button>
    </li>
  </ul>
</clippy-split-button>
```

The split button can only style the menu itself, not its items. Style the items so they fill the menu and take their corners from `--clippy-split-button-menu-item-border-radius`:

```css
.menu-item {
  --nl-button-border-radius: var(--clippy-split-button-menu-item-border-radius);

  inline-size: 100%;
  justify-content: flex-start;
  white-space: nowrap;
}
```

## Slots

| Slot    | Description                                                                              |
| ------- | ---------------------------------------------------------------------------------------- |
| `start` | The main action                                                                          |
| `end`   | The button at the end, an icon-only `clippy-button` that opens a menu or a second action |
| `menu`  | Optional menu the end button opens, typically a `<ul role="menu">`; hide when closed     |

## CSS Custom Properties

| Property                                        | Description                                                        | Default                                     |
| ----------------------------------------------- | ------------------------------------------------------------------ | ------------------------------------------- |
| `--clippy-split-button-divider-color`           | Line between a `purpose="primary"` start button and the end        | `var(--basis-color-action-1-border-subtle)` |
| `--clippy-split-button-divider-width`           | Width of that line                                                 | `1px`                                       |
| `--clippy-split-button-menu-background-color`   | Background of the menu                                             | `var(--basis-color-default-bg-document)`    |
| `--clippy-split-button-menu-border-color`       | Border color of the menu                                           | `var(--basis-color-default-border-default)` |
| `--clippy-split-button-menu-border-radius`      | Corners of the menu                                                | `var(--basis-border-radius-md)`             |
| `--clippy-split-button-menu-border-width`       | Border width of the menu                                           | `var(--basis-border-width-sm)`              |
| `--clippy-split-button-menu-box-shadow`         | Shadow of the menu                                                 | `var(--basis-box-shadow-md)`                |
| `--clippy-split-button-menu-item-border-radius` | Corners of the menu items, for the application to use on its items | `0`                                         |
