import { consume } from '@lit/context';
import '@nl-design-system-community/clippy-components/clippy-token-sample';
import {
  getExtension,
  isColorToken,
  isTokenLike,
  isValueObject,
} from '@nl-design-system-community/design-tokens-schema';
import { html, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type Theme from '../../lib/Theme';
import { themeContext } from '../../contexts/theme';
import { EXTENSION_COLORSCALE_SEED } from '../../lib/ColorScale/siblings';

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

    // Value is an actual token:
    if (isTokenLike(value)) {
      return value;
    }

    // Value is a group of color tokens with a seed color
    const seedColor = isValueObject(value) ? getExtension(value, EXTENSION_COLORSCALE_SEED) : undefined;
    if (seedColor) {
      return {
        $type: 'color',
        $value: seedColor,
      };
    }

    // Value is a group of color tokens without a seed color
    if (isValueObject(value) && Object.values(value).every(isColorToken)) {
      if (this.path.endsWith('-inverse')) {
        return value['bg-default'];
      }
      return value['color-default'];
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
