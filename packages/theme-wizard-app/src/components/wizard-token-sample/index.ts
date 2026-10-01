import { consume } from '@lit/context';
import '@nl-design-system-community/clippy-components/clippy-token-sample';
import { html, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type Theme from '../../lib/Theme';
import { themeContext } from '../../contexts/theme';

const tag = 'wizard-token-sample';

declare global {
  interface HTMLElementTagNameMap {
    [tag]: WizardTokenSample;
  }
}

/**
 * @description Wrapper element around `<clippy-token-sample>` that injects the token from the Theme context
 */
@customElement(tag)
export class WizardTokenSample extends LitElement {
  @consume({ context: themeContext, subscribe: true })
  @state()
  private readonly theme!: Theme;

  @property({ type: String }) path = '';

  private get token() {
    // Pass the result through as-is, because clippy-token-sample validates whether this is a proper token
    const value = this.theme?.at(this.path);
    return value;
  }

  protected override render() {
    return html`
      <clippy-token-sample .token=${this.token}>
        <slot></slot>
      </clippy-token-sample>
    `;
  }
}
