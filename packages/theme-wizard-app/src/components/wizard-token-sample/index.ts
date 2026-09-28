import { consume } from '@lit/context';
import '@nl-design-system-community/clippy-components/clippy-token-sample';
import { type BaseDesignToken } from '@nl-design-system-community/design-tokens-schema';
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

@customElement(tag)
export class WizardTokenSample extends LitElement {
  @consume({ context: themeContext, subscribe: true })
  @state()
  private readonly theme!: Theme;

  @property({ type: String }) path = '';

  private get token(): BaseDesignToken | undefined {
    return this.theme?.at(this.path) as BaseDesignToken | undefined;
  }

  protected override render() {
    return html`<clippy-token-sample .token=${this.token}></clippy-token-sample>`;
  }
}
