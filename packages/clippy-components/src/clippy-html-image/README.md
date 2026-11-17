# `<clippy-html-image>`

Wraps arbitrary HTML content and presents it to the accessibility tree as a figure. Provide an accessible label via the `label` slot for non-decorative content. Without a label the figure is unlabelled (appropriate for decorative content).

## Usage

```js
import '@nl-design-system-community/clippy-components/clippy-html-image';
```

```html
<!-- With an accessible label (slot, allows rich content) -->
<clippy-html-image>
  <span slot="label">Red to <strong>blue</strong> gradient</span>
  <div style="width:200px;height:100px;background:linear-gradient(to right,#f00,#00f)"></div>
</clippy-html-image>

<!-- Decorative (no label) -->
<clippy-html-image>
  <div class="decorative-pattern"></div>
</clippy-html-image>

<!-- Color-scheme -->
<clippy-html-image color-scheme="dark">
  <div class="decorative-pattern"></div>
</clippy-html-image>

<clippy-html-image color-scheme="light">
  <div class="decorative-pattern"></div>
</clippy-html-image>

<!-- Forced color adjustment -->
<clippy-html-image forced-color-adjust>
  <div style="color: canvastext; background: canvas;">Content</div>
</clippy-html-image>
```

## Properties

| Property              | Type      | Default | Description                                                                                                  |
| --------------------- | --------- | ------- | ------------------------------------------------------------------------------------------------------------ |
| `color-scheme`        | `string`  | -       | Sets the color scheme for the image body. Accepts `'dark'` or `'light'`.                                     |
| `forced-color-adjust` | `boolean` | `false` | When `true`, forces color adjustment to be `auto` on the image body, overriding the default `none` behavior. |

## Slots

| Slot        | Description                                                                                                                  |
| ----------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `label`     | Accessible label content (rich HTML allowed). When provided, the element gets `role="img"` and is associated with the label. |
| _(default)_ | Visual content — rendered with `inert` so it is skipped by assistive technology.                                             |
