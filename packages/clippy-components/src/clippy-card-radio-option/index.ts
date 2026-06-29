import { safeCustomElement } from '@lib/decorators';
import { LitElement, html } from 'lit';
import { property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import srOnly from '../lib/sr-only';
import { radioStyles } from './styles';

export const radioTag = 'clippy-card-radio-option';

declare global {
  interface HTMLElementTagNameMap {
    [radioTag]: ClippyCardRadioOption;
  }
}

/**
 * Radio option styled as a card. The `<input type="radio">` is sr-only; the card is the
 * visual surface. `delegatesFocus: true` forwards host focus to the hidden input.
 *
 * `inputTabIndex` is controlled by the parent `ClippyCardRadioGroup` for roving tabindex.
 * `focusInput()` lets the parent move focus programmatically during arrow-key navigation.
 *
 * Slots: default (label), `start` (leading icon), `description` (aria-describedby), `body`, `footer`.
 */
@safeCustomElement(radioTag)
export class ClippyCardRadioOption extends LitElement {
  static override readonly styles = [srOnly, radioStyles];
  static override readonly shadowRootOptions = { ...LitElement.shadowRootOptions, delegatesFocus: true };

  @property({ type: String }) value = '';
  @property({ type: String }) name = '';
  @property({ reflect: true, type: Boolean }) checked = false;
  @property({ attribute: false, type: Number }) inputTabIndex = -1;
  @state() private hasStart = false;
  @state() private hasBody = false;
  @state() private hasFooter = false;

  readonly #inputId = crypto.randomUUID();

  #handleChange() {
    this.checked = true;
    this.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
  }

  readonly #onStartSlotChange = (event: Event) => {
    const slot = event.target as HTMLSlotElement;
    this.hasStart = slot.assignedNodes({ flatten: true }).length > 0;
  };

  readonly #onBodySlotChange = (event: Event) => {
    const slot = event.target as HTMLSlotElement;
    this.hasBody = slot.assignedNodes({ flatten: true }).length > 0;
  };

  readonly #onFooterSlotChange = (event: Event) => {
    const slot = event.target as HTMLSlotElement;
    this.hasFooter = slot.assignedNodes({ flatten: true }).length > 0;
  };

  focusInput() {
    const input = this.shadowRoot?.querySelector('input');
    if (!input) {
      return;
    }
    input.focus();
  }

  override render() {
    const startSlot = html`<slot name="start" @slotchange=${this.#onStartSlotChange}></slot>`;
    const descriptionId = `${this.#inputId}-description`;

    return html`
      <input
        class="sr-only"
        id=${this.#inputId}
        type="radio"
        name=${this.name}
        value=${this.value}
        tabindex=${this.inputTabIndex}
        .checked=${this.checked}
        @change=${this.#handleChange}
        aria-describedby=${descriptionId}
      />
      <div
        class="clippy-card-radio-option__header ${classMap({
          'clippy-card-radio-option__header--with-start': this.hasStart,
        })}"
      >
        ${this.hasStart ? html`<span class="clippy-card-radio-option__start">${startSlot}</span>` : startSlot}
        <label class="clippy-card-radio-option__label" for=${this.#inputId}>
          <slot></slot>
        </label>
        <div class="clippy-card-radio-option__description" id=${descriptionId}>
          <slot name="description"></slot>
        </div>
      </div>
      ${this.hasBody
        ? html`<div class="clippy-radio-card__body">
            <slot name="body" @slotchange=${this.#onBodySlotChange}></slot>
          </div>`
        : html`<slot name="body" @slotchange=${this.#onBodySlotChange}></slot>`}
      ${this.hasFooter
        ? html`<div class="clippy-radio-card__footer">
            <slot name="footer" @slotchange=${this.#onFooterSlotChange}></slot>
          </div>`
        : html`<slot name="footer" @slotchange=${this.#onFooterSlotChange}></slot>`}
    `;
  }
}
