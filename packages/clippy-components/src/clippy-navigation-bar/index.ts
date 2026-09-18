import { safeCustomElement } from '@src/lib/decorators';
import { LitElement, TemplateResult, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import { map } from 'lit/directives/map.js';
import srOnly from '../lib/sr-only';
import styles from './styles';
import { NavigationItem, NavigationItems } from './types';

export type { NavigationItem, NavigationItems } from './types';

const tag = 'clippy-navigation-bar';

declare global {
  interface HTMLElementTagNameMap {
    [tag]: ClippyNavigationBar;
  }
}

/**
 * Clippy Side Navigation Component
 */
@safeCustomElement(tag)
export class ClippyNavigationBar extends LitElement {
  static override readonly styles = [styles, srOnly];

  @property({ type: Object })
  items?: NavigationItems;

  @property({ type: String }) label: string | undefined = undefined;

  readonly #navId = crypto.randomUUID();

  #renderItem(item: NavigationItem): TemplateResult {
    return html`
      <li>
        <span>
          <a
            href=${item.href}
            aria-current=${item.current ? 'page' : nothing}
            target=${item.target || nothing}
            hreflang=${item.hreflang || nothing}
            lang=${item.lang || nothing}
          >
            ${item.label}
          </a>
        </span>
      </li>
    `;
  }

  override render() {
    if (!this.items?.length) {
      return nothing;
    }

    return html`
      <nav aria-labelledby=${this.label ? this.#navId : nothing}>
        ${this.label ? html`<span id=${this.#navId} class="sr-only">${this.label}</span>` : nothing}
        <ul>
          ${map(this.items, (item) => this.#renderItem(item))}
        </ul>
      </nav>
    `;
  }
}
