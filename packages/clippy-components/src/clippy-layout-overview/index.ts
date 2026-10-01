import { safeCustomElement } from '@src/lib/decorators';
import { isSlotEmpty } from '@src/lib/slot';
import { LitElement, html } from 'lit';
import styles from './styles';

const tag = 'clippy-layout-overview';

declare global {
  interface HTMLElementTagNameMap {
    [tag]: ClippyLayoutOverview;
  }
}

/**
 * Clippy Layout Single Column Component
 * @slot - Main content
 * @slot sidebar - Sidebar content, for side navigation
 * @slot breadcrumb - Area for the page breadcrumb
 *
 * @cssprop --clippy-layout-content-max-inline-size - Max inline size of the content area, defaults the page-layout inline size
 * @cssprop --clippy-layout-content-padding-inline-start - Inline start padding of the content element
 * @cssprop --clippy-layout-content-padding-inline-end - Inline end padding of the content element
 * @cssprop --clippy-layout-content-padding-block-start - block start padding of the content element
 * @cssprop --clippy-layout-content-padding-block-end - block end padding of the content element
 * @cssprop --clippy-layout-column-gap - Column gap of the grid
 * @cssprop --clippy-layout-sidebar-inline-size - Inline size of the sidebar and the aside
 */
@safeCustomElement(tag)
export class ClippyLayoutOverview extends LitElement {
  static override readonly styles = [styles];

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

  #hasAssignedNodes(slotName: string): boolean {
    const slot = this.shadowRoot?.querySelector<HTMLSlotElement>(
      slotName === '' ? 'slot:not([name])' : `slot[name="${slotName}"]`,
    );
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
