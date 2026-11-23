# `<clippy-token-tree-table>`

Renders the token group at `path` of a full token tree as a table. Nested groups are rendered as group header rows followed by their tokens.

## Usage

```js
import '@nl-design-system-community/clippy-components/clippy-token-tree-table';

const table = document.querySelector('clippy-token-tree-table');

table.theme = {
  basis: {
    color: {
      'accent-1': {
        'bg-default': { $type: 'color', $value: '#ff0000' },
        'bg-subtle': { $type: 'color', $value: '{basis.color.accent-1.bg-default}' },
      },
    },
  },
};
```

```html
<clippy-token-tree-table path="basis.color"></clippy-token-tree-table>
```

`theme` can also be set as an HTML attribute containing a JSON string.

When `theme` is not passed, or is `null` or `undefined`, the element renders nothing. When `path` does not point to a token group, the table renders with an empty body.

## Attributes & properties

| Attribute / Property | Type                 | Description                                                  | Default     |
| -------------------- | -------------------- | ------------------------------------------------------------ | ----------- |
| `theme`              | `TokenGroup \| null` | The full token tree. Renders nothing when not set.           | `undefined` |
| `path`               | `string`             | Dot-separated path to the group to render; also the caption. | `''`        |
| `example-label`      | `string`             | Label for the example header                                 | `'Example'` |
| `name-label`         | `string`             | Label for the name header                                    | `'Name'`    |
| `value-label`        | `string`             | Label for the value header                                   | `'Value'`   |
| `actions-label`      | `string`             | Label for the actions header                                 | `'Actions'` |
| `copy-label`         | `string`             | Label for the copy to clipboard button                       | `'Copy'`    |

## CSS Custom Properties

| Property                            | Type     | Description                       |
| ----------------------------------- | -------- | --------------------------------- |
| `--clippy-token-sample-border-size` | `string` | Border size of the token samples. |
