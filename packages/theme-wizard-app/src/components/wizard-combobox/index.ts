import comboboxStyles from '@utrecht/combobox-css?inline';
import listboxStyles from '@utrecht/listbox-css?inline';
import textboxStyles from '@utrecht/textbox-css?inline';
import { html, LitElement, unsafeCSS } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

type Option = {
  label: string;
  value: string | Array<string>;
};

type Position = 'block-start' | 'block-end';

const tag = 'wizard-combobox';

declare global {
  interface HTMLElementTagNameMap {
    [tag]: WizardCombobox;
  }
}

@customElement(tag)
export class WizardCombobox extends LitElement {
  @property() name = '';
  @property({ type: Boolean }) disabled = false;
  @property({ type: Boolean }) readonly = false;
  @property({ type: Boolean }) private open = false;
  @property({ type: Array }) private readonly options: Option[] = [];
  @property() readonly position: Position = 'block-end';
  internals_ = this.attachInternals();

  #value: unknown;

  static readonly formAssociated = true;
  static override readonly styles = [unsafeCSS(comboboxStyles), unsafeCSS(listboxStyles), unsafeCSS(textboxStyles)];

  @state() query = ''; // Query is what the user types to filter options.
  @state() get filteredOptions(): Option[] {
    if (this.query.length === 0) {
      return this.options;
    }
    return this.options.filter(this.filter);
  }

  @property({ attribute: false })
  set value(value: unknown) {
    this.#value = value;
    this.internals_.setFormValue(`${value}`);
  }

  get value() {
    return this.#value;
  }

  /**
   * Override this function to customize how options are filtered when typing
   */
  readonly filter = (option: Option) => {
    const label = `${option.label}`; // Use as string
    return label.toLowerCase().includes(this.query.toLowerCase());
  };

  readonly #handleBlur = () => {
    this.open = false;
  };

  readonly #handleFocus = () => {
    this.open = true;
  };

  readonly #handleInput = (event: InputEvent) => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement)) return;
    this.open = true;
    this.query = target.value;
  };

  readonly #handleOptionsClick = (event: Event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;

    const index = Number(target.dataset['index']);
    if (Number.isNaN(index)) return;

    const { value, label } = this.filteredOptions.at(index) || {};
    if (!label) return;

    this.query = label.toString();

    if (this.value !== value) {
      this.value = value;
    }
    this.open = false;
  };

  /**
   * Override this function to customize the rendering of combobox options and selected value.
   */
  renderEntry(option: Option, _index: number) {
    return html`${option?.label}`;
  }

  override render() {
    const popoverClasses = {
      'utrecht-combobox__popover--hidden': !this.open,
      [`utrecht-combobox__popover--${this.position}`]: this.position,
    };

    return html`
      <div class="utrecht-combobox" role="combobox">
        <input
          name=${this.name}
          autocomplete="off"
          aria-autocomplete="list"
          aria-haspopup="listbox"
          type="text"
          class="utrecht-textbox utrecht-combobox__input"
          dir="auto"
          .value=${this.query}
          @input=${this.#handleInput}
          @focus=${this.#handleFocus}
          @blur=${this.#handleBlur}
        />
        <div class="utrecht-listbox utrecht-combobox__popover ${classMap(popoverClasses)}" role="listbox" tabindex="-1">
          <ul class="utrecht-listbox__list" role="none" @mousedown=${this.#handleOptionsClick}>
            ${this.filteredOptions.map((option, index) => {
              return html`<li
                class="utrecht-listbox__option utrecht-listbox__option--html-li"
                role="option"
                data-index=${index}
              >
                ${this.renderEntry(option, index)}
              </li>`;
            })}
          </ul>
        </div>
      </div>
    `;
  }
}
