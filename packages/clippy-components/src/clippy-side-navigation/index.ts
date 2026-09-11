import buttonCSS from '@gemeente-denhaag/iconbutton/index.css?inline';
import navStyles from '@gemeente-denhaag/side-navigation/index.css?inline';
import { safeCustomElement } from '@src/lib/decorators';
import ChevronDown from '@tabler/icons/outline/chevron-down.svg?raw';
import { LitElement, TemplateResult, html, nothing, unsafeCSS } from 'lit';
import { property } from 'lit/decorators.js';
import { map } from 'lit/directives/map.js';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import styles from './styles';
import { SideNavigationItem, SideNavigationItems } from './types';

const tag = 'clippy-side-navigation';

declare global {
  interface HTMLElementTagNameMap {
    [tag]: ClippySideNavigation;
  }
}

/**
 * Clippy Side Navigation Component
 */
@safeCustomElement(tag)
export class ClippySideNavigation extends LitElement {
  static override readonly styles = [unsafeCSS(buttonCSS), unsafeCSS(navStyles), styles];

  @property({ type: Object })
  items?: SideNavigationItems;

  #renderItem(item: SideNavigationItem): TemplateResult {
    const hasSubItems = (item.items?.length ?? 0) > 0;

    return html`
      <li class="denhaag-side-navigation__item">
        <span class="denhaag-side-navigation__tree-item-label-wrapper">
          <a class="denhaag-side-navigation__link" href=${item.href} aria-current=${item.active ? 'page' : nothing}>
            ${item.label}
          </a>
          ${
            hasSubItems
              ? html`
                  <span class="denhaag-side-navigation__expand-separator"></span>
                  <button
                    aria-label="Open submenu Link 2 met submenu"
                    aria-expanded="false"
                    class="denhaag-icon-button denhaag-side-navigation__expand-button"
                  >
                    ${unsafeSVG(ChevronDown)}
                  </button>
                `
              : nothing
          }
        </span>
        ${
          hasSubItems
            ? html`
                <ul class="denhaag-side-navigation__list">
                  ${map(item.items!, (child) => this.#renderItem(child))}
                </ul>
              `
            : nothing
        }
      </li>
    `;
  }

  override render() {
    return html`
      <nav class="denhaag-side-navigation">
        <ul class="denhaag-side-navigation__list">
          ${map(this.items, (item) => this.#renderItem(item))}
        </ul>
      </nav>
    `;
  }
}
