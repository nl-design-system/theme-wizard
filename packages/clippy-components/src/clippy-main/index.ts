import { safeCustomElement } from '@src/lib/decorators';
import { LitElement, html } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './styles';
import { Variant } from './types';

const tag = 'clippy-main';

declare global {
  interface HTMLElementTagNameMap {
    [tag]: ClippyMain;
  }
}

/**
 * Clippy Layout Main Component
 * @slot - Default body content
 * @slot aside - Complementary content, eg. anchor-navigation, authors, etc.
 * @slot header - Header content, eg titles, hero images, etc.
 *
 * @cssprop --clippy-main-row-gap - The gap between the header, aside and the body
 */
@safeCustomElement(tag)
export class ClippyMain extends LitElement {
  static override readonly styles = [styles];

  @property({ reflect: true, type: String })
  public variant: Variant = 'default';

  override render() {
    return html`
      <main>
        <div class="clippy-main__header" ?hidden=${!this.#hasHeaderContent}>
          <slot name="header" @slotchange=${this.#handleSlotChange}></slot>
        </div>
        <aside class="clippy-main__aside" ?hidden=${!this.#hasAsideContent}>
          <slot name="aside" @slotchange=${this.#handleSlotChange}></slot>
        </aside>
        <div class="clippy-main__body" ?hidden=${!this.#hasBodyContent}>
          <slot @slotchange=${this.#handleSlotChange}></slot>
        </div>
      </main>
    `;
  }

  #hasHeaderContent = false;
  #hasAsideContent = false;
  #hasBodyContent = false;

  override firstUpdated() {
    // Initialize slot content states after first render
    this.#updateSlotStates();
  }

  #updateSlotStates() {
    const headerSlot = this.renderRoot?.querySelector<HTMLSlotElement>('slot[name="header"]');
    const asideSlot = this.renderRoot?.querySelector<HTMLSlotElement>('slot[name="aside"]');
    const bodySlot = this.renderRoot?.querySelector<HTMLSlotElement>('slot:not([name])');

    this.#hasHeaderContent = (headerSlot?.assignedElements().length ?? 0) > 0;
    this.#hasAsideContent = (asideSlot?.assignedElements().length ?? 0) > 0;
    this.#hasBodyContent = (bodySlot?.assignedElements().length ?? 0) > 0;
    this.requestUpdate();
  }

  #handleSlotChange(event: Event) {
    const slot = event.target as HTMLSlotElement;
    const slotName = slot.name || '';
    const hasContent = slot.assignedElements().length > 0;

    if (slotName === 'header') {
      this.#hasHeaderContent = hasContent;
    } else if (slotName === 'aside') {
      this.#hasAsideContent = hasContent;
    } else {
      this.#hasBodyContent = hasContent;
    }
    this.requestUpdate();
  }
}
