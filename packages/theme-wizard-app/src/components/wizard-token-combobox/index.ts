import colorSampleCss from '@nl-design-system-candidate/color-sample-css/color-sample.css?inline';
import dataBadgeCss from '@nl-design-system-candidate/data-badge-css/data-badge.css?inline';
import { ClippyCombobox } from '@nl-design-system-community/clippy-components/clippy-combobox';
import { allowedValuesConverter } from '@nl-design-system-community/clippy-components/lib/converters';
import LocalizationMixin from '@nl-design-system-community/clippy-components/lib/LocalizationMixin';
import {
  EXTENSION_RESOLVED_AS,
  isRef,
  stringifyDimension,
  type ColorToken,
  type ModernDimensionToken,
  type FontFamilyToken,
  type ResolvedToken,
  NumberToken,
} from '@nl-design-system-community/design-tokens-schema';
import Color from 'colorjs.io';
import { dequal } from 'dequal';
import { html, nothing, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { DesignToken } from 'style-dictionary/types';
import * as libColor from './color';
import * as libDimension from './dimension';
import * as libFontFamily from './font-family';
import * as libNumber from './number';
import styles from './styles';

export type Option = {
  label: string;
  description?: string;
  value: ColorToken | ModernDimensionToken | FontFamilyToken | ResolvedToken | DesignToken;
  color?: Color;
};

// Allow custom overrides
const defaultAllowance = 'other';
const types = ['color', 'dimension', 'fontFamily', 'number'] as const;

const tag = 'wizard-token-combobox';

declare global {
  interface HTMLElementTagNameMap {
    [tag]: WizardTokenCombobox;
  }
}

// Flatten the generic before applying the mixin to ensure type compatibility.
class C extends ClippyCombobox<Option> {}

@customElement(tag)
export class WizardTokenCombobox extends LocalizationMixin(C) {
  @property({ converter: allowedValuesConverter(ClippyCombobox.allowances, defaultAllowance) })
  override allow: (typeof ClippyCombobox.allowances)[number] = defaultAllowance;
  #options: Option[] = [];
  #type?: (typeof types)[number] = undefined;

  static override readonly styles = [
    styles,
    ...ClippyCombobox.styles,
    unsafeCSS(colorSampleCss),
    unsafeCSS(dataBadgeCss),
  ];

  static label(token: Option['value']) {
    if (typeof token?.$value === 'string' || typeof token?.$value === 'number' || token.$value === undefined) {
      return token.$value;
    }
    if (token.$type === 'dimension') {
      return stringifyDimension(token.$value);
    }
    return JSON.stringify(token.$value); // TODO: improve this for better display of complex tokens
  }

  @property({ converter: allowedValuesConverter(types) })
  set type(value: (typeof types)[number] | undefined) {
    this.#type = value;
  }

  get type() {
    return this.#type;
  }

  /**
   * @description customize how options are filtered when typing
   */
  override readonly filter = (query: string): ((option: Option) => boolean) => {
    const normalizedQuery = query.toLowerCase();
    const filterByLabel = ({ label }: Option) => label.toLowerCase().includes(normalizedQuery);

    switch (this.type) {
      case 'color':
        return (option: Option) => filterByLabel(option) || libColor.filter(normalizedQuery)(option);
      case 'fontFamily':
        return ({ label, value }: Option) =>
          filterByLabel({ label, value }) || libFontFamily.filter(normalizedQuery)({ value: value as FontFamilyToken });
      case 'dimension':
        return ({ label, value }: Option) =>
          filterByLabel({ label, value }) ||
          libDimension.filter(normalizedQuery)({ value: value as ModernDimensionToken });
      case 'number':
      default:
        return filterByLabel;
    }
  };

  @property({ type: Array })
  override get options(): Option[] {
    return this.#options;
  }

  override set options(value: Array<{ label: Option['label']; value: Option['value'] }>) {
    this.#options = value.map(({ label, value }) => {
      let color = undefined;
      if (this.type === 'color') {
        if (isRef(value?.$value)) {
          color = libColor.parse(value.$extensions[EXTENSION_RESOLVED_AS]);
        } else {
          color = libColor.parse(value.$value);
        }
      }
      return {
        color: color ?? undefined,
        label,
        value,
      };
    });
  }

  #getOptionForValue(value: Option['value'] | null): Option | undefined {
    const { $value } = value ?? {};
    return this.options.find((option) => dequal(option.value.$value, $value));
  }

  /**
   * @description customize how the value is looked up based on the selected option
   */
  override getOptionForValue(value: Option['value'] | null): Option | undefined {
    const { $type, $value } = value ?? {};
    const option = this.#getOptionForValue({ $value });
    if (value && $type && !option && this.allow === 'other') {
      return {
        label: this.valueToQuery({ $value }),
        value,
      };
    }
    return option;
  }

  /**
   * @description customize how the user input is resolved to a value
   */
  override queryToValue(query: string): Option['value'] | null {
    if (this.allow === 'other') {
      const existingOption = this.options.find((o) => o.label === query);
      if (existingOption) return existingOption.value;
      try {
        this.invalid = false;
        const value = ((query: string) => {
          switch (this.type) {
            case 'color':
              return libColor.queryToValue(query);
            case 'fontFamily':
              return libFontFamily.queryToValue(query);
            case 'dimension':
              return libDimension.queryToValue(query);
            case 'number':
              return libNumber.queryToValue(query);
            default:
              return super.queryToValue(query);
          }
        })(query);
        const option = this.#getOptionForValue(value);
        return option?.value ?? value;
      } catch (error) {
        console.warn(error);
        this.invalid = true;
        return this.value; // Return the current value to avoid losing it on invalid input, allowing the user to correct it.
      }
    }
    const filter = this.filter(query);
    return this.options.find(filter)?.value ?? null;
  }

  /**
   * @description customize how a value is converted to a query
   */
  override valueToQuery({ $value }: Option['value']): string {
    const option = this.getOptionForValue({ $value });
    const stringValue = option?.label || (typeof $value === 'string' ? $value : '');
    switch (this.type) {
      case 'color':
        return stringValue || libColor.valueToQuery({ $value });
      case 'fontFamily':
        return stringValue || libFontFamily.valueToQuery({ $value });
      case 'dimension':
        return stringValue || libDimension.valueToQuery({ $value });
      case 'number':
        return stringValue || libNumber.valueToQuery({ $value });
      default:
        return stringValue || JSON.stringify($value);
    }
  }

  renderPreview(option: Option) {
    // TODO fix type safety by making sure option type is inferred from `option.value.$type`
    switch (option.value.$type) {
      case 'color':
        return libColor.preview(option as Option & { value: ColorToken });
      case 'fontFamily':
        return libFontFamily.preview(option as Option & { value: FontFamilyToken });
      case 'dimension':
        return libDimension.preview(option as Option & { value: ModernDimensionToken });
      case 'number':
        return libNumber.preview(option as Option & { value: NumberToken });
      default:
        return nothing;
    }
  }

  override renderEntry(option: Option, index?: number) {
    const { description, label, value } = option;
    const labelClasses = {
      'nl-data-badge': isRef(value?.$value),
    };
    return html`
      <span class="wizard-token-combobox__option">
        ${this.renderPreview(option)}
        <span class=${classMap(labelClasses)}>${label}</span>
      </span>
      ${description && index !== undefined ? html`<div>${description}</div>` : nothing}
    `;
  }
}
