import { safeCustomElement } from '@lib/decorators';
import { ClippyCard } from '@src/clippy-card';
import { LitElement, html } from 'lit';
import { property, query } from 'lit/decorators.js';
import srOnly from '../lib/sr-only';
import { radioStyles } from './styles';

export const radioTag = 'clippy-card-radio-option';

declare global {
  interface HTMLElementTagNameMap {
    [radioTag]: ClippyCardRadioOption;
  }
}

/**
 * Radio option styled as a card. Extends `clippy-card` for its card chrome (background, border,
 * design-token surface) and its `body`/`footer` regions; the `<input type="radio">` is sr-only,
 * the card is the visual surface. `delegatesFocus: true` forwards host focus to the hidden input.
 *
 * `inputTabIndex` is controlled by the parent `ClippyCardRadioGroup` for roving tabindex.
 * `focusInput()` lets the parent move focus programmatically during arrow-key navigation.
 *
 * Slots: default (label), `start` (leading icon), `description` (aria-describedby), `body`, `footer`.
 */
@safeCustomElement(radioTag)
export class ClippyCardRadioOption extends ClippyCard {
  static override readonly styles = [srOnly, ...ClippyCard.styles, radioStyles];
  static override readonly shadowRootOptions = { ...LitElement.shadowRootOptions, delegatesFocus: true };

  @property({ type: String }) value = '';
  @property({ type: String }) name = '';
  @property({ reflect: true, type: Boolean }) checked = false;
  @property({ attribute: false, type: Number }) inputTabIndex = -1;
  @query('input') input!: HTMLInputElement;

  readonly #inputId = crypto.randomUUID();

  #handleChange() {
    this.checked = true;
    this.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
  }

  protected override firstUpdated() {
    this.hasBody = this.hasAssignedNodes('body');
    this.hasFooter = this.hasAssignedNodes('footer');
  }

  focusInput() {
    this.input.focus();
  }

  override render() {
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
      <div class="clippy-card-radio-option__header">
        <slot name="start" class="clippy-card-radio-option__start"></slot>
        <div class="clippy-card-radio-option__header-body">
          <label class="clippy-card-radio-option__label" for=${this.#inputId}>
            <slot></slot>
          </label>
          <div class="clippy-card-radio-option__description" id=${descriptionId}>
            <slot name="description"></slot>
          </div>
        </div>
      </div>
      ${this.renderBody()}${this.renderFooter()}
    `;
  }
}
