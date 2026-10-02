import { safeCustomElement } from '@src/lib/decorators';
import { isSlotEmpty } from '@src/lib/slot';
import { LitElement, html } from 'lit';
import styles from './styles';

const tag = 'clippy-layout-default';

declare global {
  interface HTMLElementTagNameMap {
    [tag]: ClippyLayoutDefault;
  }
}

/**
 * Clippy Layout Focus Component
 * @slot - Main content
 * @slot breadcrumb - Area for the page breadcrumb
 *
 * @cssprop --clippy-layout-default-content-max-inline-size - Max inline size of the content area, defaults the page-layout inline size
 * @cssprop --clippy-layout-default-content-padding-inline-start - Inline start padding of the content element
 * @cssprop --clippy-layout-default-content-padding-inline-end - Inline end padding of the content element
 * @cssprop --clippy-layout-default-content-padding-block-start - block start padding of the content element
 * @cssprop --clippy-layout-default-content-padding-block-end - block end padding of the content element
 */
@safeCustomElement(tag)
export class ClippyLayoutDefault extends LitElement {
  static override readonly styles = [styles];

  #hasBreadcrumbContent = false;

  #handleSlotChange(event: Event) {
    const slot = event.target as HTMLSlotElement;
    const slotName = slot.name || '';
    const hasContent = !isSlotEmpty(slot);

    if (slotName === 'breadcrumb') {
      this.#hasBreadcrumbContent = hasContent;
    }
    this.requestUpdate();
  }

  #hasAssignedNodes(slotName: 'breadcrumb'): boolean {
    const slot = this.shadowRoot?.querySelector<HTMLSlotElement>(`slot[name="${slotName}"]`);
    if (!slot) {
      return false;
    }
    return !isSlotEmpty(slot);
  }

  protected override firstUpdated() {
    this.#hasBreadcrumbContent = this.#hasAssignedNodes('breadcrumb');
  }

  override render() {
    return html`
      <div class="clippy-layout-default__content">
        <div class="clippy-layout-default__breadcrumb" ?hidden=${!this.#hasBreadcrumbContent}>
          <slot name="breadcrumb" @slotchange=${this.#handleSlotChange}></slot>
        </div>

        <div class="clippy-layout-default__wrap-main">
          <slot></slot>
        </div>
      </div>
    `;
  }
}
