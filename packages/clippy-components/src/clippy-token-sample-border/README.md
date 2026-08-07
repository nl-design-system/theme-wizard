# `<clippy-token-sample-border>`

Renders a sample of a border token. Used to illustrate border tokens and their concepts in the NL Design System.

## Usage

```js
import '@nl-design-system-community/clippy-components/clippy-token-sample-border';
```

```html
<!-- standard, defaults to 1px width, 0 radius -->
<clippy-token-sample-border></clippy-token-sample-border>

<!-- width -->
<clippy-token-sample-border border-width="2px"></clippy-token-sample-border>

<!-- radius -->
<clippy-token-sample-border border-radius="4px"></clippy-token-sample-border>

<!-- width & radius -->
<clippy-token-sample-border border-width="2px" border-radius="4px"></clippy-token-sample-border>
```

## Attributes & properties

| Attribute / Property | Type                                  | Description                 | Default |
| -------------------- | ------------------------------------- | --------------------------- | ------- |
| `border-radius`      | `string` (any valid CSS length value) | Border radius of the border | `0`     |
| `border-width`       | `string` (any valid CSS length value) | Width of the border         | `1px`   |

## CSS Custom Properties

| Property                              | Description                 | Default                |
| ------------------------------------- | --------------------------- | ---------------------- |
| `--clippy-token-sample-border-size`   | Size of the component       | `var(--basis-size-lg)` |
| `--clippy-token-sample-border-radius` | Border radius of the border | `0`                    |
| `--clippy-token-sample-border-width`  | Width of the border         | `1px`                  |
