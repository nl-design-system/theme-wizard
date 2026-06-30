# `<clippy-card-radio-group>`

Form-associated radiogroup wrapping `<clippy-card-radio-option>` children. Handles roving tabindex, arrow-key navigation, name propagation, and native form participation via `ElementInternals`.

Importing the group also registers `<clippy-card-radio-option>`.

## Usage

```js
import '@nl-design-system-community/clippy-components/clippy-card-radio-group';
```

```html
<clippy-card-radio-group name="plan">
  <clippy-card-radio-option value="starter">
    Starter
    <span slot="description">Up to 3 projects</span>
  </clippy-card-radio-option>

  <clippy-card-radio-option value="pro">
    Pro
    <span slot="description">Unlimited projects</span>
    <div slot="body">Everything in Starter, plus…</div>
  </clippy-card-radio-option>
</clippy-card-radio-group>
```

Reading the selected value:

```js
const group = document.querySelector('clippy-card-radio-group');
group.addEventListener('change', () => console.log(group.value));
```

Pre-selecting a card programmatically:

```js
group.value = 'pro';
```

## Attributes & properties

| Attribute / Property | Type   | Default |
| -------------------- | ------ | ------- |
| `name`               | string | `''`    |
| `value`              | string | `null`  |

## Events

| Event    | Description                           |
| -------- | ------------------------------------- |
| `change` | Fired when a child option is selected |

## Keyboard interaction

| Key                        | Action                       |
| -------------------------- | ---------------------------- |
| `Tab` / `Shift+Tab`        | Enter or leave the group     |
| `ArrowDown` / `ArrowRight` | Select next card (wraps)     |
| `ArrowUp` / `ArrowLeft`    | Select previous card (wraps) |
