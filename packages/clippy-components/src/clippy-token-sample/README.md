# `<clippy-token-sample>`

Renders a sample of a token. Used to illustrate token types and subtypes in the NL Design System.

## Usage

```js
import '@nl-design-system-community/clippy-components/clippy-token-sample';

const detail = document.querySelector('clippy-token-sample');

detail.token = {
  $type: 'color',
  $value: '#ff0000',
};
```

```html
<!-- standard -->
<clippy-token-sample></clippy-token-sample>
```

## Attributes & properties

| Attribute / Property | Type              | Description                      | Default     |
| -------------------- | ----------------- | -------------------------------- | ----------- |
| `token`              | `BaseDesignToken` | The token to display as a sample | `undefined` |
