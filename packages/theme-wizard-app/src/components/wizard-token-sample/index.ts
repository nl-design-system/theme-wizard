import { consume } from '@lit/context';
import '@nl-design-system-community/clippy-components/clippy-token-sample';
import {
  EXTENSION_COLORSCALE_SEED,
  getExtension,
  getGroupTokens,
  getTokenGroupType,
  isColorToken,
  isTokenGroup,
  isTokenLike,
} from '@nl-design-system-community/design-tokens-schema';
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

const FALLBACK_COLOR = 'color-default';
const INVERSE_FALLBACK_COLOR = 'bg-default';

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
    const value = this.theme?.at(this.path) as unknown;

    if (isTokenLike(value)) {
      return value;
    }

    // For token groups, show the seed-color, if available
    if (isTokenGroup(value) && getTokenGroupType(value) === 'color') {
      const seedColor = getExtension(value, EXTENSION_COLORSCALE_SEED);

      if (seedColor) {
        return {
          $type: 'color',
          $value: seedColor,
        };
      }

      if (this.path.includes('-inverse')) {
        if (Object.hasOwn(value, INVERSE_FALLBACK_COLOR) && isColorToken(value[INVERSE_FALLBACK_COLOR])) {
          return value[INVERSE_FALLBACK_COLOR];
        }
      }

      if (Object.hasOwn(value, FALLBACK_COLOR) && isColorToken(value[FALLBACK_COLOR])) {
        return value[FALLBACK_COLOR];
      }

      // If none of the fallback tokens are available, check if there's maybe one single token in the group:
      // (i.e. in `basis.form.control.placeholder`)
      const tokensInGroup = getGroupTokens(value);
      if (tokensInGroup.length === 1) {
        return tokensInGroup.at(0);
      }
    }

    return undefined;
  }

  protected override render() {
    return html`
      <clippy-token-sample .token=${this.token}>
        <slot></slot>
      </clippy-token-sample>
    `;
  }
}
