# `<clippy-stack>`

Renders space between child elements, used to create visual hierarchy.

## Usage

```js
import '@nl-design-system-community/clippy-components/clippy-stack';
```

```html
<clippy-stack size="xl">
  <h1>Heading</h1>
  <p>Paragraph</p>
</clippy-stack>
```

## Slots

| Slot      | Description           |
| --------- | --------------------- |
| `default` | Slot for the children |

## Attributes & properties

| Attribute / Property | Type    | Description                        | Default |
| -------------------- | ------- | ---------------------------------- | ------- |
| `size`               | `Sizes` | Size of the space between children | `'md'`  |

## CSS Custom Properties

| Property              | Description                        | Default                     |
| --------------------- | ---------------------------------- | --------------------------- |
| `--clippy-stack-size` | Size of the space between children | `var(--basis-space-row-md)` |
