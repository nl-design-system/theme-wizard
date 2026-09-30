import { safeCustomElement } from '@src/lib/decorators';
import { LitElement, html } from 'lit';
import styles from './styles';

const tag = 'clippy-layout-main';

declare global {
  interface HTMLElementTagNameMap {
    [tag]: ClippyLayoutMain;
  }
}

/**
 * Clippy Layout Main Component
 * @slot - Default body content
 * @slot aside - Complementary content, eg. anchor-navigation, authors, etc.
 * @slot header - Header content, eg titles, hero images, etc.
 */
@safeCustomElement(tag)
export class ClippyLayoutMain extends LitElement {
  static override readonly styles = [styles];

  override render() {
    return html`
      <main>
        <div class="clippy-layout-main__header">
          <slot name="header"></slot>
        </div>
        <div class="clippy-layout-main__aside">
          <slot name="aside"></slot>
        </div>
        <div class="clippy-layout-main__body">
          <slot></slot>
        </div>
      </main>
    `;
  }
}
