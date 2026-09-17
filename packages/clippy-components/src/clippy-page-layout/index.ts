import { safeCustomElement } from '@src/lib/decorators';
import { LitElement, html } from 'lit';
import styles from './styles';

const tag = 'clippy-page-layout';

declare global {
  interface HTMLElementTagNameMap {
    [tag]: ClippyPageLayout;
  }
}

/**
 * Clippy Side Navigation Component
 * @slot - Main content
 * @slot header - Header content
 * @slot footer - Footer content
 */
@safeCustomElement(tag)
export class ClippyPageLayout extends LitElement {
  static override readonly styles = [styles];

  override render() {
    return html`
      <header class="clippy-page-layout__header">
        <slot name="header"></slot>
      </header>

      <div class="clippy-page-layout__content">
        <slot></slot>
      </div>

      <footer class="clippy-page-layout__footer">
        <slot name="footer"></slot>
      </footer>
    `;
  }
}
