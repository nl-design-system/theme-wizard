# `<clippy-html-image>`

Wraps arbitrary HTML content and presents it to the accessibility tree as a single image (`role="img"`). An optional `label` slot provides the accessible name. Without a label the image is unlabelled (appropriate for decorative content).

Multiple instances on the same page each get an independent label association.

## Usage

```js
import '@nl-design-system-community/clippy-components/clippy-html-image';
```

```html
<!-- With an accessible label -->
<clippy-html-image>
  <div style="width:200px;height:100px;background:linear-gradient(to right,#f00,#00f)"></div>
  <span slot="label">Red to blue gradient</span>
</clippy-html-image>

<!-- Decorative (no label) -->
<clippy-html-image>
  <div class="decorative-pattern"></div>
</clippy-html-image>
```

## Slots

| Slot        | Description                                                            |
| ----------- | ---------------------------------------------------------------------- |
| _(default)_ | Visual content — rendered `inert` so it is skipped by AT               |
| `label`     | Accessible name for the image; hidden visually, read by screen readers |
