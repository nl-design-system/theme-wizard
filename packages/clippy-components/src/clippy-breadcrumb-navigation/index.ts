import { type NavigationItem } from '@src/clippy-navigation-bar';
import { safeCustomElement } from '@src/lib/decorators';
import '@src/clippy-heading';
import '@src/clippy-icon';
import ChevronRightIcon from '@tabler/icons/outline/chevron-right.svg?raw';
import breadcrumbStyles from '@utrecht/breadcrumb-nav-css/dist/index.css?inline';
import linkStyles from '@utrecht/link-css/dist/index.css?inline';
import { LitElement, TemplateResult, html, nothing, unsafeCSS } from 'lit';
import { property } from 'lit/decorators.js';
import { map } from 'lit/directives/map.js';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import srOnly from '../lib/sr-only';
import styles from './styles';

const tag = 'clippy-breadcrumb-navigation';

declare global {
  interface HTMLElementTagNameMap {
    [tag]: ClippyBreadcrumbNavigation;
  }
}

/**
 * Clippy Breadcrumb Navigation Component
 * @cssprop --clippy-breadcrumb-navigation-highlighted - Boolean to signal if the table of contents is highlighted
 */
@safeCustomElement(tag)
export class ClippyBreadcrumbNavigation extends LitElement {
  static override readonly styles = [unsafeCSS(breadcrumbStyles), unsafeCSS(linkStyles), styles, srOnly];

  @property({ type: Object })
  items?: NavigationItem[];

  @property({ type: String }) label: string = 'Kruimelpad';

  readonly #navId = crypto.randomUUID();

  #renderItem(item: NavigationItem, isLast: boolean): TemplateResult {
    return html`
      <li
        class="clippy-breadcrumb-navigation__item | utrecht-breadcrumb-nav__item"
        itemscope
        itemtype="https://schema.org/ListItem"
        itemprop="itemListElement"
      >
        <a
          class="clippy-breadcrumb-navigation__link | utrecht-breadcrumb-nav__link${item.current ? ' utrecht-breadcrumb-nav__link--disabled' : ''} | utrecht-link utrecht-link--html-a"
          href=${item.current ? nothing : item.href}
          aria-current=${item.current ? 'page' : nothing}
          aria-disabled=${item.current ? 'page' : nothing}
          target=${item.target || nothing}
          hreflang=${item.hreflang || nothing}
          lang=${item.lang || nothing}
          itemprop="item"
        >
          ${item.label}
        </a>
      </li>
      ${isLast ? nothing : html`<li hidden aria-hidden="true" class="clippy-breadcrumb-navigation__separator | utrecht-breadcrumb-nav__separator utrecht-breadcrumb-nav__separator--html-li"><clippy-icon aria-hidden="true">${unsafeSVG(ChevronRightIcon)}</clippy-icon></li>`}
    `;
  }

  override render() {
    return html`
      <nav class="clippy-breadcrumb-navigation__content" aria-labelledby=${this.#navId}>
        <clippy-heading level=${2} id=${this.#navId} class="sr-only">${this.label}</clippy-heading>
        <ol
          class="utrecht-breadcrumb-nav__list utrecht-breadcrumb-nav__list--html-ol"
          itemscope
          itemtype="https://schema.org/BreadcrumbList"
        >
          ${this.items ? map(this.items, (item, index) => this.#renderItem(item, index === this.items!.length - 1)) : nothing}
        </ol>
      </nav>
    `;
  }
}
