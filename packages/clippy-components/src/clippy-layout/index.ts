import { safeCustomElement } from '@src/lib/decorators';
import { LitElement, html } from 'lit';
import styles from './styles';

const tag = 'clippy-layout';

declare global {
  interface HTMLElementTagNameMap {
    [tag]: ClippyLayout;
  }
}

/**
 * Clippy Side Navigation Component
 */
@safeCustomElement(tag)
export class ClippyLayout extends LitElement {
  static override readonly styles = [styles];

  override render() {
    return html` Hello world `;
  }
}
