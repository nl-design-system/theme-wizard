# `<clippy-token-table-color>`

Renders a table of color token groups, one row per group, with a `<clippy-color-sample>` swatch per token (background, border, and foreground columns). Each cell carries a screen-reader-only label with the full token ID.

## Installation

```js
import '@nl-design-system-community/clippy-components/clippy-token-table-color';
```

## Usage

Set the `collection` property with tokens from a theme, for example the `default` and `accent-1` color groups from the [NL Design System Start theme](https://nldesignsystem.nl/handboek/huisstijl/themas/start-thema):

```js
const table = document.querySelector('clippy-token-table-color');

table.collection = [
  {
    name: 'basis.color.default',
    tokens: [
      {
        $extensions: {
          'nl.nldesignsystem.path': 'basis.color.default.bg-document',
          'nl.nldesignsystem.reference-count': 2,
          'nl.nldesignsystem.referenced-at': [
            'basis.form-control.background-color',
            'utrecht.calendar.background-color',
          ],
          'nl.nldesignsystem.token-subtype': 'background-color',
        },
        $type: 'color',
        $value: '#ff0000',
      },
      // ...remaining 13 default color entries
    ],
  },
  {
    name: 'basis.color.accent-1',
    tokens: [
      {
        $extensions: {
          'nl.nldesignsystem.path': 'basis.color.accent-1.bg-document',
          'nl.nldesignsystem.reference-count': 5,
          'nl.nldesignsystem.referenced-at': [
            'basis.color.accent-2.bg-document',
            'basis.color.accent-3.bg-document',
            'basis.color.action-1.bg-document',
            'basis.color.action-2.bg-document',
            'basis.color.selected.bg-document',
          ],
          'nl.nldesignsystem.token-subtype': 'background-color',
        },
        $type: 'color',
        $value: '#00ff00',
      },
      // ...remaining 13 accent-1 color entries
    ],
  },
];
```

```html
<clippy-token-table-color></clippy-token-table-color>
```

Each tokens array is expected to contain all fourteen columns rendered by the table (bg-document, bg-subtle, bg-default, bg-hover, bg-active, border-subtle, border-default, border-hover, border-active, color-subtle, color-default, color-hover, color-active, color-document), in that exact order. See [fixtures.ts](https://github.com/nl-design-system/theme-wizard/blob/main/packages/clippy-components/src/clippy-token-table-color/fixtures.ts) for a complete example.

## Attributes & properties

| Attribute / Property      | Type                | Description                                         | Default                       |
| ------------------------- | ------------------- | --------------------------------------------------- | ----------------------------- |
| `collection`              | `TokenCollection[]` | Token collection to render, one per table row       | `[]`                          |
| `background-label`        | `string`            | Label for the background header in the table        | `'Background'`                |
| `border-label`            | `string`            | Label for the border header in the table            | `'Borders and lines'`         |
| `foreground-label`        | `string`            | Label for the foreground header in the table        | `'Foreground'`                |
| `example-label`           | `string`            | Label for the example title in the modal            | `'Example'`                   |
| `value-label`             | `string`            | Label for the value definition in the modal         | `'Value'`                     |
| `reference-title-label`   | `string`            | Label for the reference title in the modal          | `'Where is this token used?'` |
| `reference-empty-label`   | `string`            | Label for the reference empty state in the modal    | `'This token is not used.'`   |
| `copy-to-clipboard-label` | `string`            | Label for the copy to clipboard button in the modal | `'Copy to clipboard: '`       |
