import { safeCustomElement } from '@src/lib/decorators';
import { LitElement, html, unsafeCSS } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './styles';

const tag = 'clippy-page-header-compact';

declare global {
  interface HTMLElementTagNameMap {
    [tag]: ClippyPageHeaderCompact;
  }
}

/**
 * Clippy Side Navigation Component
 * @slot - Main content
 */
@safeCustomElement(tag)
export class ClippyPageHeaderCompact extends LitElement {
  static override readonly styles = [styles];

  @property({ reflect: true, type: Boolean })
  inverse: boolean = false;

  override render() {
    return html`
      <div class= clippy-page-header">
        <div class="clippy-page-header__top">
          <section class="clippy-page-header__content">
            <div class="clippy-page-header__group clippy-page-header__group--start"><mark>start</mark></div>
            <div class="clippy-page-header__group clippy-page-header__group--center"><mark>center</mark></div>
            <div class="clippy-page-header__group clippy-page-header__group--end"><mark>end</mark></div>
          </section>
        </div>
        <div class="clippy-page-header__bottom">
          <section class="clippy-page-header__content">
            <mark>nav</mark>
          </section>
        </div>
      </div>
    `;
  }
}
