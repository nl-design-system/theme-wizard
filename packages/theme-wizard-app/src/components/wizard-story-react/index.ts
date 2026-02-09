import '../wizard-react-element';
import { LitElement, html } from 'lit';
import { createElement } from 'react';
import type { WizardReactRenderer } from '../wizard-react-element';

export class WizardStoryRenderer extends LitElement {
  private reactRenderer: WizardReactRenderer | null = null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  story: any = undefined;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  componentMeta: any = undefined;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  args: any = undefined;
  additionalStylesheets: CSSStyleSheet[] = [];

  override connectedCallback() {
    super.connectedCallback();
    this.reactRenderer = document.createElement('wizard-react-element') as WizardReactRenderer;
    this.shadowRoot?.appendChild(this.reactRenderer);
  }

  protected override render() {
    const Component = this.componentMeta.component;
    const css = this.componentMeta.parameters?.css;

    const styleSheets: CSSStyleSheet[] = [];

    // Additional stylesheets (theme CSS, resets, etc.)
    styleSheets.push(...this.additionalStylesheets);

    // Component CSS
    if (Array.isArray(css)) {
      const componentSheets = css.map((styles) => {
        const sheet = new CSSStyleSheet();
        sheet.replaceSync(styles);
        return sheet;
      });
      styleSheets.push(...componentSheets);
    }

    // Apply all stylesheets (clear first to prevent duplicates)
    if (this.shadowRoot) {
      this.shadowRoot.adoptedStyleSheets = styleSheets;
    }

    if (this.reactRenderer) {
      // If the story has a custom render function, use it
      if (this.story.render) {
        this.reactRenderer.render(this.story.render(this.args, { component: Component }));
      } else {
        // Otherwise render the component with the args
        this.reactRenderer.render(createElement(Component, this.args));
      }
    }

    return html`<slot></slot>`;
  }
}

customElements.define('wizard-story-react', WizardStoryRenderer);
