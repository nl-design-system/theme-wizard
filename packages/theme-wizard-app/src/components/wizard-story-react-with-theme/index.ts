import { consume } from '@lit/context';
import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import type Theme from '../../lib/Theme';
import type { WizardStoryRenderer } from '../wizard-story-react';
import { themeContext } from '../../contexts/theme';
import '../wizard-story-react';

const tag = 'wizard-story-react-with-theme';

declare global {
  interface HTMLElementTagNameMap {
    [tag]: WizardStoryReactWithTheme;
  }
}

/**
 * The sole purpose of this element is to know about the Theme context and to pass that knowledge
 * into the <wizard-story-react> element, because that element should remain agnostic of environment.
 */
@customElement(tag)
export class WizardStoryReactWithTheme extends LitElement {
  @consume({ context: themeContext })
  private readonly theme!: Theme;

  private storyRenderer: WizardStoryRenderer | null = null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  story: any = undefined;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  componentMeta: any = undefined;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  args: any = undefined;

  override connectedCallback() {
    super.connectedCallback();
    // Create wizard-story-react once and set properties
    this.storyRenderer = document.createElement('wizard-story-react') as WizardStoryRenderer;
    this.storyRenderer.story = this.story;
    this.storyRenderer.componentMeta = this.componentMeta;
    this.storyRenderer.args = this.args;
    this.storyRenderer.additionalStylesheets = [this.theme.stylesheet];
    this.appendChild(this.storyRenderer);
  }

  protected override render() {
    return html`<slot></slot>`;
  }
}
