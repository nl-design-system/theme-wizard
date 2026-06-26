import { safeCustomElement } from '@lib/decorators';
import { LitElement, html } from 'lit';
import { property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { FormElement } from '../lib/FormElement';
import srOnly from '../lib/sr-only';
import { groupStyles, radioStyles } from './styles';

const radioTag = 'clippy-card-radio';
const groupTag = 'clippy-card-as-form-field';

declare global {
  interface HTMLElementTagNameMap {
    [radioTag]: ClippyCardRadio;
    [groupTag]: ClippyCardAsFormField;
  }
}

/**
 * Radio option styled as a card. The `<input type="radio">` is sr-only; the card is the
 * visual surface. `delegatesFocus: true` forwards host focus to the hidden input.
 *
 * `focus-visible` is mirrored as a host attribute when the inner input matches
 * `:focus-visible`, so card styles can react to keyboard focus without piercing shadow DOM.
 *
 * `inputTabIndex` is controlled by the parent `ClippyCardAsFormField` for roving tabindex.
 * `focusInput()` lets the parent move focus programmatically during arrow-key navigation
 * and forces `focus-visible` on.
 *
 * Slots: default (label), `start` (leading icon), `description` (aria-describedby), `body`, `footer`.
 */
@safeCustomElement(radioTag)
export class ClippyCardRadio extends LitElement {
  static override readonly styles = [srOnly, radioStyles];
  static override readonly shadowRootOptions = { ...LitElement.shadowRootOptions, delegatesFocus: true };

  @property({ type: String }) value = '';
  @property({ type: String }) name = '';
  @property({ reflect: true, type: Boolean }) checked = false;
  @property({ attribute: false, type: Number }) inputTabIndex = -1;
  @state() private hasStart = false;

  readonly #inputId = crypto.randomUUID();

  #handleChange() {
    this.checked = true;
    this.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
  }

  readonly #onStartSlotChange = (event: Event) => {
    const slot = event.target as HTMLSlotElement;
    this.hasStart = slot.assignedNodes({ flatten: true }).length > 0;
  };

  readonly #handleInputFocus = (event: FocusEvent) => {
    this.toggleAttribute('focus-visible', (event.target as HTMLElement).matches(':focus-visible'));
  };

  readonly #handleInputBlur = () => {
    this.toggleAttribute('focus-visible', false);
  };

  override firstUpdated() {
    const input = this.shadowRoot?.querySelector('input');
    input?.addEventListener('focus', this.#handleInputFocus);
    input?.addEventListener('blur', this.#handleInputBlur);
  }

  focusInput() {
    const input = this.shadowRoot?.querySelector('input');
    if (!input) {
      return;
    }
    input.focus({ focusVisible: true });
    // focusInput() is always called from keyboard navigation, so focus-visible is always correct
    this.toggleAttribute('focus-visible', true);
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
      <div class="clippy-card-radio__header ${classMap({ 'clippy-card-radio__header--with-start': this.hasStart })}">
        ${this.hasStart ? html`<span class="clippy-card-radio__start">${startSlot}</span>` : startSlot}
        <label class="clippy-card-radio__label" for=${this.#inputId}>
          <slot></slot>
        </label>
        <div class="clippy-card-radio__description" id=${descriptionId}>
          <slot name="description"></slot>
        </div>
      </div>
      <div class="clippy-radio-card__body">
        <slot name="body"></slot>
      </div>
      <div class="clippy-radio-card__footer">
        <slot name="footer"></slot>
      </div>
    `;
  }
}

/**
 * Form-associated radiogroup wrapping `<clippy-card-radio>` children. Extends
 * `FormElement<string>` for native form participation. Sets `internals_.role =
 * 'radiogroup'` in `connectedCallback` so the role exists before first render.
 *
 * **Tab roving:** `#syncTabIndex()` gives `tabindex="0"` to the checked card (or first
 * card if none checked) and `-1` to all others — Tab enters/exits the group in one step.
 *
 * **Keyboard navigation:** Arrow keys move selection and focus, wrapping at both ends.
 * `:focus-within` locates the active card; wrapping modulo picks the next; `#selectCard()`
 * + `focusInput()` commit the move. `preventDefault()` suppresses page scroll.
 *
 * **Name propagation:** `name` changes are pushed to all child radios via `#syncName()`
 * so inputs share a group name for form submission and native mutual-exclusion.
 *
 * **Value sync:** Programmatic `value` changes in `updated()` find and select the
 * matching card to keep checked state and tabindex consistent.
 */
@safeCustomElement(groupTag)
export class ClippyCardAsFormField extends FormElement<string> {
  static override readonly styles = [groupStyles];

  readonly #handleChange = (event: Event) => {
    const target = event.target;
    if (!(target instanceof ClippyCardRadio)) {
      return;
    }
    this.#selectCard(target);
  };

  readonly #handleKeyDown = (event: KeyboardEvent) => {
    const { key } = event;
    if (key !== 'ArrowDown' && key !== 'ArrowUp' && key !== 'ArrowLeft' && key !== 'ArrowRight') {
      return;
    }
    const cards = this.#cards;
    const currentIndex = cards.findIndex((card) => card.matches(':focus-within'));
    if (currentIndex === -1) {
      return;
    }
    const delta = key === 'ArrowDown' || key === 'ArrowRight' ? 1 : -1;
    const nextCard = cards.at((currentIndex + delta + cards.length) % cards.length);
    if (!nextCard) {
      return;
    }
    event.preventDefault();
    this.#selectCard(nextCard);
    nextCard.focusInput();
  };

  #syncName() {
    for (const card of this.#cards) {
      card.name = this.name;
    }
  }

  #syncTabIndex() {
    const cards = this.#cards;
    const active = cards.find((card) => card.checked) ?? cards[0];
    for (const card of cards) {
      card.inputTabIndex = card === active ? 0 : -1;
    }
  }

  #selectCard(selected: ClippyCardRadio) {
    for (const card of this.#cards) {
      card.checked = card === selected;
    }
    this.value = selected.value;
    this.#syncTabIndex();
  }

  get #cards(): ClippyCardRadio[] {
    return Array.from(this.querySelectorAll<ClippyCardRadio>(radioTag));
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.internals_.role = 'radiogroup';
    this.addEventListener('change', this.#handleChange);
    this.addEventListener('keydown', this.#handleKeyDown);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener('change', this.#handleChange);
    this.removeEventListener('keydown', this.#handleKeyDown);
  }

  protected override updated(changed: Map<string, unknown>): void {
    if (changed.has('name')) {
      this.#syncName();
    }
    if (changed.has('value')) {
      const match = this.#cards.find((card) => card.value === this.value);
      if (match) {
        this.#selectCard(match);
      }
    }
    this.#syncTabIndex();
  }

  readonly #onSlotChange = () => {
    this.#syncName();
    this.#syncTabIndex();
  };

  override render() {
    return html`<slot @slotchange=${this.#onSlotChange}></slot>`;
  }
}
