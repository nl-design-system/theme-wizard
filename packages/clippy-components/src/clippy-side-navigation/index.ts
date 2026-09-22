import buttonCSS from '@gemeente-denhaag/iconbutton/index.css?inline';
import navStyles from '@gemeente-denhaag/side-navigation/index.css?inline';
import { safeCustomElement } from '@src/lib/decorators';
import ChevronDown from '@tabler/icons/outline/chevron-down.svg?raw';
import { LitElement, TemplateResult, html, nothing, unsafeCSS } from 'lit';
import { property, state } from 'lit/decorators.js';
import { map } from 'lit/directives/map.js';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import { NavigationItem, NavigationItems } from '../clippy-navigation-bar/types';
import srOnly from '../lib/sr-only';
import styles from './styles';

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
  static override readonly styles = [unsafeCSS(buttonCSS), unsafeCSS(navStyles), styles, srOnly];

  @state() private expandedItems = new Set<NavigationItem>();

  @property({ type: Object })
  items?: NavigationItems;

  @property({ attribute: 'cascade-collapse', type: Boolean })
  cascadeCollapse?: boolean = false;

  @property({ type: String }) label: string | undefined = undefined;
  @property({ attribute: 'label-expand-open', type: String }) labelExpandOpen: string = 'Open submenu for:';
  @property({ attribute: 'label-expand-close', type: String }) labelExpandClose: string = 'Close submenu for:';

  readonly #navId = crypto.randomUUID();

  override willUpdate(changed: Map<string, unknown>) {
    super.willUpdate(changed);
    if (changed.has('items') && this.items && this.items.length) {
      this.expandedItems = this.#updateInitiaExpandedItems(this.items);
    }
  }

  #updateInitiaExpandedItems(items: NavigationItems): Set<NavigationItem> {
    const set = new Set<NavigationItem>();
    const walk = (nodes: NavigationItems): boolean => {
      let subtreeActive = false;
      for (const node of nodes) {
        const childActive = node.items?.length ? walk(node.items) : false;
        if (node.current || childActive) {
          subtreeActive = true;
          if (node.items?.length) {
            set.add(node);
          }
        }
      }
      return subtreeActive;
    };
    walk(items);
    return set;
  }

  #collectDescendantItems(item: NavigationItem): NavigationItem[] {
    const items: NavigationItem[] = [];
    const walk = (node: NavigationItem) => {
      if (!node.items?.length) return;
      for (const child of node.items) {
        items.push(child);
        walk(child);
      }
    };
    walk(item);
    return items;
  }

  #toggle(item: NavigationItem) {
    const next = new Set(this.expandedItems);
    if (next.has(item)) {
      // If the item is expanded: Collapse
      next.delete(item);
      // And collapse nested items as well
      if (this.cascadeCollapse) {
        for (const nestedItem of this.#collectDescendantItems(item)) {
          next.delete(nestedItem);
        }
      }
    } else {
      // Expand the item
      next.add(item);
    }
    this.expandedItems = next;
    this.requestUpdate();
  }

  #renderItem(item: NavigationItem): TemplateResult {
    const hasSubItems = (item.items?.length ?? 0) > 0;
    const isOpen = this.expandedItems.has(item);

    return html`
      <li class="denhaag-side-navigation__item">
        <span class="denhaag-side-navigation__tree-item-label-wrapper">
          <a
            class="denhaag-side-navigation__link"
            href=${item.href}
            aria-current=${item.current ? 'page' : nothing}
            target=${item.target || nothing}
            hreflang=${item.hreflang || nothing}
            lang=${item.lang || nothing}
          >
            ${item.label}
          </a>
          ${
            hasSubItems
              ? html`
                  <span class="denhaag-side-navigation__expand-separator"></span>
                  <button
                    aria-expanded=${isOpen ? 'true' : 'false'}
                    class="denhaag-icon-button denhaag-side-navigation__expand-button"
                    @click=${() => this.#toggle(item)}
                  >
                    ${unsafeSVG(ChevronDown)}
                    <span class="sr-only">
                      ${isOpen ? `${this.labelExpandClose} ${item.label}` : `${this.labelExpandOpen} ${item.label}`}
                    </span>
                  </button>
                `
              : nothing
          }
        </span>
        ${
          hasSubItems && isOpen
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
    if (!this.items?.length) {
      return nothing;
    }

    return html`
      <nav class="denhaag-side-navigation" aria-labelledby=${this.label ? this.#navId : nothing}>
        ${this.label ? html`<span id=${this.#navId} class="sr-only">${this.label}</span>` : nothing}
        <ul class="denhaag-side-navigation__list">
          ${map(this.items, (item) => this.#renderItem(item))}
        </ul>
      </nav>
    `;
  }
}
