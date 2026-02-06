import '../wizard-react-element';
import { LitElement, html } from 'lit';
import { createElement } from 'react';
import type { WizardReactRenderer } from '../wizard-react-element';

// Token utilities are adapted from:
// https://github.com/nl-design-system/documentatie/blob/main/src/utils.ts
export type Token = { $value?: string; $type?: string; $extensions?: { [key: string]: unknown } }; //| { $type: unknown };
export type TokenGroup = { $extensions?: { [key: string]: unknown } };
export type TokenNode = { [key: string]: TokenNode | Token } & TokenGroup; //| { $type: unknown };
export type TokenPath = string[];

function getTokenPaths(obj: TokenNode, partialTokenPath: TokenPath = []): TokenPath[] {
  if (Object.hasOwn(obj, '$type') || Object.hasOwn(obj, '$value')) return [partialTokenPath];

  return Object.keys(obj).flatMap((key) =>
    typeof obj[key] === 'object' && obj[key] !== null ? getTokenPaths(obj[key], [...partialTokenPath, key]) : [],
  );
}
const tokenPathToCSSCustomProperty = (tokenPath: TokenPath): string => '--' + tokenPath.join('-');

export class WizardStoryRenderer extends LitElement {
  private reactRenderer: WizardReactRenderer | null = null;

  protected override render() {
    return html``;
  }

  override connectedCallback() {
    super.connectedCallback();
    this.reactRenderer = document.createElement('wizard-react-element') as WizardReactRenderer;
    this.shadowRoot?.appendChild(this.reactRenderer);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  renderStory(story: any, componentMeta: any, args: any = {}) {
    const Component = componentMeta.component;
    const css = componentMeta.parameters?.css;
    const tokens = componentMeta.parameters?.tokens;
    const styleSheets = Array.isArray(css)
      ? css.map((styles) => {
          const sheet = new CSSStyleSheet();
          sheet.replaceSync(styles);
          return sheet;
        })
      : [];

    if (this.shadowRoot && tokens) {
      const resetCss = `@layer {
          :host {
            ${getTokenPaths(tokens)
              .map((x) => `${tokenPathToCSSCustomProperty(x)}: initial;`)
              .join('\n')}
          }
        }`;
      const styleSheet = new CSSStyleSheet();
      styleSheet.replaceSync(resetCss);
      this.shadowRoot.adoptedStyleSheets.push(styleSheet, ...styleSheets);
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

customElements.define('wizard-story-react', WizardStoryRenderer);
