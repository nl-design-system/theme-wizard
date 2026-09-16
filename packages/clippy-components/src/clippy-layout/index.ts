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
    return html`
      <header class="clippy-layout__masthead">
        <slot name="masthead"></slot>
      </header>

      <div class="clippy-layout__body">
        <div class="clippy-layout__sidebar">
          <slot name="sidebar"></slot>
        </div>

        <main id="content" class="clippy-layout__main">
          <slot></slot>
        </main>
      </div>

      <footer class="clippy-layout__footer">
        <slot name="footer"></slot>
      </footer>
    `;
  }
}
