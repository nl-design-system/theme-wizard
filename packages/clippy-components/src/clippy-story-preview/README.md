# `<clippy-story-preview>`

A Storybook-style preview container: white background, rounded corners, subtle box shadow. Good for embedding small component demos or live theme previews.

## Usage

```js
import '@nl-design-system-community/clippy-components/clippy-story-preview';
```

```html
<clippy-story-preview>
  <clippy-button purpose="primary">Click me</clippy-button>
</clippy-story-preview>

<!-- Larger canvas -->
<clippy-story-preview size="lg">
  <clippy-color-sample color="#e63946"></clippy-color-sample>
</clippy-story-preview>
```

## Attributes & properties

| Attribute / Property | Type   | Values | Default |
| -------------------- | ------ | ------ | ------- |
| `size`               | string | `lg`   | —       |

The `size` attribute is reflected back to the element. Setting it to anything other than `lg` produces no modifier class.

## Slots

| Slot        | Description     |
| ----------- | --------------- |
| _(default)_ | Preview content |
