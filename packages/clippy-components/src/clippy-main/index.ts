import { safeCustomElement } from '@src/lib/decorators';
import { LitElement, html } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './styles';
import { Variant } from './types';

const tag = 'clippy-main';

declare global {
  interface HTMLElementTagNameMap {
    [tag]: ClippyMain;
  }
}

/**
 * Clippy Layout Main Component
 * @slot - Default body content
 * @slot aside - Complementary content, eg. anchor-navigation, authors, etc.
 * @slot header - Header content, eg titles, hero images, etc.
 *
 * @cssprop --clippy-main-row-gap - The gap between the header, aside and the body
 */
@safeCustomElement(tag)
export class ClippyMain extends LitElement {
  static override readonly styles = [styles];

  @property({ reflect: true, type: String })
  public variant: Variant = 'default';

  override render() {
    return html`
      <main>
        <div class="clippy-main__header">
          <slot name="header"></slot>
        </div>
        <div class="clippy-main__aside">
          <slot name="aside"></slot>
        </div>
        <div class="clippy-main__body">
          <slot></slot>
        </div>
      </main>
    `;
  }
}
