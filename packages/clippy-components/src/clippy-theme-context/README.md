# `<clippy-theme-context>`

A plain data bridge: holds a JSON-serialized value (e.g. design tokens) as an
attribute, so consumers outside the light DOM tree — vanilla scripts, Astro
client scripts — can read or listen for it without speaking `@lit/context` or
the `context-request` protocol themselves. Renders nothing.

This component holds no context/provider knowledge of its own. A parent
(e.g. an app-level element that already consumes a real context) is expected
to keep `theme` in sync, typically by binding it to a reactive property.

## Usage

```js
import '@nl-design-system-community/clippy-components/clippy-theme-context';
```

```html
<clippy-theme-context theme='{"basis":{"color":{"...":"..."}}}'></clippy-theme-context>
```

Reading the current value:

```js
const bridge = document.querySelector('clippy-theme-context');
console.log(bridge.tokens); // parsed JSON, or undefined if unset/invalid
```

Listening for changes:

```js
bridge.addEventListener('theme-change', (event) => {
  console.log(event.detail.tokens);
});
```

## Attributes & properties

| Attribute / Property | Type   | Description                                |
| --------------------- | ------ | ------------------------------------------- |
| `theme`                | string | JSON-serialized value, e.g. design tokens   |
| `tokens` _(read-only)_ | unknown | Parsed `theme`, or `undefined` if unset/invalid |

## Events

| Event          | Detail          | Fired when                          |
| -------------- | ---------------- | ------------------------------------ |
| `theme-change` | `{ tokens }`      | `theme` attribute/property changes |
