# `<clippy-task-navigation>`

Navigation item linking to a single task. Renders a styled anchor with optional icon, details, and action slots. Focus styles work without needing Den Haag design tokens loaded.

Based on [`@gemeente-denhaag/action`](https://npmx.dev/package/@gemeente-denhaag/action). See the [Den Haag action documentation](https://nl-design-system.github.io/denhaag/?path=/docs/css-action--docs) for available design tokens and guidelines.

## Usage

```js
import '@nl-design-system-community/clippy-components/clippy-task-navigation';
```

```html
<clippy-task-navigation href="/wizard/typography">Task description</clippy-task-navigation>
```

With icon and action indicator:

```html
<clippy-task-navigation href="/wizard/typography">
  <clippy-icon slot="iconStart"><svg>…</svg></clippy-icon>
  Task description
  <clippy-icon slot="actions"><svg>…</svg></clippy-icon>
</clippy-task-navigation>
```

## Attributes & properties

| Attribute / Property | Type   | Description | Default |
| -------------------- | ------ | ----------- | ------- |
| `href`               | string | Link URL    | `''`    |

## Slots

| Slot        | Description                                                                                          |
| ----------- | ---------------------------------------------------------------------------------------------------- |
| _(default)_ | Task label                                                                                           |
| `iconStart` | Icon placed before the label                                                                         |
| `details`   | Supplementary info (e.g. due date) shown below or next to the label, depending on screen real estate |
| `actions`   | Action indicator (e.g. chevron) shown at the end                                                     |

## CSS custom properties

| Property                                    | Description                           |
| ------------------------------------------- | ------------------------------------- |
| `--clippy-task-navigation-icon-start-align` | `align-self` for the `iconStart` slot |
