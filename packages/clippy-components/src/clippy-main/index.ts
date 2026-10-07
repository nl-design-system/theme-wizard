import { safeCustomElement } from '@src/lib/decorators';
import { isSlotEmpty } from '@src/lib/slot';
import { LitElement, html } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './styles';
import { Purpose } from './types';

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
  public purpose: Purpose = 'default';

  #hasHeaderContent = false;
  #hasAsideContent = false;
  #hasBodyContent = false;

  #handleSlotChange(event: Event) {
    const slot = event.target as HTMLSlotElement;
    const slotName = slot.name || '';
    const hasContent = !isSlotEmpty(slot);

    if (slotName === 'header') {
      this.#hasHeaderContent = hasContent;
    } else if (slotName === 'aside') {
      this.#hasAsideContent = hasContent;
    } else {
      this.#hasBodyContent = hasContent;
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
    this.#hasHeaderContent = this.#hasAssignedNodes('header');
    this.#hasAsideContent = this.#hasAssignedNodes('aside');
    this.#hasBodyContent = this.#hasAssignedNodes('');
  }

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
}
