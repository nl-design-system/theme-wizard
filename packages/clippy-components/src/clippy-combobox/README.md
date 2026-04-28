# `<clippy-combobox>`

Accessible combobox with keyboard navigation, option filtering, and optional free-text input. Participates in form submission. This is the base component for [`<clippy-color-combobox>`](../clippy-color-combobox/README.md), [`<clippy-font-combobox>`](../clippy-font-combobox/README.md), and [`<clippy-lang-combobox>`](../clippy-lang-combobox/README.md).

## Usage

```js
import '@nl-design-system-community/clippy-components/clippy-combobox';
```

```html
<clippy-combobox name="framework">
  <span slot="label">Framework</span>
  <span slot="description">Pick the framework you use</span>
</clippy-combobox>

<script>
  const el = document.querySelector('clippy-combobox');

  // Options can be an array of strings…
  el.options = ['React', 'Vue', 'Svelte'];

  // …or an array of objects with label, value, and optional description
  el.options = [
    { label: 'React', value: 'react' },
    { label: 'Vue', value: 'vue' },
    { label: 'Svelte', value: 'svelte', description: 'No virtual DOM' },
  ];

  el.addEventListener('change', () => console.log(el.value));
</script>
```

Options can also be passed as an attribute: a space-separated token list, a JSON array of strings, or a JSON array of objects.

```html
<!-- Space-separated strings -->
<clippy-combobox name="color" options="red green blue"></clippy-combobox>

<!-- JSON array -->
<clippy-combobox name="color" options='["red","green","blue"]'></clippy-combobox>
```

## Attributes & properties

| Attribute / Property | Type    | Values                       | Default     |
| -------------------- | ------- | ---------------------------- | ----------- |
| `name`               | string  | —                            | —           |
| `value`              | string  | —                            | `null`      |
| `options`            | array   | See above                    | `[]`        |
| `allow`              | string  | `options` \| `other`         | `options`   |
| `position`           | string  | `block-end` \| `block-start` | `block-end` |
| `open`               | boolean | — (reflected)                | `false`     |
| `invalid`            | boolean | — (reflected)                | `false`     |
| `disabled`           | boolean | —                            | `false`     |

Setting `allow="other"` lets users type a value that is not in the options list.

## Slots

| Slot          | Description                                                     |
| ------------- | --------------------------------------------------------------- |
| _(default)_   | Label — rendered visually only when slotted content is provided |
| `label`       | Explicit label slot (same as default for backward compat)       |
| `description` | Hint text displayed below the label                             |
| `error`       | Validation error message linked via `aria-errormessage`         |

## Events

| Event    | Description                           |
| -------- | ------------------------------------- |
| `change` | Fired when the selected value changes |
| `input`  | Fired on every keystroke              |
| `focus`  | Fired when the combobox gains focus   |
| `blur`   | Fired when the combobox loses focus   |

## Keyboard interaction

| Key         | Action                                                            |
| ----------- | ----------------------------------------------------------------- |
| `ArrowDown` | Move to next option                                               |
| `ArrowUp`   | Move to previous option                                           |
| `Enter`     | Confirm active option (or commit typed text when `allow="other"`) |
| `Escape`    | Clear active option                                               |
| `Home`      | Move to first option                                              |
| `End`       | Move to last option                                               |
