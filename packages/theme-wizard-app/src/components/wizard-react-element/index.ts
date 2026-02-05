import type { ReactElement } from 'react';
import { createRoot, type Root } from 'react-dom/client';

export class WizardReactRenderer extends HTMLElement {
  private root: Root | null = null;

  connectedCallback() {
    const mountPoint = document.createElement('div');
    this.appendChild(mountPoint);
    this.root = createRoot(mountPoint);
  }

  disconnectedCallback() {
    this.root?.unmount();
  }

  render(element: ReactElement, styleSheets?: CSSStyleSheet[]) {
    this.root?.render(element);
    if (styleSheets) {
      this.shadowRoot?.adoptedStyleSheets.push(...styleSheets);
    }
  }
}

customElements.define('wizard-react-element', WizardReactRenderer);
