import { createElement } from 'react';
import '../wizard-react-element';
import type { WizardReactRenderer } from '../wizard-react-element';

export class WizardStoryRenderer extends HTMLElement {
  private reactRenderer: WizardReactRenderer | null = null;

  connectedCallback() {
    this.attachShadow({ mode: 'open' });
    this.reactRenderer = document.createElement('react-renderer') as WizardReactRenderer;
    this.shadowRoot?.appendChild(this.reactRenderer);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  renderStory(story: any, componentMeta: any, args: any = {}) {
    const Component = componentMeta.component;
    const css = componentMeta.parameters?.css;
    const tokens = componentMeta.parameters?.tokens;

    if (this.shadowRoot) {
      if (css) {
        const styleSheet = new CSSStyleSheet();
        styleSheet.replaceSync(css);
        this.shadowRoot.adoptedStyleSheets.push(styleSheet);
      }

      if (tokens) {
        // get all tokens
        // convert to css custom property
        // set value to `initial`
      }
    }

    if (this.reactRenderer) {
      // If the story has a custom render function, use it
      if (story.render) {
        this.reactRenderer.render(story.render(args, { component: Component }));
      } else {
        // Otherwise render the component with the args
        this.reactRenderer.render(createElement(Component, args));
      }
    }
  }
}

customElements.define('wizard-story-renderer', WizardStoryRenderer);
