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
 * Clippy Layout Detail Component
 * @slot - Main content
 * @slot sidebar - Sidebar content, for side navigation purposes
 */
@safeCustomElement(tag)
export class ClippyLayoutDetail extends LitElement {
  static override readonly styles = [styles];

  override render() {
    return html`
      <div class="clippy-layout-detail__content">
        <div class="clippy-layout-detail__grid">
          <div class="clippy-layout-detail__sidebar">
            <slot name="sidebar"></slot>
          </div>

          <div class="clippy-layout-detail__breadcrumb">
            <slot name="breadcrumb"></slot>
          </div>

          <div class="clippy-layout-detail__wrap-main" id="content">
            <slot></slot>
          </div>
        </div>
      </div>
    `;
  }
}
