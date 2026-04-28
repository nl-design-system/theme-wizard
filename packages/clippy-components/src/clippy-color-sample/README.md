# `<clippy-color-sample>`

Renders a small square SVG swatch for a given CSS color value. Updates reactively when the `color` property changes. Maintains the color, even when in forced-colors document mode.

Based on [`@nl-design-system-candidate/color-sample-css`](https://www.npmjs.com/package/@nl-design-system-candidate/color-sample-css). See the [NL Design System color sample documentation](https://nldesignsystem.nl/color-sample) for available design tokens and guidelines.

## Usage

```js
import '@nl-design-system-community/clippy-components/clippy-color-sample';
```

```html
<clippy-color-sample color="#c0392b"></clippy-color-sample>
<clippy-color-sample color="oklch(60% 0.2 30)"></clippy-color-sample>
<clippy-color-sample color="rgb(0, 128, 0)"></clippy-color-sample>
```

Setting the property directly also works:

```js
const el = document.querySelector('clippy-color-sample');
el.color = 'rebeccapurple';
```

## Attributes & properties

| Attribute / Property | Type   | Description                | Default |
| -------------------- | ------ | -------------------------- | ------- |
| `color`              | string | Any valid CSS color string | `''`    |
