import type { ReactElement } from 'react';
import { createRoot, type Root } from 'react-dom/client';

const tag = 'clippy-react-element';

// Plain web component intentionally — wrapping this in Lit adds complexity without benefit.
export class ClippyReactElement extends HTMLElement {
  private root: Root | null = null;

  connectedCallback() {
    const mountPoint = document.createElement('div');
    this.appendChild(mountPoint);
    this.root = createRoot(mountPoint);
  }

  disconnectedCallback() {
    this.root?.unmount();
  }

  render(element: ReactElement) {
    this.root?.render(element);
  }
}

const registry = globalThis.customElements;
if (registry && !registry.get(tag)) {
  registry.define(tag, ClippyReactElement);
}

declare global {
  interface HTMLElementTagNameMap {
    [tag]: ClippyReactElement;
  }
}
