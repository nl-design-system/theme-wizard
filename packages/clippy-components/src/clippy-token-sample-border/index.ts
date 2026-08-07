import { safeCustomElement } from '@src/lib/decorators';
import { LitElement, PropertyValues, html } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './styles';

const tag = 'clippy-token-sample-border';

declare global {
  interface HTMLElementTagNameMap {
    [tag]: ClippyTokenSampleBorder;
  }
}

/**
 * Clippy Token Sample Border Component
 *
 * @cssprop --clippy-token-sample-border-size - Size of the component
 * @cssprop --clippy-token-sample-border-radius - Border radius of the border
 * @cssprop --clippy-token-sample-border-width - Width of the border
 */
@safeCustomElement(tag)
export class ClippyTokenSampleBorder extends LitElement {
  static override readonly styles = [styles];

  @property({ attribute: 'border-radius', reflect: true, type: String })
  borderRadius?: string = '';

  @property({ attribute: 'border-width', reflect: true, type: String })
  borderWidth?: string = '1px';

  override willUpdate(changed: PropertyValues) {
    if (changed.has('borderWidth')) {
      if (this.borderWidth === undefined || this.borderWidth === '') {
        this.borderWidth = '1px';
      }
      this.style.setProperty('--_clippy-internal-token-sample-border-width', this.borderWidth);
    }
    if (changed.has('borderRadius')) {
      if (this.borderRadius === undefined) {
        this.borderRadius = '';
      }
      this.style.setProperty('--_clippy-internal-token-sample-border-radius', this.borderRadius);
    }
  }

  override render() {
    return html`<div class="clippy-token-sample-border__dummy"></div>`;
  }
}
