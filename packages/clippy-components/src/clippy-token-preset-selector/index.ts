import { arrayFromTokenList } from '@src/lib/converters';
import { safeCustomElement } from '@src/lib/decorators';
import { FormElement } from '@src/lib/FormElement';
import { html, PropertyValues } from 'lit';
import { property } from 'lit/decorators.js';
import { ref } from 'lit/directives/ref.js';
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
 */
@safeCustomElement(tag)
export class ClippyTokenPresetSelector<T extends Option = Option> extends FormElement<T['value']> {
  static override readonly styles = [styles];

  #options: Map<T['label'], T> = new Map();
  #selectElement?: HTMLSelectElement;

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

  #handleSelectChange() {
    if (this.#selectElement) {
      const selectedValue = this.#selectElement.value;
      const option = this.getOptionForValue(selectedValue as T['value']);
      if (option && this.value !== option.value) {
        this.value = option.value;
      } else if (!option && this.value !== null) {
        this.value = null;
      }
      this.emit('change');
      this.emit('input');
    }
  }

  #handleSelectBlur() {
    this.emit('blur');
  }

  #handleSelectFocus() {
    this.emit('focus');
  }

  override willUpdate(changed: PropertyValues) {
    super.willUpdate(changed);
    if (changed.has('value') && this.#selectElement) {
      this.#selectElement.value = String(this.value ?? '');
    }
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
    const selectedOption = this.getOptionForValue(this.value);
    return html`
      <div class="clippy-token-preset-selector__preview">
        <slot><mark>preview</mark></slot>
      </div>
      <div class="clippy-token-preset-selector__wrap-controls">
        <button><</button>
        <select
          ${ref((el: HTMLSelectElement | null) => (this.#selectElement = el ?? undefined))}
          @change=${this.#handleSelectChange}
          @blur=${this.#handleSelectBlur}
          @focus=${this.#handleSelectFocus}
          .value=${selectedOption?.value ?? ''}
        >
          ${Array.from(this.#options.values()).map(
            (option) => html`<option value=${option.value as string}>${option.label}</option>`,
          )}
        </select>
        <button>></button>
      </div>
    `;
  }
}
