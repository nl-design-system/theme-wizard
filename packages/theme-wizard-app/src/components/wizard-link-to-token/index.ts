import { consume } from '@lit/context';
import { safeCustomElement } from '@nl-design-system-community/clippy-components/lib/decorators';
import { getTokenGroupType, isTokenGroup, isTokenLike } from '@nl-design-system-community/design-tokens-schema';
import { LitElement, html, nothing } from 'lit';
import { property, state } from 'lit/decorators.js';
import type Theme from '../../lib/Theme';
import '../wizard-card-as-link';
import '../wizard-token-sample';
import { themeContext } from '../../contexts/theme';
import styles from './styles';

const tag = 'wizard-link-to-token';

declare global {
  interface HTMLElementTagNameMap {
    [tag]: WizardLinkToToken;
  }
}

/**
 * @slot link - The card's link — a direct-child `<a href>`, kept in the light DOM so the consuming router (e.g. Astro) stays in control of navigation
 * @element wizard-link-to-token
 */
@safeCustomElement(tag)
export class WizardLinkToToken extends LitElement {
  static override readonly styles = [styles];

  @consume({ context: themeContext, subscribe: true })
  @state()
  private readonly theme!: Theme;

  @property() path = '';

  get token() {
    return this.theme.at(this.path);
  }

  private get shouldRenderSample(): boolean {
    const token = this.token;

    if (isTokenLike(token)) {
      return true;
    }

    if (isTokenGroup(token) && getTokenGroupType(token) === 'color') {
      return true;
    }

    return false;
  }

  override render() {
    return html`
      <wizard-card-as-link>
        <span slot="header">
          <slot></slot>
        </span>
        <slot name="link" slot="link"></slot>
        ${
          this.shouldRenderSample
            ? html`
                <wizard-token-sample slot="pre-header" path=${this.path} class="wizard-token-sample">
                  Aa
                </wizard-token-sample>
              `
            : nothing
        }
      </wizard-card-as-link>
    `;
  }
}
