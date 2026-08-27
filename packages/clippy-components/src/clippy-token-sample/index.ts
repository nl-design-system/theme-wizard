import { BaseDesignToken, getTokenSubtype, stringifyToken } from '@nl-design-system-community/design-tokens-schema';
import { safeCustomElement } from '@src/lib/decorators';
import { getTokenDimensionSpaceConcept } from '@src/lib/tokens';
import { LitElement, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './styles';
import '../clippy-color-sample';
import '../clippy-token-sample-spacing';
import '../clippy-token-sample-text';
import '../clippy-token-sample-border';

const tag = 'clippy-token-sample';

declare global {
  interface HTMLElementTagNameMap {
    [tag]: ClippyTokenSample;
  }
}

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

  override render() {
    if (!this.token) {
      return nothing;
    }
    switch (this.token.$type) {
      case 'color':
        return html`<clippy-color-sample color=${stringifyToken(this.token)}></clippy-color-sample>`;
      case 'dimension': {
        // dimensions have a lot of different subtypes
        const subType = getTokenSubtype(this.token);
        switch (subType) {
          case 'font-size':
            return html`<clippy-token-sample-text
              font-size=${stringifyToken(this.token)}
              truncate
            ></clippy-token-sample-text>`;
          case 'space-block':
          case 'space-inline':
          case 'space-text':
          case 'space-column':
          case 'space-row':
            return html`<clippy-token-sample-spacing
              size=${stringifyToken(this.token)}
              concept=${getTokenDimensionSpaceConcept(this.token)}
            ></clippy-token-sample-spacing>`;
          case 'border-width':
            return html`<clippy-token-sample-border
              border-width=${stringifyToken(this.token)}
            ></clippy-token-sample-border>`;
          case 'border-radius':
            return html`<clippy-token-sample-border
              border-radius=${stringifyToken(this.token)}
            ></clippy-token-sample-border>`;
          default:
            return nothing;
        }
      }
      // TODO: Google fonts?
      case 'fontFamily':
        return html`<clippy-token-sample-text
          font-family=${stringifyToken(this.token)}
          font-size="var(--basis-text-font-size-xl)"
          truncate
        ></clippy-token-sample-text>`;
      case 'number': {
        const subType = getTokenSubtype(this.token);
        switch (subType) {
          case 'font-weight':
            return html`<clippy-token-sample-text
              font-weight=${stringifyToken(this.token)}
              font-size="var(--basis-text-font-size-xl)"
              truncate
            ></clippy-token-sample-text>`;
          case 'line-height':
            return html`<clippy-token-sample-text
              line-height=${stringifyToken(this.token)}
              font-size="var(--basis-text-font-size-xl)"
              truncate
            ></clippy-token-sample-text>`;
          default:
            return nothing;
        }
      }
      default:
        return nothing;
    }
  }
}
