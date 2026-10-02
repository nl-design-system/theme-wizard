import { ClippyLayoutOverview } from '@src/clippy-layout-overview';
import baseStyles from '@src/clippy-layout-overview/styles';
import { safeCustomElement } from '@src/lib/decorators';
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
 * @cssprop --clippy-layout-content-max-inline-size - Max inline size of the content area, defaults the page-layout inline size
 * @cssprop --clippy-layout-content-padding-inline-start - Inline start padding of the content element
 * @cssprop --clippy-layout-content-padding-inline-end - Inline end padding of the content element
 * @cssprop --clippy-layout-content-padding-block-start - block start padding of the content element
 * @cssprop --clippy-layout-content-padding-block-end - block end padding of the content element
 * @cssprop --clippy-layout-column-gap - Column gap of the grid
 * @cssprop --clippy-layout-sidebar-inline-size - Inline size of the sidebar and the aside
 */
@safeCustomElement(tag)
export class ClippyLayoutDetail extends ClippyLayoutOverview {
  static override readonly styles = [baseStyles, styles];
}
