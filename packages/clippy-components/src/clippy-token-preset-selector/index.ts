import { arrayFromTokenList } from '@src/lib/converters';
import { safeCustomElement } from '@src/lib/decorators';
import { FormElement } from '@src/lib/FormElement';
import ChevronLeftIcon from '@tabler/icons/outline/chevron-left.svg?raw';
import ChevronRightIcon from '@tabler/icons/outline/chevron-right.svg?raw';
import selectStyles from '@utrecht/select-css?inline';
import { html, unsafeCSS } from 'lit';
import { property, query } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import '../clippy-button';
import '../clippy-icon';
import '../clippy-html-image';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import srOnly from '../lib/sr-only';
import styles from './styles';
import { Option } from './types';

const tag = 'clippy-token-preset-selector';

declare global {
  interface HTMLElementTagNameMap {
    [tag]: ClippyTokenPresetSelector;
  }
}

/**
 * Clippy Token Preset Selector Component
 *
 * @cssprop --clippy-token-preset-selector-preview-space-block - Block space for the preview
 * @cssprop --clippy-token-preset-selector-preview-space-inline - Inline space for the preview
 * @cssprop --clippy-token-preset-selector-lg-preview-space-block - Block space for the preview when there is more space
 * @cssprop --clippy-token-preset-selector-lg-preview-space-inline - Inline space for the preview when there is more space
 */
@safeCustomElement(tag)
export class ClippyTokenPresetSelector<T extends Option = Option> extends FormElement<T['value']> {
  static override readonly styles = [unsafeCSS(selectStyles), styles, srOnly];

  #options: Map<T['label'], T> = new Map();

  @query('select')
  selectElement?: HTMLSelectElement;

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

  get #id() {
    return `${tag}-${this.name}`;
  }

  get #previewID() {
    return `${this.#id}-preview`;
  }

  @property({ attribute: 'label-previous', type: String }) labelPrevious: string = 'Vorige';
  @property({ attribute: 'label-next', type: String }) labelNext: string = 'Volgende';

  emit(type: 'blur' | 'change' | 'focus' | 'input') {
    this.dispatchEvent(new Event(type, { bubbles: true, composed: true }));
  }

  #handleSelectChange() {
    if (this.selectElement) {
      const selectedValue = this.selectElement.value;
      const option = this.getOptionForValue(selectedValue as T['value']);
      if (option && this.value !== option.value) {
        this.value = option.value;
        this.emit('change');
        this.emit('input');
      } else if (!option && this.value !== null) {
        this.value = null;
        this.emit('change');
        this.emit('input');
      }
    }
  }

  #handleSelectBlur() {
    this.emit('blur');
  }

  #handleSelectFocus() {
    this.emit('focus');
  }

  #getCurrentIndex(): number {
    if (!this.selectElement) return -1;
    const currentValue = this.selectElement.value as T['value'];
    const optionsArray = this.options;
    return optionsArray.findIndex((option) => String(option.value) === currentValue);
  }

  #selectPrev() {
    const optionsArray = this.options;
    if (optionsArray.length === 0 || !this.selectElement) return;
    const currentIndex = this.#getCurrentIndex();
    const newIndex = currentIndex <= 0 ? optionsArray.length - 1 : currentIndex - 1;
    this.selectElement.value = String(optionsArray[newIndex].value);
    this.selectElement.dispatchEvent(new Event('change', { bubbles: true }));
  }

  #selectNext() {
    const optionsArray = this.options;
    if (optionsArray.length === 0 || !this.selectElement) return;
    const currentIndex = this.#getCurrentIndex();
    const newIndex = currentIndex >= optionsArray.length - 1 ? 0 : currentIndex + 1;
    this.selectElement.value = String(optionsArray[newIndex].value);
    this.selectElement.dispatchEvent(new Event('change', { bubbles: true }));
  }

  getOptionForValue(value: T['value'] | null): T | undefined {
    for (const option of this.#options.values()) {
      if (option.value === value) {
        return option;
      }
    }
    return undefined;
  }

  override render() {
    const populatedSlots = Array.from(this.children).reduce(
      (acc, child) => ({
        ...acc,
        [child.slot]: child,
      }),
      {} as Record<string, Element>,
    );

    const labelClasses = {
      'clippy-token-preset-selector__label': true,
      'sr-only': !populatedSlots['label'], // If there is no slotted label, the label is only for screen readers, otherwise it's expected that the slotted content provides the label.
    };
    return html`
      <label for="${this.#id}" class=${classMap(labelClasses)}>
        <slot name="label">${this.hiddenLabel || this.name}</slot>
      </label>
      <div id=${this.#previewID} class="clippy-token-preset-selector__preview" aria-live="polite">
        <clippy-html-image>
          <slot></slot>
        </clippy-html-image>
      </div>
      <div class="clippy-token-preset-selector__wrap-controls">
        <clippy-button purpose="secondary" icon-only @click=${this.#selectPrev} aria-label="">
          <clippy-icon slot="iconStart">${unsafeSVG(ChevronLeftIcon)}</clippy-icon>
          ${this.labelPrevious}
        </clippy-button>
        <select
          id=${this.#id}
          name=${this.name}
          aria-controls=${this.#previewID}
          class="clippy-token-preset-selector__select | utrecht-select utrecht-select--html-select"
          @change=${this.#handleSelectChange}
          @blur=${this.#handleSelectBlur}
          @focus=${this.#handleSelectFocus}
        >
          ${Array.from(this.#options.values()).map(
            (option) =>
              html`<option value=${option.value as string} ?selected=${option.value === this.value}>
                ${option.label}
              </option>`,
          )}
        </select>
        <clippy-button purpose="secondary" icon-only @click=${this.#selectNext}>
          <clippy-icon slot="iconEnd">${unsafeSVG(ChevronRightIcon)}</clippy-icon>
          ${this.labelNext}
        </clippy-button>
      </div>
    `;
  }
}
