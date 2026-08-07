import { safeCustomElement } from '@src/lib/decorators';
import { LitElement, html } from 'lit';
import styles from './styles';

const tag = 'clippy-token-sample-typography';

declare global {
  interface HTMLElementTagNameMap {
    [tag]: ClippyTokenSampleTypography;
  }
}

/**
 * Clippy Token Sample Typography Component
 */
@safeCustomElement(tag)
export class ClippyTokenSampleTypography extends LitElement {
  static override readonly styles = [styles];

  override render() {
    return html`clippy-token-sample-typography`;
  }
}
