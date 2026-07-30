# `<clippy-token-color-table>`

Renders a table of color token groups, one row per group, with a `<clippy-color-sample>` swatch per token (background, border, and foreground columns). Each cell carries a screen-reader-only label with the full token ID.

## Installation

```js
import '@nl-design-system-community/clippy-components/clippy-token-color-table';
```

## Usage

Set the `groups` property with token groups from a theme, for example the `default` and `accent-1` color groups from the [NL Design System Start theme](https://nldesignsystem.nl/handboek/huisstijl/themas/start-thema):

```js
const table = document.querySelector('clippy-token-color-table');

table.groups = [
  {
    key: 'default',
    colorEntries: [
      {
        colorKey: 'bg-document',
        tokenId: 'basis.color.default.bg-document',
        displayValue: '#fffcff',
        usage: ['utrecht.document.background-color', 'utrecht.page-body.background-color'],
        usageCount: 13,
      },
      {
        colorKey: 'color-document',
        tokenId: 'basis.color.default.color-document',
        displayValue: '#120031',
        usage: ['utrecht.document.color', 'utrecht.paragraph.color'],
        usageCount: 67,
      },
      // ...remaining 13 default color entries
    ],
  },
  {
    key: 'accent-1',
    colorEntries: [
      {
        colorKey: 'bg-document',
        tokenId: 'basis.color.accent-1.bg-document',
        displayValue: '#fbfcfd',
        usage: ['basis.color.accent-2.bg-document', 'basis.color.selected.bg-document'],
        usageCount: 4,
      },
      {
        colorKey: 'color-document',
        tokenId: 'basis.color.accent-1.color-document',
        displayValue: '#001b3c',
        usage: ['basis.color.accent-2.color-document', 'ams.page-header.brand-name.color'],
        usageCount: 5,
      },
      // ...remaining 13 accent-1 color entries
    ],
  },
];
```

```html
<clippy-token-color-table></clippy-token-color-table>
```

Each colorEntries array is expected to contain all fourteen columns rendered by the table (bg-document, bg-subtle, bg-default, bg-hover, bg-active, border-subtle, border-default, border-hover, border-active, color-subtle, color-default, color-hover, color-active, color-document), in that exact order. See [fixtures.ts](https://github.com/nl-design-system/theme-wizard/blob/main/packages/clippy-components/src/clippy-token-color-table/fixtures.ts) for a complete example.

## Attributes & properties

| Attribute / Property | Type           | Description                               | Default |
| -------------------- | -------------- | ----------------------------------------- | ------- |
| `groups`             | `ColorGroup[]` | Token groups to render, one per table row | `[]`    |
