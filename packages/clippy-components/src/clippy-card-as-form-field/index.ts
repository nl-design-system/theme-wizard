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

@safeCustomElement(radioTag)
export class ClippyCardRadio extends LitElement {
  static override readonly styles = [srOnly, radioStyles];

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

  focusInput() {
    this.shadowRoot?.querySelector('input')?.focus({ focusVisible: true });
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
      <div class="clippy-card-radio__header ${classMap({ 'clippy-card-radio__header-with-start': this.hasStart })}">
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

  override render() {
    return html`<slot></slot>`;
  }
}
