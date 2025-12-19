import { consume } from '@lit/context';
import { LitElement, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import type Theme from '../../lib/Theme';
import { themeContext } from '../../contexts/theme';
import '../wizard-layout';

const tag = 'wizard-style-guide';

declare global {
  interface HTMLElementTagNameMap {
    [tag]: WizardStyleGuide;
  }
}

@customElement(tag)
export class WizardStyleGuide extends LitElement {
  @consume({ context: themeContext, subscribe: true })
  @state()
  private theme!: Theme;

  override render() {
    if (!this.theme) {
      return html`<div>Loading...</div>`;
    }

    return html`
      <wizard-layout>
        <div slot="sidebar">
          <utrecht-heading-1>Style Guide</utrecht-heading-1>
          <a href="/" class="utrecht-link-button">← Back to Wizard</a>
        </div>

        <div slot="main">
          <utrecht-paragraph> Style guide page placeholder. Features will be added later. </utrecht-paragraph>
          <utrecht-paragraph>
            Theme has ${Object.keys(this.theme.tokens).length} top-level token groups.
          </utrecht-paragraph>
        </div>
      </wizard-layout>
    `;
  }
}
