import { BaseDesignToken, getTokenSubtype, isTokenLike } from '@nl-design-system-community/design-tokens-schema';
import { safeCustomElement } from '@src/lib/decorators';
import { getTokenDimensionSpaceConcept, stringifyTokenValue } from '@src/lib/tokens';
import { LitElement, type TemplateResult, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './styles';
import '../clippy-color-sample';
import '../clippy-token-sample-spacing';
import '../clippy-token-sample-text';
import '../clippy-token-sample-border';
import '../clippy-html-image';

const tag = 'clippy-token-sample';

declare global {
  interface HTMLElementTagNameMap {
    [tag]: ClippyTokenSample;
  }
}

const TEST_ID = 'token-sample-element';
const FALLBACK_TEXT = 'Op brute wijze ving de schooljuf de quasi-kalme lynx.';

/**
 * Clippy Token Sample Component
 *
 * @cssprop
 */
@safeCustomElement(tag)
export class ClippyTokenSample extends LitElement {
  static override readonly styles = [styles];

  @property({ type: Object })
  token?: BaseDesignToken;

  /** Accessible label of the sample; defaults to the token subtype and value */
  @property({ type: String })
  label = '';

  #renderImage(label: string, sample: TemplateResult) {
    return html`
      <clippy-html-image>
        <span slot="label">${label}</span>
        ${sample}
      </clippy-html-image>
    `;
  }

  override render() {
    if (!this.token || !isTokenLike(this.token)) {
      return nothing;
    }
    const value = stringifyTokenValue(this.token);
    const subType = getTokenSubtype(this.token);
    const label = this.label || `${subType ?? this.token.$type} ${value}`;
    switch (this.token.$type) {
      case 'color':
        return html`<clippy-color-sample data-testid=${TEST_ID} color=${value} label=${label}></clippy-color-sample>`;
      case 'dimension': {
        // dimensions have a lot of different subtypes
        switch (subType) {
          case 'font-size':
            return html`<clippy-token-sample-text data-testid=${TEST_ID} font-size=${value} label=${label} truncate>
              <slot>${FALLBACK_TEXT}</slot>
            </clippy-token-sample-text>`;
          case 'line-height':
            return html`<clippy-token-sample-text data-testid=${TEST_ID} line-height=${value} label=${label} truncate>
              <slot>${FALLBACK_TEXT}</slot>
            </clippy-token-sample-text>`;
          case 'space-block':
          case 'space-inline':
          case 'space-text':
          case 'space-column':
          case 'space-row':
            return this.#renderImage(
              label,
              html`<clippy-token-sample-spacing
                data-testid=${TEST_ID}
                size=${value}
                concept=${getTokenDimensionSpaceConcept(this.token)}
              ></clippy-token-sample-spacing>`,
            );
          case 'border-width':
            return this.#renderImage(
              label,
              html`<clippy-token-sample-border
                data-testid=${TEST_ID}
                border-width=${value}
              ></clippy-token-sample-border>`,
            );
          case 'border-radius':
            return this.#renderImage(
              label,
              html`<clippy-token-sample-border
                data-testid=${TEST_ID}
                border-radius=${value}
              ></clippy-token-sample-border>`,
            );
          default:
            return nothing;
        }
      }
      // TODO: Google fonts?
      case 'fontFamily':
        return html`<clippy-token-sample-text data-testid=${TEST_ID} font-family=${value} label=${label} truncate>
          <slot>${FALLBACK_TEXT}</slot>
        </clippy-token-sample-text>`;
      case 'number': {
        switch (subType) {
          case 'font-weight':
            return html`<clippy-token-sample-text data-testid=${TEST_ID} font-weight=${value} label=${label} truncate>
              <slot>${FALLBACK_TEXT}</slot>
            </clippy-token-sample-text>`;
          case 'line-height':
            return html`<clippy-token-sample-text data-testid=${TEST_ID} line-height=${value} label=${label} truncate>
              <slot>${FALLBACK_TEXT}</slot>
            </clippy-token-sample-text>`;
          default:
            return nothing;
        }
      }
      default:
        return nothing;
    }
  }
}
