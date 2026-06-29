# `<clippy-card-radio-option>`

Single selectable card for use inside `<clippy-card-radio-group>`. The hidden `<input type="radio">` participates in form submission; the card is the visual surface. `delegatesFocus: true` forwards host focus to the hidden input.

`inputTabIndex` and `checked` are managed by the parent `<clippy-card-radio-group>` — do not set them manually.

## Usage

```js
import '@nl-design-system-community/clippy-components/clippy-card-radio-option';
```

Usually used inside `<clippy-card-radio-group>`:

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

With a leading icon:

```html
<clippy-card-radio-option value="light">
  <img slot="start" src="sun.svg" alt="" />
  Light mode
</clippy-card-radio-option>
```

## Attributes & properties

| Attribute / Property | Type    | Default | Notes                          |
| -------------------- | ------- | ------- | ------------------------------ |
| `value`              | string  | `''`    | Submitted with the form        |
| `name`               | string  | `''`    | Set automatically by the group |
| `checked`            | boolean | `false` | Reflected; set by the group    |

## Slots

| Slot          | Description                                                     |
| ------------- | --------------------------------------------------------------- |
| _(default)_   | Card label (also the `<label>` text for the hidden radio input) |
| `start`       | Leading slot — icon, image, or avatar                           |
| `description` | Hint text below the label; linked via `aria-describedby`        |
| `body`        | Card body content rendered below the header                     |
| `footer`      | Card footer content rendered below the body                     |

## Events

| Event    | Description                                                    |
| -------- | -------------------------------------------------------------- |
| `change` | Fired when the option becomes checked; bubbles and is composed |
