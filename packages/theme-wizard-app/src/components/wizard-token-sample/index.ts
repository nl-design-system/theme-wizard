import { consume } from '@lit/context';
import '@nl-design-system-community/clippy-components/clippy-token-sample';
import {
  ColorValueSchema,
  EXTENSION_COLORSCALE_SEED,
  getExtension,
  getTokenGroupType,
  isTokenGroup,
  isTokenLike,
  type TokenGroup,
} from '@nl-design-system-community/design-tokens-schema';
import { html, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type Theme from '../../lib/Theme';
import { themeContext } from '../../contexts/theme';
import { INVERSE_SUFFIX } from '../../lib/ColorScale';

const tag = 'wizard-token-sample';

declare global {
  interface HTMLElementTagNameMap {
    [tag]: WizardTokenSample;
  }
}

const FALLBACK_COLOR = 'color-default';
const INVERSE_FALLBACK_COLOR = 'bg-default';

// Picks a representative color token for a color token group: seed color, path-based fallback, or sole member
export function getColorGroupSample(value: TokenGroup, path: string) {
  const isInverse = path.endsWith(INVERSE_SUFFIX);
  const seedColor = getExtension(value, EXTENSION_COLORSCALE_SEED);
  const parsedSeed = ColorValueSchema.safeParse(seedColor);
  if (parsedSeed.success) {
    return {
      $type: 'color',
      $value: parsedSeed.data,
    };
  } else {
    const fallBackToken = isInverse ? value?.[INVERSE_FALLBACK_COLOR] : value?.[FALLBACK_COLOR];
    return fallBackToken;
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

    if (isTokenLike(value)) {
      return value;
    }

    // For token groups, show the seed-color, if available
    if (isTokenGroup(value) && getTokenGroupType(value) === 'color') {
      return getColorGroupSample(value, this.path);
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
