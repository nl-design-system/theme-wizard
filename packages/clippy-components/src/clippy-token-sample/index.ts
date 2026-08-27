import { safeCustomElement } from '@src/lib/decorators';
import { LitElement, html } from 'lit';
import styles from './styles';

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

  override render() {
    return html`<mark>Hello world</mark>`;
  }
}
