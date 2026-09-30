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
 * @slot sidebar - Sidebar content, for side navigation
 * @slot breadcrumb - Area for the page breadcrumb
 *
 * @cssprop --clippy-layout-detail-content-max-inline-size - Max inline size of the content area, defaults the page-layout inline size
 * @cssprop --clippy-layout-detail-content-padding-inline-start - Inline start padding of the content element
 * @cssprop --clippy-layout-detail-content-padding-inline-end - Inline end padding of the content element
 * @cssprop --clippy-layout-detail-content-padding-block-start - block start padding of the content element
 * @cssprop --clippy-layout-detail-content-padding-block-end - block end padding of the content element
 * @cssprop --clippy-layout-detail-column-gap - Column gap of the grid
 * @cssprop --clippy-layout-detail-sidebar-inline-size - Inline size of the sidebar and the aside
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

          <div class="clippy-layout-detail__wrap-main">
            <slot></slot>
          </div>
        </div>
      </div>
    `;
  }
}
