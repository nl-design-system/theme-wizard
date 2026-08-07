# `<clippy-token-sample-text>`

Renders a sample of a text token. Used to illustrate text tokens and their concepts in the NL Design System.

## Usage

```js
import '@nl-design-system-community/clippy-components/clippy-token-sample-text';
```

```html
<!-- default -->
<clippy-token-sample-text></clippy-token-sample-text>

<!-- font-size -->
<clippy-token-sample-text font-size="24px"></clippy-token-sample-text>

<!-- font-family -->
<clippy-token-sample-text font-family="monospace"></clippy-token-sample-text>

<!-- font-weight -->
<clippy-token-sample-text font-weight="bold"></clippy-token-sample-text>

<!-- line-height -->
<clippy-token-sample-text line-height="2"></clippy-token-sample-text>

<!-- color -->
<clippy-token-sample-text color="red"></clippy-token-sample-text>

<!-- truncate -->
<clippy-token-sample-text truncate></clippy-token-sample-text>
```

## Slots

| Slot      | Description  | default                                                 |
| --------- | ------------ | ------------------------------------------------------- |
| `default` | Default slot | "Op brute wijze ving de schooljuf de quasi-kalme lynx." |

## Attributes & properties

| Attribute / Property | Type      | Description   | Default                                     |
| -------------------- | --------- | ------------- | ------------------------------------------- |
| `font-size`          | `string`  | Font size     | `var(--basis-text-font-size-md)`            |
| `font-family`        | `string`  | Font family   | `var(--basis-text-font-family-default)`     |
| `font-weight`        | `string`  | Font weight   | `var(--basis-text-font-weight-default)`     |
| `line-height`        | `string`  | Line height   | `var(--basis-text-line-height-md)`          |
| `color`              | `string`  | Color         | `var(--basis-color-default-color-document)` |
| `truncate`           | `boolean` | Truncate text | `false`                                     |

## CSS Custom Properties

| Property                                 | Description | Default                                     |
| ---------------------------------------- | ----------- | ------------------------------------------- |
| `--clippy-token-sample-text-font-size`   | Font size   | `var(--basis-text-font-size-md)`            |
| `--clippy-token-sample-text-font-family` | Font family | `var(--basis-text-font-family-default)`     |
| `--clippy-token-sample-text-font-weight` | Font weight | `var(--basis-text-font-weight-default)`     |
| `--clippy-token-sample-text-line-height` | Line height | `var(--basis-text-line-height-md)`          |
| `--clippy-token-sample-text-color`       | Color       | `var(--basis-color-default-color-document)` |
