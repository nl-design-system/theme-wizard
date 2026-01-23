import { consume } from '@lit/context';
import codeCSS from '@nl-design-system-candidate/code-css/code.css?inline';
import linkCSS from '@nl-design-system-candidate/link-css/link.css?inline';
import markCSS from '@nl-design-system-candidate/mark-css/mark.css?inline';
import { LitElement, unsafeCSS } from 'lit';
import { state, property } from 'lit/decorators.js';
import { createElement, type ComponentType, type ReactNode } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import type Theme from '../../lib/Theme';
import { themeContext } from '../../contexts/theme';

const tag = 'wizard-react-element';

export interface JsxChangeEvent {
  detail: {
    jsx: ReactNode;
  };
}

declare global {
  interface HTMLElementTagNameMap {
    [tag]: WizardReactElement;
  }
}

/**
 * Render a React component as a web component with props.
 */
export class WizardReactElement extends LitElement {
  @property() Component: ComponentType<unknown> | null = null;
  @property({ type: Object }) props: object = {};
  @property({ type: Function }) jsxChange: ((evt: Event) => void) | null = null;

  @consume({ context: themeContext, subscribe: true })
  @state()
  private readonly theme!: Theme;

  protected _renderRoot: Root | null = null;

  // TODO: this is a hard to scale solution for the scoped styles
  static override readonly styles = [unsafeCSS(markCSS), unsafeCSS(linkCSS), unsafeCSS(codeCSS)];

  override connectedCallback() {
    super.connectedCallback();
    if (this.shadowRoot && !this._renderRoot) {
      const container = document.createElement('div');
      container.classList.add('theme-preview');
      this.shadowRoot.appendChild(container);
      this._renderRoot = createRoot(container);
    }

    this.shadowRoot?.adoptedStyleSheets.push(this.theme.stylesheet);
  }

  override render() {
    if (!this.Component || !this._renderRoot) {
      return;
    }

    let componentRendering: ReactNode;

    try {
      componentRendering = createElement(this.Component as never, this.props);
    } catch (error) {
      componentRendering = 'Error: could not render component';
      console.error(error);
    }

    const evt = new CustomEvent('change', {
      detail: {
        jsx: componentRendering,
      },
    } satisfies JsxChangeEvent);

    if (typeof this.jsxChange === 'function') {
      this.jsxChange(evt);
    }

    this.dispatchEvent(evt);
    this._renderRoot.render(componentRendering);
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this._renderRoot?.unmount();
    this._renderRoot = null;
  }
}

customElements.define(tag, WizardReactElement);
