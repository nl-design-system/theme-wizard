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
        <div class="clippy-layout-detail__grid">
          <div class="clippy-layout-detail__sidebar">
            <slot name="sidebar"><mark>sidebar</mark></slot>
          </div>

          <div class="clippy-layout-detail__breadcrumb">
            <slot name="breadcrumb"><mark>breadcrumb</mark></slot>
          </div>

          <div class="clippy-layout-detail__wrap-main">
            <slot>
              <div class="test-header"><mark>header</mark></div>
              <div class="test-aside"><mark>aside</mark></div>
              <div class="test-body"><mark>body</mark></div>
            </slot>
          </div>
        </div>
      </div>
    `;
  }
}
