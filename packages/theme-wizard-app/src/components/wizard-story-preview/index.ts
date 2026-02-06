import { consume } from '@lit/context';
import { LitElement, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import type Theme from '../../lib/Theme';
import { themeContext } from '../../contexts/theme';
import styles from './styles';

const tag = 'wizard-story-preview';

// Declare the custom element for TypeScript
declare global {
  interface HTMLElementTagNameMap {
    [tag]: WizardStoryPreview;
  }
}

@customElement(tag)
export class WizardStoryPreview extends LitElement {
  @consume({ context: themeContext, subscribe: true })
  @state()
  private readonly theme!: Theme;

  static override readonly styles = [styles];

  override connectedCallback(): void {
    super.connectedCallback();
    this.shadowRoot?.adoptedStyleSheets.push(this.theme.stylesheet);
  }

  override render() {
    return html`
      <div class="wizard-story-preview preview-theme">
        <slot></slot>
      </div>
    `;
  }
}
