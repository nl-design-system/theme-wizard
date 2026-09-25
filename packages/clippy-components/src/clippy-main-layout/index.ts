import { safeCustomElement } from '@src/lib/decorators';
import { LitElement, html } from 'lit';
import styles from './styles';

const tag = 'clippy-main-layout';

declare global {
  interface HTMLElementTagNameMap {
    [tag]: ClippyMainLayout;
  }
}

/**
 * Clippy Main Layout Component
 * @slot - Main content
 */
@safeCustomElement(tag)
export class ClippyMainLayout extends LitElement {
  static override readonly styles = [styles];

  override render() {
    return html` <slot></slot> `;
  }
}
