# `<clippy-token-detail>`

Renders a detailed view of a design token.

## Usage

```js
import '@nl-design-system-community/clippy-components/clippy-token-detail';

const detail = document.querySelector('clippy-token-detail');

detail.token = {
  $extensions: {
    'nl.nldesignsystem.path': 'path.to.token',
    'nl.nldesignsystem.reference-count': 1,
    'nl.nldesignsystem.referenced-at': ['path.to.other.token'],
    'nl.nldesignsystem.token-subtype': 'border-color',
  },
  $type: 'color',
  $value: '#ff0000',
};
```

```html
<clippy-token-detail></clippy-token-detail>
```

## Attributes

| Attribute / Property      | Type              | Description                                 | Default                       |
| ------------------------- | ----------------- | ------------------------------------------- | ----------------------------- |
| `token`                   | `BaseDesignToken` | The token to display in detail              | `undefined`                   |
| `example-label`           | `string`          | Label for the example title in the modal    | `'Example'`                   |
| `value-label`             | `string`          | Label for the value definition in the modal | `'Value'`                     |
| `reference-title-label`   | `string`          | Label for the reference title in the modal  | `'Where is this token used?'` |
| `copy-to-clipboard-label` | `string`          | Label for the copy to clipboard button      | `'Copy to clipboard: '`       |

## CSS Custom Properties

| Property                                | Type     | Description                 |
| --------------------------------------- | -------- | --------------------------- |
| `--clippy-token-detail-color`           | `string` | Color of the text           |
| `--clippy-token-detail-font-family`     | `string` | Font family of the text     |
| `--clippy-token-detail-font-size`       | `string` | Font size of the text       |
| `--clippy-token-detail-line-height`     | `string` | Line height of the text     |
| `--clippy-token-detail-key-color`       | `string` | Color of the key text       |
| `--clippy-token-detail-key-font-weight` | `string` | Font weight of the key text |
