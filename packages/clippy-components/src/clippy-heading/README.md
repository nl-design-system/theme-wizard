# `<clippy-heading>`

Heading element that renders the correct `h1`–`h6` tag with NL Design System heading styles. The level can be set as an attribute or property and updates reactively.

Based on [`@nl-design-system-candidate/heading-css`](https://www.npmjs.com/package/@nl-design-system-candidate/heading-css). See the [NL Design System heading documentation](https://nldesignsystem.nl/heading) for available design tokens and guidelines.

## Usage

```js
import '@nl-design-system-community/clippy-components/clippy-heading';
```

```html
<clippy-heading>Page title</clippy-heading>
<clippy-heading level="2">Section title</clippy-heading>
<clippy-heading level="3">Subsection</clippy-heading>
```

## Attributes & properties

| Attribute / Property | Type   | Values  | Default |
| -------------------- | ------ | ------- | ------- |
| `level`              | number | `1`–`6` | `1`     |

Values outside the 1–6 range are clamped. Non-numeric values fall back to `1`.

## Slots

| Slot        | Description     |
| ----------- | --------------- |
| _(default)_ | Heading content |
