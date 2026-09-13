import buttonCSS from '@gemeente-denhaag/iconbutton/index.css?inline';
import navStyles from '@gemeente-denhaag/side-navigation/index.css?inline';
import { safeCustomElement } from '@src/lib/decorators';
import ChevronDown from '@tabler/icons/outline/chevron-down.svg?raw';
import { LitElement, TemplateResult, html, nothing, unsafeCSS } from 'lit';
import { property, state } from 'lit/decorators.js';
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

  @state() private expandedItems = new Set<SideNavigationItem>();

  @property({ type: Object })
  items?: SideNavigationItems;

  override willUpdate(changed: Map<string, unknown>) {
    super.willUpdate(changed);
    if (changed.has('items') && this.items) {
      this.expandedItems = this.#updateInitiaExpandedItems(this.items);
    }
  }

  #updateInitiaExpandedItems(items: SideNavigationItems): Set<SideNavigationItem> {
    const set = new Set<SideNavigationItem>();
    const walk = (nodes: SideNavigationItems): boolean => {
      let subtreeActive = false;
      for (const node of nodes) {
        const childActive = node.items?.length ? walk(node.items) : false;
        if (node.active || childActive) {
          subtreeActive = true;
          if (node.items?.length) set.add(node);
        }
      }
      return subtreeActive;
    };
    walk(items);
    return set;
  }

  #collectDescendantItems(item: SideNavigationItem): SideNavigationItem[] {
    const items: SideNavigationItem[] = [];
    const walk = (n: SideNavigationItem) => {
      if (!n.items?.length) return;
      for (const child of n.items) {
        items.push(child);
        walk(child);
      }
    };
    walk(item);
    return items;
  }

  #toggle(item: SideNavigationItem) {
    const next = new Set(this.expandedItems);
    if (next.has(item)) {
      // If the item is expanded: Collapse
      next.delete(item);
      // And collapse nested items as well
      for (const h of this.#collectDescendantItems(item)) next.delete(h);
    } else {
      // Expand the item
      next.add(item);
    }
    this.expandedItems = next;
    this.requestUpdate();
  }

  #renderItem(item: SideNavigationItem): TemplateResult {
    const hasSubItems = (item.items?.length ?? 0) > 0;
    const isOpen = this.expandedItems.has(item);

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
                    aria-expanded=${isOpen ? 'true' : 'false'}
                    class="denhaag-icon-button denhaag-side-navigation__expand-button"
                    @click=${() => this.#toggle(item)}
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
