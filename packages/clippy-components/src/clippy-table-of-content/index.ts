import listStyles from '@amsterdam/design-system-css/dist/unordered-list/unordered-list.css?inline';
import linkStyles from '@nl-design-system-candidate/link-css/link.css?inline';
import '@src/clippy-heading';
import { type NavigationItem } from '@src/clippy-navigation-bar';
import { safeCustomElement } from '@src/lib/decorators';
import { LitElement, TemplateResult, html, nothing, unsafeCSS } from 'lit';
import { property } from 'lit/decorators.js';
import { map } from 'lit/directives/map.js';
import srOnly from '../lib/sr-only';
import styles from './styles';

const tag = 'clippy-table-of-content';

declare global {
  interface HTMLElementTagNameMap {
    [tag]: ClippyTableOfContent;
  }
}

/**
 * Clippy Table Of Content Component
 * @cssprop --clippy-table-of-content-highlighted - Boolean to signal if the table of contents is highlighted
 */
@safeCustomElement(tag)
export class ClippyTableOfContent extends LitElement {
  static override readonly styles = [unsafeCSS(listStyles), unsafeCSS(linkStyles), styles, srOnly];

  @property({ type: Object })
  items?: NavigationItem[];

  @property({ type: String }) label: string = 'Inhoudsopgave';

  readonly #navId = crypto.randomUUID();

  #renderItem(item: NavigationItem): TemplateResult {
    return html`
      <li class="ams-unordered-list__item">
        <a
          class="nl-link"
          href=${item.href}
          aria-current=${item.current ? 'page' : nothing}
          target=${item.target || nothing}
          hreflang=${item.hreflang || nothing}
          lang=${item.lang || nothing}
        >
          ${item.label}
        </a>
      </li>
    `;
  }

  override render() {
    return html`
      <nav class="clippy-table-of-content__content" aria-labelledby=${this.#navId}>
        <clippy-heading level=${2} id=${this.#navId}>${this.label}</clippy-heading>
        <ul class="ams-unordered-list">
          ${map(this.items, (item) => this.#renderItem(item))}
        </ul>
      </nav>
    `;
  }
}
