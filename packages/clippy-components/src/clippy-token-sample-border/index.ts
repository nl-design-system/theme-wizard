import { safeCustomElement } from '@src/lib/decorators';
import { LitElement, html } from 'lit';
import styles from './styles';

const tag = 'clippy-token-sample-border';

declare global {
  interface HTMLElementTagNameMap {
    [tag]: ClippyTokenSampleBorder;
  }
}

/**
 * Clippy Token Sample Border Component
 */
@safeCustomElement(tag)
export class ClippyTokenSampleBorder extends LitElement {
  static override readonly styles = [styles];

  override render() {
    return html` clippy-token-sample-border `;
  }
}
