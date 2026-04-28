# `<clippy-font-combobox>`

Extends [`<clippy-combobox>`](../clippy-combobox/README.md) for selecting a font family. Options are rendered in their own font. Google Fonts stylesheets are lazily injected into `<head>` as options scroll into view. Typing a name not in the list uses that string as the value (`allow="other"` by default).

## Usage

```js
import '@nl-design-system-community/clippy-components/clippy-font-combobox';
```

```html
<clippy-font-combobox name="font-family"></clippy-font-combobox>

<script>
  const el = document.querySelector('clippy-font-combobox');

  el.options = [
    { label: 'Inter', value: ['Inter', 'sans-serif'] },
    { label: 'Georgia', value: ['Georgia', 'serif'] },
    {
      label: 'Noto Sans',
      value: ['Noto Sans', 'sans-serif'],
      cssUrl: 'https://fonts.googleapis.com/css2?family=Noto+Sans',
    },
  ];

  el.addEventListener('change', () => {
    // value is a font stack array, e.g. ['Inter', 'sans-serif']
    console.log(el.value);
  });
</script>
```

## Attributes & properties

Inherits all attributes from `<clippy-combobox>`. The following differ from the base:

| Attribute / Property | Type         | Values               | Default |
| -------------------- | ------------ | -------------------- | ------- |
| `allow`              | string       | `options` \| `other` | `other` |
| `value`              | string array | Font stack           | `null`  |

## Options format

Each option must have `label` (string) and `value` (string array, the CSS font stack). `description` and `cssUrl` are optional.

```js
{
  label: 'Noto Sans',           // displayed in the list
  value: ['Noto Sans', 'sans-serif'], // CSS font-family stack
  description: 'Humanist sans', // optional: shown below label in list
  cssUrl: 'https://…',          // optional: stylesheet injected when option is visible
}
```

Typing a font name that is not in the list commits `[query]` as the value.

## Form integration

The value is serialized as a comma-separated string in `FormData`:

```js
const formData = new FormData(form);
formData.get('font-family'); // 'Inter,sans-serif'
```
