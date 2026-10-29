# `<clippy-content-select>`

A form control that lets users select content from a list of options. Renders a dropdown select with previous/next navigation buttons and a preview area for the application to render its content. Participates in form submission.

## Usage

```js
import '@nl-design-system-community/clippy-components/clippy-content-select';
```

```html
<clippy-content-select name="theme">
  <span slot="label">Theme</span>
  <img src="preview-light.png" alt="" />
</clippy-content-select>

<script>
  const el = document.querySelector('clippy-content-select');

  el.options = [
    { label: 'Light', value: 'light' },
    { label: 'Dark', value: 'dark' },
  ];

  el.addEventListener('change', () => console.log(el.value));
</script>
```

Options can also be passed as an attribute: a space-separated token list, or a JSON array of strings or objects.

```html
<!-- Space-separated strings -->
<clippy-content-select name="size" options="small medium large"></clippy-content-select>

<!-- JSON array -->
<clippy-content-select name="size" options='["small","medium","large"]'></clippy-content-select>
```

When the selection changes, you can listen to the `change` event and update the content preview.

## Attributes & properties

| Attribute / Property | Type    | Description                                                | Default      |
| -------------------- | ------- | ---------------------------------------------------------- | ------------ |
| `name`               | string  | Name for form submission                                   | `''`         |
| `value`              | string  | Currently selected value                                   | `null`       |
| `options`            | array   | Array of options (strings or `{label, value}`)             | `[]`         |
| `disabled`           | boolean | Disables the select                                        | `false`      |
| `hiddenLabel`        | string  | Hidden label for accessibility (attribute: `hidden-label`) | `''`         |
| `labelPrevious`      | string  | Label for the previous button                              | `'Vorige'`   |
| `labelNext`          | string  | Label for the next button                                  | `'Volgende'` |

## Slots

| Slot        | Description                                                                      |
| ----------- | -------------------------------------------------------------------------------- |
| `label`     | Label for the select (if not provided there will be rendered an invisible label) |
| _(default)_ | Preview content                                                                  |

## Events

| Event    | Description                           |
| -------- | ------------------------------------- |
| `change` | Fired when the selected value changes |
| `input`  | Fired when the selected value changes |
| `focus`  | Fired when the select gains focus     |
| `blur`   | Fired when the select loses focus     |

## CSS Custom Properties

| Property                                          | Description                                           |
| ------------------------------------------------- | ----------------------------------------------------- |
| `--clippy-content-select-preview-space-block`     | Block space for the preview                           |
| `--clippy-content-select-preview-space-inline`    | Inline space for the preview                          |
| `--clippy-content-select-lg-preview-space-block`  | Block space for the preview when there is more space  |
| `--clippy-content-select-lg-preview-space-inline` | Inline space for the preview when there is more space |
