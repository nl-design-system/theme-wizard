import type { ReactElement } from 'react';
import { createRoot, type Root } from 'react-dom/client';

export class ReactRenderer extends HTMLElement {
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

customElements.define('react-renderer', ReactRenderer);
