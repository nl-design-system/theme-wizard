import { safeCustomElement } from '@src/lib/decorators';
import { LitElement, html } from 'lit';
import styles from './styles';

const tag = 'clippy-page-header';

declare global {
  interface HTMLElementTagNameMap {
    [tag]: ClippyPageHeader;
  }
}

/**
 * Clippy Side Navigation Component
 * @slot - Main content
 */
@safeCustomElement(tag)
export class ClippyPageHeader extends LitElement {
  static override readonly styles = [styles];

  override render() {
    return html` <slot>Hello world</slot> `;
  }
}
