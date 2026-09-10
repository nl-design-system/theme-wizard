import { consume } from '@lit/context';
import { resolveRef, stringifyToken, type TokenReference } from '@nl-design-system-community/design-tokens-schema';
import { html, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type Theme from '../../lib/Theme';
import { themeContext } from '../../contexts/theme';

const tag = 'wizard-token-value';

declare global {
  interface HTMLElementTagNameMap {
    [tag]: WizardTokenValue;
  }
}

@customElement(tag)
export class WizardTokenValue extends LitElement {
  @consume({ context: themeContext, subscribe: true })
  @state()
  private readonly theme!: Theme;

  @property({ type: String }) path = '';

  private get resolved(): string {
    const token = resolveRef(this.theme.tokens, `{${this.path}}` as TokenReference);
    return token ? stringifyToken(token) : '';
  }

  protected override render() {
    return html`<slot>${this.resolved}</slot>`;
  }
}
