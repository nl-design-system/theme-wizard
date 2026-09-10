import { safeCustomElement } from '@lib/decorators';
import { html } from 'lit';
import { ClippyCardRadioOption, radioTag } from '../clippy-card-radio-option/index';
import { FormElement } from '../lib/FormElement';
import { groupStyles } from './styles';

const groupTag = 'clippy-card-radio-group';

declare global {
  interface HTMLElementTagNameMap {
    [groupTag]: ClippyCardRadioGroup;
  }
}

/**
 * Form-associated radiogroup wrapping `<clippy-card-radio-option>` children. Extends
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
export class ClippyCardRadioGroup extends FormElement<string> {
  static override readonly styles = [groupStyles];

  readonly #handleChange = (event: Event) => {
    const target = event.target;
    if (!(target instanceof ClippyCardRadioOption)) {
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

    // Prevent page scroll by pressing an arrow key
    event.preventDefault();

    this.#selectCard(nextCard);
    nextCard.focusInput();
  };

  /** When the name of this element changes, we need to update the options */
  #syncName() {
    for (const card of this.#cards) {
      card.name = this.name;
    }
  }

  /** Roving tabindex: one card in the tab sequence (checked, or first as fallback) — all others at -1. */
  #syncTabIndex() {
    const cards = this.#cards;
    const active = cards.find((card) => card.checked) ?? cards[0];
    for (const card of cards) {
      card.inputTabIndex = card === active ? 0 : -1;
    }
  }

  #selectCard(selected: ClippyCardRadioOption) {
    for (const card of this.#cards) {
      card.checked = card === selected;
    }
    this.value = selected.value;
    this.#syncTabIndex();
  }

  get #cards(): ClippyCardRadioOption[] {
    return Array.from(this.querySelectorAll<ClippyCardRadioOption>(radioTag));
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
