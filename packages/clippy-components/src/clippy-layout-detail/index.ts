import { safeCustomElement } from '@src/lib/decorators';
import { LitElement, html } from 'lit';
import styles from './styles';

const tag = 'clippy-layout-detail';

declare global {
  interface HTMLElementTagNameMap {
    [tag]: ClippyLayoutDetail;
  }
}

/**
 * Clippy Main Layout Component
 * @slot - Main content
 */
@safeCustomElement(tag)
export class ClippyLayoutDetail extends LitElement {
  static override readonly styles = [styles];

  override render() {
    return html`
      <div class="clippy-layout-detail__content">
        <div class="clippy-layout-detail__sidebar">
          <slot name="sidebar"><mark>sidebar</mark></slot>
        </div>
        <div class="clippy-layout-detail__breadcrumbs">
          <slot name="breadcrumb"><mark>main content</mark></slot>
        </div>

        <div class="clippy-layout-detail__wrap-main">
          <slot><mark>main content</mark></slot>
        </div>
      </div>
    `;
  }
}
