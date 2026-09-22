import { ClippyDrawer } from '@src/clippy-drawer';
import { safeCustomElement } from '@src/lib/decorators';
import Menu2Icon from '@tabler/icons/outline/menu-2.svg?raw';
import { LitElement, html, nothing } from 'lit';
import '@src/clippy-button';
import '@src/clippy-drawer';
import { property, query } from 'lit/decorators.js';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import srOnly from '../lib/sr-only';
import styles from './styles';

const tag = 'clippy-page-header-compact';

declare global {
  interface HTMLElementTagNameMap {
    [tag]: ClippyPageHeaderCompact;
  }
}

/**
 * Clippy Side Navigation Component
 */
@safeCustomElement(tag)
export class ClippyPageHeaderCompact extends LitElement {
  static override readonly styles = [styles, srOnly];

  @property({ reflect: true, type: Boolean })
  inverse: boolean = false;

  @property({ reflect: true, type: String })
  variant: 'default' | 'compact' = 'compact';

  @property({ attribute: 'label-menu-item', type: String }) labelMenuItem: string = 'Menu';
  @property({ attribute: 'label-drawer-title', type: String }) labelDrawerTitle: string = 'Hoofdnavigatie';

  @query('clippy-drawer')
  readonly drawerElement!: ClippyDrawer;

  /**
   * Render the navigation bar
   * Based on the variant we want to render the navigation bar in the top or in the bottom bar.
   */
  #renderNavBar(location: 'top' | 'bottom') {
    if ((this.variant === 'default' && location === 'top') || (this.variant === 'compact' && location === 'bottom')) {
      return nothing;
    }
    return html`
      <div class="clippy-page-header__wrap-navigation clippy-page-header__wrap-navigation--${location}">
        <slot name="navigation-bar"></slot>
      </div>
    `;
  }

  #openDrawer() {
    this.drawerElement?.open();
  }

  override render() {
    return html`
      <div class="clippy-page-header">
        <div class="clippy-page-header__top">
          <section class="clippy-page-header__content">
            <div class="clippy-page-header__group clippy-page-header__group--start">
              <clippy-button
                purpose="subtle"
                @click=${() => {
                  this.#openDrawer();
                }}
              >
                <clippy-icon slot="iconStart">${unsafeSVG(Menu2Icon)}</clippy-icon>
                ${this.labelMenuItem}
              </clippy-button>
            </div>

            <div class="clippy-page-header__group clippy-page-header__group--center">
              <div class="clippy-page-header__wrap-logo">
                <slot name="logo"></slot>
              </div>
              ${this.#renderNavBar('top')}
            </div>

            <div class="clippy-page-header__group clippy-page-header__group--end"><slot name="end">end</slot></div>
          </section>
        </div>

        <div class="clippy-page-header__bottom">${this.#renderNavBar('bottom')}</div>
        <clippy-drawer actions="none">
          <span class="sr-only" slot="title">${this.labelDrawerTitle}</span>
          <slot name="navigation-drawer"></slot>
        </clippy-drawer>
      </div>
    `;
  }
}
