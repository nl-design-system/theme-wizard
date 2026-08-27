# `<clippy-token-table>`

Renders a table of tokens of various types and subtypes.

## Usage

```js
import '@nl-design-system-community/clippy-components/clippy-token-table';

const table = document.querySelector('clippy-token-table');

table.tokens = [
  {
    $extensions: {
      'nl.nldesignsystem.path': 'path.to.token.1',
      'nl.nldesignsystem.reference-count': 1,
      'nl.nldesignsystem.referenced-at': ['path.to.other.token'],
      'nl.nldesignsystem.token-subtype': 'border-color',
    },
    $type: 'color',
    $value: '#ff0000',
  },
  {
    $extensions: {
      'nl.nldesignsystem.path': 'path.to.token.2',
      'nl.nldesignsystem.reference-count': 1,
      'nl.nldesignsystem.referenced-at': ['path.to.other.token'],
      'nl.nldesignsystem.token-subtype': 'border-color',
    },
    $type: 'color',
    $value: '#00ff00',
  },
];
```

```html
<clippy-token-table></clippy-token-table>
```

## Attributes & properties

| Attribute / Property      | Type                | Description                                      | Default                       |
| ------------------------- | ------------------- | ------------------------------------------------ | ----------------------------- |
| `tokens`                  | `BaseDesignToken[]` | The design tokens to display.                    | `[]`                          |
| `example-label`           | `string`            | Label for the example header                     | `'Example'`                   |
| `token-id-label`          | `string`            | Label for the token-id header                    | `'Token ID'`                  |
| `value-label`             | `string`            | Label for the value header                       | `'Value'`                     |
| `details-label`           | `string`            | Label for the details header                     | `'Details'`                   |
| `show-details-label`      | `string`            | Label for the show details button                | `'Show details'`              |
| `copy-to-clipboard-label` | `string`            | Label for the copy to clipboard button           | `'Copy to clipboard: '`       |
| `reference-title-label`   | `string`            | Label for the reference label in the modal       | `'Where is this token used?'` |
| `reference-empty-label`   | `string`            | Label for the empty reference label in the modal | `'This token is not used.'`   |

## CSS Custom Properties

| Property                                 | Type     | Description                   |
| ---------------------------------------- | -------- | ----------------------------- |
| `--clippy-token-table-font-family`       | `string` | Font family of the table      |
| `--clippy-token-table-font-size`         | `string` | Font size of the table        |
| `--clippy-token-table-line-height`       | `string` | Line height of the table      |
| `--clippy-token-table-row-gap`           | `string` | Default row gap               |
| `--clippy-token-table-column-gap`        | `string` | Default column gap            |
| `--clippy-token-table-head-font-weight`  | `string` | Font weight of the table head |
| `--clippy-token-table-row-border-color`  | `string` | Border color between rows     |
| `--clippy-token-table-row-padding-block` | `string` | Padding of the rows           |
