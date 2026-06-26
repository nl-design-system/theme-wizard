# `<clippy-card-as-form-field>` + `<clippy-card-radio>`

Radiogroup where each option is a card. `<clippy-card-as-form-field>` is the form-associated group; `<clippy-card-radio>` is each selectable card. The hidden `<input type="radio">` participates in form submission; the card is the visual surface.

Roving tabindex keeps Tab entry/exit to one keypress. Arrow keys move selection within the group, wrapping at both ends.

## Usage

```js
import '@nl-design-system-community/clippy-components/clippy-card-as-form-field';
```

```html
<clippy-card-as-form-field name="plan">
  <clippy-card-radio value="starter">
    Starter
    <span slot="description">Up to 3 projects</span>
  </clippy-card-radio>

  <clippy-card-radio value="pro">
    Pro
    <span slot="description">Unlimited projects</span>
    <div slot="body">Everything in Starter, plus…</div>
  </clippy-card-radio>
</clippy-card-as-form-field>
```

With a leading icon in each card:

```html
<clippy-card-radio value="light">
  <img slot="start" src="sun.svg" alt="" />
  Light mode
</clippy-card-radio>
```

Reading the selected value:

```js
const group = document.querySelector('clippy-card-as-form-field');
group.addEventListener('change', () => console.log(group.value));
```

## `<clippy-card-as-form-field>` attributes & properties

| Attribute / Property | Type    | Default |
| -------------------- | ------- | ------- |
| `name`               | string  | `''`    |
| `value`              | string  | `null`  |
| `disabled`           | boolean | `false` |
| `readonly`           | boolean | `false` |
| `hidden-label`       | string  | `''`    |

`value` can also be set programmatically to pre-select a card by its `value` attribute.

## `<clippy-card-radio>` attributes & properties

| Attribute / Property | Type    | Default | Notes                          |
| -------------------- | ------- | ------- | ------------------------------ |
| `value`              | string  | `''`    | Submitted with the form        |
| `name`               | string  | `''`    | Set automatically by the group |
| `checked`            | boolean | `false` | Reflected; set by the group    |

## Slots

### `<clippy-card-radio>` slots

| Slot          | Description                                                     |
| ------------- | --------------------------------------------------------------- |
| _(default)_   | Card label (also the `<label>` text for the hidden radio input) |
| `start`       | Leading slot — icon, image, or avatar                           |
| `description` | Hint text below the label; linked via `aria-describedby`        |
| `body`        | Card body content rendered below the header                     |
| `footer`      | Card footer content rendered below the body                     |

## Events

| Event    | Element                       | Description                       |
| -------- | ----------------------------- | --------------------------------- |
| `change` | `<clippy-card-as-form-field>` | Bubbles up from the selected card |

## Keyboard interaction

| Key                        | Action                       |
| -------------------------- | ---------------------------- |
| `Tab` / `Shift+Tab`        | Enter or leave the group     |
| `ArrowDown` / `ArrowRight` | Select next card (wraps)     |
| `ArrowUp` / `ArrowLeft`    | Select previous card (wraps) |
