import { safeCustomElement } from '@lib/decorators';
import comboboxStyles from '@utrecht/combobox-css?inline';
import listboxStyles from '@utrecht/listbox-css?inline';
import textboxStyles from '@utrecht/textbox-css?inline';
import debounce from 'debounce';
import { dequal } from 'dequal';
import { html, nothing, PropertyValues, unsafeCSS } from 'lit';
import { property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import memoize from 'memoize';
import { allowedValuesConverter, arrayFromTokenList } from '../lib/converters';
import { FormElement } from '../lib/FormElement';
import srOnly from '../lib/sr-only/styles';
import styles from './styles';

type Option = {
  label: string;
  description?: string;
  value: unknown;
};

const allowances = ['options', 'other'] as const;
const defaultAllowance = 'options';
type Allowance = (typeof allowances)[number];

const positions = ['block-start', 'block-end'] as const;
const defaultPosition = 'block-end';
type Position = (typeof positions)[number];

const tag = 'clippy-combobox' as const;

declare global {
  interface HTMLElementTagNameMap {
    [tag]: ClippyCombobox;
  }
}

@safeCustomElement(tag)
export class ClippyCombobox<T extends Option = Option> extends FormElement<T['value']> {
  static readonly allowances = allowances;
  static readonly positions = positions;
  @property({ converter: allowedValuesConverter(ClippyCombobox.allowances, defaultAllowance) })
  allow: Allowance = defaultAllowance;
  @property({ reflect: true, type: Boolean })
  open = false;
  @property({ converter: allowedValuesConverter(ClippyCombobox.positions, defaultPosition) })
  position: Position = defaultPosition;
  @property({ reflect: true, type: Boolean })
  invalid = false;

  get #id() {
    return `${tag}-${this.name}`;
  }

  #options: Map<T['label'], T> = new Map();

  static override readonly styles = [
    styles,
    srOnly,
    unsafeCSS(comboboxStyles),
    unsafeCSS(listboxStyles),
    unsafeCSS(textboxStyles),
  ];

  @state() activeIndex = -1;
  @state() query = ''; // Query is what the user types to filter options.
  @state() get filteredOptions(): T[] {
    if (this.query.length === 0) {
      return this.options;
    }
    const filter = this.filter(this.query);
    return this.options.filter(filter);
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
  readonly filter = (query: string): ((option: T) => boolean) => {
    const normalizedQuery = query.toLowerCase();
    return ({ description, label }: T) => {
      return Boolean(
        label.toLowerCase().includes(normalizedQuery) || description?.toLowerCase().includes(normalizedQuery),
      );
    };
  };

  /**
   * Override this function to customize an external data source
   */
  fetchAdditionalOptions(_query: string) {
    const empty: T[] = [];
    return Promise.resolve(empty);
  }

  /**
   * Override this function to customize how the value is looked up based on the selected option
   */
  getOptionForValue(value: T['value'] | null): T | undefined {
    return this.options.find((option) => dequal(option.value, value));
  }

  /**
   * Override this function to customize how the user input is resolved to a value.
   */
  queryToValue(query: string): T['value'] | null {
    if (this.allow === 'other') {
      return this.getOptionForValue(this.value)?.value || query;
    }
    const filter = this.filter(query);
    return this.options.find(filter)?.value ?? null;
  }

  /**
   * Override this function to customize how a value is converted to a query.
   * This runs on setting the value.
   */
  valueToQuery(value: Option['value']): string {
    const option = this.getOptionForValue(value);
    return option?.label || (this.allow === 'other' && typeof value === 'string' ? value : '');
  }

  readonly #addAdditionalOptions = debounce(
    memoize(
      async (query: string) => {
        const additions = await this.fetchAdditionalOptions(query);
        for (const addition of additions) {
          this.#options.set(addition.label, addition);
        }
        this.requestUpdate();
      },
      { maxAge: 60_000 },
    ),
    100,
  );

  readonly #handleBlur = (event: FocusEvent) => {
    const focusedRelatedElement = event.relatedTarget && this.shadowRoot?.contains(event.relatedTarget as Node);
    // Only when the focus moves outside of the component, treat it as a blur for outside
    if (!focusedRelatedElement) {
      if (this.allow === 'other' && this.query) {
        const value = this.queryToValue(this.query);
        if (value && this.value !== value) {
          this.value = value;
          this.#handleChange();
        }
      }
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
    this.invalid = false; // reset invalid state on focus to allow retrying after an invalid input
    this.emit('focus');
  };

  readonly #handleInput = (event: InputEvent) => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement)) return;
    this.activeIndex = -1;
    this.open = true;
    this.query = target.value;
    if (this.query.length > 3) {
      this.#addAdditionalOptions(this.query);
    }
    this.emit('input');
  };

  readonly #handleOptionsClick = (event: Event) => {
    const target = event.currentTarget;
    if (!(target instanceof HTMLElement)) return;

    const index = Number(target.dataset['index']);
    if (Number.isNaN(index)) return;
    this.#commitActiveItem(index);
  };

  readonly #handleKeydown = ({ key }: KeyboardEvent) => {
    const index = this.activeIndex;
    const count = this.filteredOptions.length;
    switch (key) {
      case 'ArrowDown':
        return this.#setActiveItem(index + 1, true);
      case 'ArrowUp':
        return this.#setActiveItem(index - 1, true);
      case 'Enter':
        if (index > -1) {
          return this.#commitActiveItem(index);
        } else if (count === 1) {
          return this.#commitActiveItem(0);
        } else if (this.allow === 'other') {
          return this.#commitQuery();
        }
        return undefined;
      case 'Escape':
        return this.#setActiveItem(-1);
      case 'Home':
        return this.#setActiveItem(0);
      case 'End':
        return this.#setActiveItem(count - 1);
      default:
        return undefined;
    }
  };

  #setActiveItem(index: number, open: boolean = false) {
    this.open = open;
    this.activeIndex = index > -1 ? index % this.filteredOptions.length : -1;
    if (this.activeIndex > -1) {
      const element = this.shadowRoot?.querySelector(`#${String(this.#getOptionId())}`);
      element?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'nearest',
      });
    }
  }

  #commitActiveItem(index: number) {
    const { label, value } = this.filteredOptions.at(index) ?? {};
    if (index < 0 || !label || !value) return;
    if (this.value !== value) {
      this.value = value;
      this.#handleChange();
    }
    this.open = false;
  }

  #commitQuery() {
    const value = this.queryToValue(this.query);
    if (value && this.value !== value) {
      this.value = value;
      this.#handleChange();
    }
    this.open = false;
  }

  get #listId() {
    return `list-${this.#id}`;
  }

  #getOptionId(index: number = this.activeIndex) {
    return index === -1 ? undefined : `option-${index}-${this.#id}`;
  }

  /**
   * Override this function to customize the rendering of combobox options and selected value.
   * By default, it renders the label and description (if available) in the listbox options,
   * and only the label in the input when an option is selected (by virtue of `index` being `undefined`).
   */
  renderEntry({ description, label }: Option, index?: number) {
    return html`
      <div>${label}</div>
      ${description && index !== undefined ? html`<div>${description}</div>` : nothing}
    `;
  }

  override willUpdate(changed: PropertyValues) {
    super.willUpdate(changed);
    // Query value in input is dependent on both `options` and `value`.
    if (changed.has('options') || changed.has('value')) {
      this.query = this.valueToQuery(this.value) ?? '';
    }
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
    const textboxClasses = {
      'utrecht-combobox__input': true,
      'utrecht-textbox': true,
      'utrecht-textbox--invalid': this.invalid,
    };
    const currentOption = this.getOptionForValue(this.value);
    return html`
      <div class="utrecht-combobox">
        <label for="${this.#id}" class="sr-only">${this.hiddenLabel}</label>
        <div class="clippy-combobox__input-container">
          ${currentOption
            ? html`<div
                role="presentation"
                class=${classMap({ 'clippy-combobox__current-option': true, ...textboxClasses })}
              >
                ${this.renderEntry(currentOption)}
              </div>`
            : nothing}
          <input
            id=${this.#id}
            name=${this.name}
            autocomplete="off"
            role="combobox"
            aria-autocomplete="list"
            aria-haspopup="listbox"
            aria-controls=${this.#listId}
            aria-expanded=${this.open}
            aria-activedescendant=${ifDefined(this.#getOptionId())}
            aria-invalid=${ifDefined(this.invalid ? 'true' : undefined)}
            type="text"
            class=${classMap(textboxClasses)}
            dir="auto"
            .value=${this.query}
            @input=${this.#handleInput}
            @focus=${this.#handleFocus}
            @blur=${this.#handleBlur}
            @keydown=${this.#handleKeydown}
          />
        </div>
        <div
          id=${this.#listId}
          class="utrecht-listbox utrecht-combobox__popover ${classMap(popoverClasses)}"
          role="listbox"
          tabindex="-1"
        >
          <ul class="utrecht-listbox__list" role="none">
            ${this.filteredOptions.map((option, index) => {
              const active = index === this.activeIndex;
              const selected = option.value === this.value;
              const interactionClasses = {
                'utrecht-listbox__option--active': active,
                'utrecht-listbox__option--selected': selected,
              };
              return html`<li
                class="clippy-combobox__option utrecht-listbox__option utrecht-listbox__option--html-li ${classMap(
                  interactionClasses,
                )}"
                role="option"
                id=${ifDefined(this.#getOptionId(index))}
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
