# `<clippy-lang-combobox>`

Extends [`<clippy-combobox>`](../clippy-combobox/README.md) for selecting a language. Options are language codes like `nl`, `en`, or `de`. Displays language names as autonyms (the name in that language), exonyms (the name in the UI language), or both. Filtering always checks both forms regardless of the display format.

## Usage

```js
import '@nl-design-system-community/clippy-components/clippy-lang-combobox';
```

```html
<clippy-lang-combobox name="lang" options="nl en de fr" format="autonym-exonym" lang="en"></clippy-lang-combobox>

<script>
  const el = document.querySelector('clippy-lang-combobox');
  el.addEventListener('change', () => console.log(el.value)); // 'nl'
</script>
```

Options can also be set as a property:

```js
el.options = ['nl', 'en', 'de', 'fr'];
```

`lang` is inferred from the closest ancestor `lang` attribute when not explicitly set.

## Attributes & properties

Inherits all attributes from `<clippy-combobox>`. The following are specific to this component:

| Attribute / Property | Type   | Values                                                           | Default   |
| -------------------- | ------ | ---------------------------------------------------------------- | --------- |
| `options`            | string | Space-separated language codes (`nl en de`), or array of strings | `[]`      |
| `format`             | string | `autonym` \| `exonym` \| `autonym-exonym` \| `exonym-autonym`    | `autonym` |
| `lang`               | string | Language code — controls which language exonyms are rendered in  | inherited |

## Format values

| Value            | List shows           | Input shows      |
| ---------------- | -------------------- | ---------------- |
| `autonym`        | Native name          | Native name      |
| `exonym`         | UI-language name     | UI-language name |
| `autonym-exonym` | Native + UI-language | Native name      |
| `exonym-autonym` | UI-language + Native | UI-language name |

## Filtering

Filtering always searches both the autonym and the exonym regardless of the `format` setting. Searching "Dutch" in `format="autonym"` mode still finds "nl" (Nederlands).

## Events

| Event    | Description                           |
| -------- | ------------------------------------- |
| `change` | Fired when the selected value changes |
| `input`  | Fired on every keystroke              |
| `focus`  | Fired when the combobox gains focus   |
| `blur`   | Fired when the combobox loses focus   |
