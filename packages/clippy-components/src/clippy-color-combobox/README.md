# `<clippy-color-combobox>`

Extends [`<clippy-combobox>`](../clippy-combobox/README.md) for picking a color token. Filters options by label text and by visual color proximity using ΔE 2000. Supports localized color name searching (e.g. searching "oranje" in Dutch finds orange colors).

## Usage

```js
import '@nl-design-system-community/clippy-components/clippy-color-combobox';
```

```html
<clippy-color-combobox name="background-color" lang="nl"></clippy-color-combobox>

<script>
  const el = document.querySelector('clippy-color-combobox');

  // Options accept hex strings or design token $value objects
  el.options = [
    { label: 'Ocean blue', value: '#006fc0' },
    { label: 'Forest green', value: '#1a7a4a' },
    {
      label: 'Brand red',
      value: { alpha: 1, colorSpace: 'srgb', components: [0.8, 0.1, 0.1] },
    },
  ];

  el.addEventListener('change', () => console.log(el.value));
</script>
```

## Attributes

Inherits all attributes from `<clippy-combobox>`. The following differ from the base:

| Attribute | Type   | Values                           | Default         |
| --------- | ------ | -------------------------------- | --------------- |
| `allow`   | string | `options` \| `other`             | `other`         |
| `lang`    | string | Language code, e.g. `nl` or `en` | browser default |

Setting `lang` loads localized color name translations (currently `en` and `nl`). Users can then search for colors using translated names such as "groen" (green) or "rood" (red).

## Options format

Each option must have `label` (string) and `value` (hex string or design token `$value` object):

```js
// Hex string
{ label: 'Blue', value: '#0000ff' }

// Design token $value object
{ label: 'Blue', value: { alpha: 1, colorSpace: 'srgb', components: [0, 0, 1] } }
```

## Events

| Event    | Description                           |
| -------- | ------------------------------------- |
| `change` | Fired when the selected value changes |
| `input`  | Fired on every keystroke              |
| `focus`  | Fired when the combobox gains focus   |
| `blur`   | Fired when the combobox loses focus   |
