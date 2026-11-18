# `@nl-design-system-community/clippy-components`

A collection of accessible web components used in the NL Design System Theme Wizard. Built with [Lit](https://lit.dev/).

## Installation

```sh
npm install @nl-design-system-community/clippy-components
```

Import the components you need:

```js
import '@nl-design-system-community/clippy-components/clippy-button';
import '@nl-design-system-community/clippy-components/clippy-modal';
```

## Quick example

```html
<clippy-modal title="Confirm" actions="both" id="confirm-dialog"> Are you sure? </clippy-modal>

<clippy-button purpose="primary" id="open-btn">Open</clippy-button>

<script>
  const modal = document.getElementById('confirm-dialog');
  document.getElementById('open-btn').addEventListener('click', () => modal.open());
  modal.addEventListener('close', () => console.log(modal.returnValue));
</script>
```

## Components

`clippy-components` with accompanying documentation and examples can be found on [Clippy's storybook](https://clippy-storybook-nl-design-system.vercel.app).
