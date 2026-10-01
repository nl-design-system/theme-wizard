import { safeCustomElement } from '@src/lib/decorators';
import { LitElement, html } from 'lit';
import { query } from 'lit/decorators.js';
import styles from './styles';

const tag = 'clippy-page-layout';

declare global {
  interface HTMLElementTagNameMap {
    [tag]: ClippyPageLayout;
  }
}

/**
 * Clippy Page Layout Component
 * @slot - Main content
 * @slot header - Header content
 * @slot footer - Footer content
 * @cssprop --clippy-page-layout-header-block-size - The block-size of the header (updated with JS)
 * @cssprop --clippy-page-layout-background-color - The background color
 */
@safeCustomElement(tag)
export class ClippyPageLayout extends LitElement {
  static override readonly styles = [styles];

  @query('header') private headerElement!: HTMLElement;

  #resizeObserver?: ResizeObserver;
  #lastHeaderSize = 0;

  override connectedCallback() {
    super.connectedCallback();

    this.#resizeObserver ??= new ResizeObserver((entries) => {
      const box = entries[entries.length - 1].borderBoxSize[0];
      this.#setHeaderHeight(box?.blockSize);
    });

    if (this.headerElement) {
      this.#resizeObserver.observe(this.headerElement);
    }
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.#resizeObserver?.disconnect();
  }

  protected override firstUpdated() {
    this.#resizeObserver!.observe(this.headerElement);
  }

  #setHeaderHeight(height: number) {
    if (height !== this.#lastHeaderSize) {
      this.#lastHeaderSize = height;
      this.style.setProperty('--clippy-page-layout-header-block-size', `${height}px`);
    }
  }

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
