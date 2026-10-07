import { safeCustomElement } from '@src/lib/decorators';
import { isSlotEmpty } from '@src/lib/slot';
import { LitElement, html } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './styles';
import { Purpose, Size } from './types';

const tag = 'clippy-layout';

declare global {
  interface HTMLElementTagNameMap {
    [tag]: ClippyLayout;
  }
}

/**
 * Clippy Layout Component
 * @slot - Main content
 * @slot sidebar - Sidebar content, for side navigation
 * @slot breadcrumb - Area for the page breadcrumb
 *
 * @cssprop --clippy-layout-content-max-inline-size - Max inline size of the content area, defaults the page-layout inline size
 * @cssprop --clippy-layout-content-sm-max-inline-size - Max inline size of the content area with size="sm"
 * @cssprop --clippy-layout-content-md-max-inline-size - Max inline size of the content area with size="md"
 * @cssprop --clippy-layout-content-padding-inline-start - Inline start padding of the content element
 * @cssprop --clippy-layout-content-padding-inline-end - Inline end padding of the content element
 * @cssprop --clippy-layout-content-padding-block-start - block start padding of the content element
 * @cssprop --clippy-layout-content-padding-block-end - block end padding of the content element
 * @cssprop --clippy-layout-column-gap - Column gap of the grid
 * @cssprop --clippy-layout-row-gap - Row gap of the grid
 * @cssprop --clippy-layout-sidebar-inline-size - Inline size of the sidebar and the aside
 */
@safeCustomElement(tag)
export class ClippyLayout extends LitElement {
  static override readonly styles = [styles];

  @property({ reflect: true, type: String })
  size: Size = 'md';

  @property({ reflect: true, type: String })
  purpose: Purpose = 'default';

  #hasSidebarContent = false;
  #hasBreadcrumbContent = false;

  #handleSlotChange(event: Event) {
    const slot = event.target as HTMLSlotElement;
    const slotName = slot.name || '';
    const hasContent = !isSlotEmpty(slot);

    if (slotName === 'sidebar') {
      this.#hasSidebarContent = hasContent;
    } else if (slotName === 'breadcrumb') {
      this.#hasBreadcrumbContent = hasContent;
    }
    this.requestUpdate();
  }

  #hasAssignedNodes(slotName: 'sidebar' | 'breadcrumb'): boolean {
    const slot = this.shadowRoot?.querySelector<HTMLSlotElement>(`slot[name="${slotName}"]`);
    if (!slot) {
      return false;
    }
    return !isSlotEmpty(slot);
  }

  protected override firstUpdated() {
    this.#hasSidebarContent = this.#hasAssignedNodes('sidebar');
    this.#hasBreadcrumbContent = this.#hasAssignedNodes('breadcrumb');
  }

  override render() {
    return html`
      <div class="clippy-layout__content">
        <div class="clippy-layout__grid">
          <div class="clippy-layout__sidebar" ?hidden=${!this.#hasSidebarContent}>
            <slot name="sidebar" @slotchange=${this.#handleSlotChange}></slot>
          </div>

          <div class="clippy-layout__breadcrumb" ?hidden=${!this.#hasBreadcrumbContent}>
            <slot name="breadcrumb" @slotchange=${this.#handleSlotChange}></slot>
          </div>

          <div class="clippy-layout__wrap-main">
            <slot></slot>
          </div>
        </div>
      </div>
    `;
  }
}
