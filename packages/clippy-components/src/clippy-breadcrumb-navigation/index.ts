import { type NavigationItem } from '@src/clippy-navigation-bar';
import { safeCustomElement } from '@src/lib/decorators';
import '@src/clippy-heading';
import breadcrumbStyles from '@utrecht/breadcrumb-nav-css/dist/index.css?inline';
import linkStyles from '@utrecht/link-css/dist/index.css?inline';
import { LitElement, TemplateResult, html, nothing, unsafeCSS } from 'lit';
import { property } from 'lit/decorators.js';
import { map } from 'lit/directives/map.js';
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

  #renderItem(item: NavigationItem): TemplateResult {
    return html`
      <li
        class="utrecht-breadcrumb-nav__item"
        itemscope
        itemtype="https://schema.org/ListItem"
        itemprop="itemListElement"
      >
        <a
          class="utrecht-link utrecht-link--html-a | utrecht-breadcrumb-nav__link ${item.current ? 'utrecht-breadcrumb-nav__link--disabled' : ''}"
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
          ${map(this.items, (item) => this.#renderItem(item))}
        </ol>
      </nav>
    `;
  }
}
