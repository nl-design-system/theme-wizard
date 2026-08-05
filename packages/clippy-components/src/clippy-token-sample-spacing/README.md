# `<clippy-token-sample-spacing>`

Renders a sample of a spacing token. Used to illustrate spacing tokens and their concepts in the NL Design System.

## Usage

```js
import '@nl-design-system-community/clippy-components/clippy-token-sample-spacing';
```

```html
<!-- standard, defaults to `inline` `conept` -->
<clippy-token-sample-spacing size="3rem"></clippy-token-sample-spacing>

<!-- Concepts -->
<clippy-token-sample-spacing size="3rem" concept="block"></clippy-token-sample-spacing>

<!-- Custom labels -->
<clippy-token-sample-spacing size="3rem" concept="block">
  <span slot="label">item</span>
  <!-- Only available to `row`, `column` and `text` concepts -->
  <span slot="label-start">item</span>
</clippy-token-sample-spacing>
```

## Slots

| Slot          | Description                                                                          | default                  |
| ------------- | ------------------------------------------------------------------------------------ | ------------------------ |
| `label`       | Slot for the default label                                                           | `label`                  |
| `label-start` | Slot for the secondary label, only available to `row`, `column` and `text` concepts. | `label` or `clippy-icon` |

## Attributes & properties

| Attribute / Property | Type     | Description                                                                                                  | Default     |
| -------------------- | -------- | ------------------------------------------------------------------------------------------------------------ | ----------- |
| `concept`            | `string` | Spacing token concept, see [concepts](https://nldesignsystem.nl/richtlijnen/stijl/ruimte/spacing-concepten/) | `'inine'`   |
| `size`               | `string` | Spacing token size                                                                                           | `undefined` |

## CSS Custom Properties

| Property                                        | Description                                               | Default                                              |
| ----------------------------------------------- | --------------------------------------------------------- | ---------------------------------------------------- |
| `--clippy-token-sample-spacing-size`            | Size of the spacing illustration                          | `undefined`                                          |
| `--clippy-token-sample-spacing-bg-color-inline` | bg-color of the `inline` spacing illustration             | `#F2C9DC`                                            |
| `--clippy-token-sample-spacing-bg-color-block`  | bg-color of the `block` spacing illustration              | `#E289B1`                                            |
| `--clippy-token-sample-spacing-bg-color-text`   | bg-color of the `text` spacing illustration               | `#4AD571`                                            |
| `--clippy-token-sample-spacing-bg-color-row`    | bg-color of the `row` spacing illustration                | `#40ADEF`                                            |
| `--clippy-token-sample-spacing-bg-color-column` | bg-color of the `column` spacing illustration             | `#ABDBF8`                                            |
| `--clippy-token-sample-spacing-bg-color`        | bg color of the illustration (overrides all other colors) | `var(--clippy-token-sample-spacing-bg-color-inline)` |
