# `<clippy-react-element>`

A plain web component that mounts a React element into a managed `createRoot`. Useful for embedding React components in non-React host applications and for demo purposes. Each instance has its own independent React root; removing the element from the DOM unmounts the root automatically.

## Usage

```js
import '@nl-design-system-community/clippy-components/clippy-react-element';
import { createElement } from 'react';
import '@nl-design-system-community/clippy-components/clippy-react-element';

const el = document.createElement('clippy-react-element');
document.body.appendChild(el);

// Render a React element into it
el.render(createElement(MyComponent, { title: 'Hello' }));

// Re-render with updated props
el.render(createElement(MyComponent, { title: 'Updated' }));
```

Calling `render()` before the element is connected to the DOM is safe — the call is silently ignored.

## Methods

| Method                          | Description                                                      |
| ------------------------------- | ---------------------------------------------------------------- |
| `render(element: ReactElement)` | Renders or re-renders a React element into this component's root |
