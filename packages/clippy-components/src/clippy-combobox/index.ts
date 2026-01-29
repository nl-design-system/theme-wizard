import { safeCustomElement } from '@lib/decorators';
import comboboxStyles from '@utrecht/combobox-css?inline';
import listboxStyles from '@utrecht/listbox-css?inline';
import textboxStyles from '@utrecht/textbox-css?inline';
import { html, nothing, unsafeCSS } from 'lit';
import { property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import memoize from 'memoize';
import { arrayFromTokenList } from '../lib/converters';
import { FormElement } from '../lib/FormElement';
import srOnly from '../lib/sr-only/styles';

type Option = {
  label: string;
  value: unknown;
};

type Position = 'block-start' | 'block-end';

const tag = 'clippy-combobox';

declare global {
  interface HTMLElementTagNameMap {
    [tag]: ClippyCombobox;
  }
}

@safeCustomElement(tag)
export class ClippyCombobox<T extends Option = Option> extends FormElement<T['value']> {
  @property({ reflect: true, type: Boolean }) open = false;
  @property() readonly position: Position = 'block-end';

  get #id() {
    return `${tag}-${this.name}`;
  }

  #options: Map<T['label'], T> = new Map();

  static override readonly styles = [
    srOnly,
    unsafeCSS(comboboxStyles),
    unsafeCSS(listboxStyles),
    unsafeCSS(textboxStyles),
  ];

  @state() selectedIndex = -1;
  @state() query = ''; // Query is what the user types to filter options.
  @state() get filteredOptions(): T[] {
    if (this.query.length === 0) {
      return this.options;
    }
    const options = this.options.filter(this.filter);
    if (options.length === 0) {
      this.#addAdditionalOptions(this.query);
    }
    return options;
  }

  @property({ converter: arrayFromTokenList })
  set options(options: T[] | string[]) {
    this.#options = new Map(
      options.map((option) =>
        typeof option === 'string'
          ? [option, { label: option, value: option } as T] // Note this means that subclassing with a different T means overriding this function as well
          : [option.label, option],
      ),
    );
  }

  get options(): T[] {
    return [...this.#options.values()];
  }

  @property()
  override set value(value: T['value'] | null) {
    super.value = value;
    this.query = this.valueToQuery(value);
  }

  override get value(): T['value'] | null {
    return super.value;
  }

  emit(type: 'blur' | 'change' | 'focus' | 'input') {
    this.dispatchEvent(new Event(type, { bubbles: true, composed: true }));
  }

  /**
   * Override this function to customize how options are filtered when typing
   */
  readonly filter = ({ label }: T) => {
    return label.toLowerCase().includes(this.query.toLowerCase());
  };

  /**
   * Override this function to customize an external data source
   */
  fetchAdditionalOptions(_query: string) {
    const empty: T[] = [];
    return Promise.resolve(empty);
  }

  /**
   * Override this function to customize how the user input is resolved to a value.
   * This runs on input.
   */
  queryToValue(query: string): T['value'] {
    return query;
  }

  /**
   * Override this function to customize how a value is converted to a query.
   * This runs on setting the value.
   */
  valueToQuery(value: T['value'] | null): string {
    return (value ?? '').toString();
  }

  readonly #addAdditionalOptions = memoize(async (query: string) => {
    const additions = await this.fetchAdditionalOptions(query);
    for (const addition of additions) {
      this.#options.set(addition.label, addition);
    }
  });

  readonly #handleBlur = (event: FocusEvent) => {
    if (event.relatedTarget && !this.shadowRoot?.contains(event.relatedTarget as Node)) {
      // Only when the focus moves outside of the component, treat it as a blur for outside
      this.open = false;
      this.emit('blur');
    }
  };

  readonly #handleChange = () => {
    this.emit('change');
  };

  readonly #handleDocumentClick = (event: MouseEvent) => {
    const path = event.composedPath();
    if (!path.some((element) => element instanceof Node && this.contains(element))) {
      // When a click happens outside of this web-component, treat it as a blur.
      this.open = false;
      this.emit('blur');
    }
  };

  readonly #handleFocus = () => {
    this.open = true;
    this.emit('focus');
  };

  readonly #handleInput = (event: InputEvent) => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement)) return;
    this.selectedIndex = -1;
    this.open = true;
    this.query = target.value;
    this.value = this.queryToValue(this.query);
    this.emit('input');
  };

  readonly #handleOptionsClick = (event: Event) => {
    const target = event.currentTarget;
    if (!(target instanceof HTMLElement)) return;

    const index = Number(target.dataset['index']);
    if (Number.isNaN(index)) return;
    this.#commitSelection(index);
  };

  readonly #handleKeydown = ({ key }: KeyboardEvent) => {
    const index = this.selectedIndex;
    const count = this.filteredOptions.length;
    switch (key) {
      case 'ArrowDown':
        return this.#setSelection(index + 1, true);
      case 'ArrowUp':
        return this.#setSelection(index - 1, true);
      case 'Enter':
        return this.#commitSelection(index);
      case 'Escape':
        return this.#setSelection(-1);
      case 'Home':
        return this.#setSelection(0);
      case 'End':
        return this.#setSelection(count - 1);
      default:
        return undefined;
    }
  };

  #setSelection(index: number, open: boolean = false) {
    this.open = open;
    this.selectedIndex = index > -1 ? index % this.filteredOptions.length : -1;
    if (this.selectedIndex > -1) {
      const element = this.shadowRoot?.querySelector(`#${String(this.#getOptionId())}`);
      element?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'nearest',
      });
    }
  }

  #commitSelection(index: number) {
    const { label, value } = this.filteredOptions.at(index) ?? {};
    if (index < 0 || !label || !value) return;

    this.query = label.toString();

    if (this.value !== value) {
      this.value = value;
      this.#handleChange();
    }
    this.open = false;
  }

  get #listId() {
    return `list-${this.#id}`;
  }

  #getOptionId(index: number = this.selectedIndex) {
    return index !== -1 ? `option-${index}-${this.#id}` : nothing;
  }

  /**
   * Override this function to customize the rendering of combobox options and selected value.
   */
  renderEntry({ label }: Option, _index: number) {
    return html`${label}`;
  }

  override connectedCallback() {
    super.connectedCallback();
    document.addEventListener('click', this.#handleDocumentClick);
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener('click', this.#handleDocumentClick);
  }

  override render() {
    const popoverClasses = {
      [`utrecht-combobox__popover--${this.position}`]: this.position,
      'utrecht-combobox__popover--hidden': !this.open,
    };
    return html`
      <div class="utrecht-combobox">
        <label for="${this.#id}" class="sr-only">${this.hiddenLabel}</label>
        <input
          id=${this.#id}
          name=${this.name}
          autocomplete="off"
          role="combobox"
          aria-autocomplete="list"
          aria-haspopup="listbox"
          aria-controls=${this.#listId}
          aria-expanded=${this.open}
          aria-activedescendant=${this.#getOptionId()}
          type="text"
          class="utrecht-textbox utrecht-combobox__input"
          dir="auto"
          .value=${this.query}
          @input=${this.#handleInput}
          @focus=${this.#handleFocus}
          @blur=${this.#handleBlur}
          @change=${this.#handleChange}
          @keydown=${this.#handleKeydown}
        />
        <div
          id=${this.#listId}
          class="utrecht-listbox utrecht-combobox__popover ${classMap(popoverClasses)}"
          role="listbox"
          tabindex="-1"
        >
          <ul class="utrecht-listbox__list" role="none">
            ${this.filteredOptions.map((option, index) => {
              const selected = index === this.selectedIndex;
              const selectedClass = {
                'utrecht-listbox__option--selected': selected,
              };
              return html`<li
                class="utrecht-listbox__option utrecht-listbox__option--html-li ${classMap(selectedClass)}"
                role="option"
                id=${this.#getOptionId(index)}
                aria-selected=${selected}
                data-index=${index}
                @click=${this.#handleOptionsClick}
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
