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

| Component                                                        | Description                                                        |
| ---------------------------------------------------------------- | ------------------------------------------------------------------ |
| [`<clippy-button>`](src/clippy-button/README.md)                 | Styled button with purpose, hint, size, and toggle variants        |
| [`<clippy-code>`](src/clippy-code/README.md)                     | Inline code element                                                |
| [`<clippy-color-combobox>`](src/clippy-color-combobox/README.md) | Combobox for picking a color token, with color-proximity filtering |
| [`<clippy-color-sample>`](src/clippy-color-sample/README.md)     | Small square color swatch                                          |
| [`<clippy-combobox>`](src/clippy-combobox/README.md)             | Accessible combobox with keyboard navigation and filtering         |
| [`<clippy-font-combobox>`](src/clippy-font-combobox/README.md)   | Combobox for selecting a font family with live preview             |
| [`<clippy-heading>`](src/clippy-heading/README.md)               | Heading element with configurable level (h1–h6)                    |
| [`<clippy-html-image>`](src/clippy-html-image/README.md)         | Arbitrary HTML content exposed as an accessible image              |
| [`<clippy-icon>`](src/clippy-icon/README.md)                     | Decorative icon wrapper (auto aria-hidden)                         |
| [`<clippy-lang-combobox>`](src/clippy-lang-combobox/README.md)   | Combobox for selecting a language                                  |
| [`<clippy-modal>`](src/clippy-modal/README.md)                   | Modal dialog with focus management and configurable actions        |
| [`<clippy-react-element>`](src/clippy-react-element/README.md)   | Web component that mounts a React element                          |
| [`<clippy-reset-theme>`](src/clippy-reset-theme/README.md)       | Resets CSS custom properties to basis token values                 |
| [`<clippy-story-preview>`](src/clippy-story-preview/README.md)   | Storybook-style preview container                                  |
| [`<clippy-toggletip>`](src/clippy-toggletip/README.md)           | Tooltip that shows on hover or focus                               |
