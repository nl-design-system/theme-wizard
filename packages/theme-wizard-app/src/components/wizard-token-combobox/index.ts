import colorSampleCss from '@nl-design-system-candidate/color-sample-css/color-sample.css?inline';
import dataBadgeCss from '@nl-design-system-candidate/data-badge-css/data-badge.css?inline';
import { ClippyCombobox } from '@nl-design-system-community/clippy-components/clippy-combobox';
import { allowedValuesConverter } from '@nl-design-system-community/clippy-components/lib/converters';
import LocalizationMixin from '@nl-design-system-community/clippy-components/lib/LocalizationMixin';
import {
  EXTENSION_RESOLVED_AS,
  isRef,
  type ColorToken,
  type DimensionToken,
  type FontFamilyToken,
  type ResolvedToken,
} from '@nl-design-system-community/design-tokens-schema';
import Color from 'colorjs.io';
import { dequal } from 'dequal';
import { html, nothing, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { DesignToken } from 'style-dictionary/types';
import * as libColor from './color'; // Consider loading this dynamically based on component attribute `type`
import * as libFontFamily from './font-family'; // Consider loading this dynamically based on component attribute `type`
import styles from './styles';

export type Option = {
  label: string;
  description?: string;
  value: ColorToken | DimensionToken | FontFamilyToken | ResolvedToken | DesignToken;
  color?: Color;
};

// Allow custom overrides
const defaultAllowance = 'other';
const types = ['color', 'dimension', 'font-family', 'number'] as const;

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
    return JSON.stringify(token.$value); // TODO: improve this for better display of complex tokens
  }

  @property({ converter: allowedValuesConverter(types) })
  set type(value: (typeof types)[number] | undefined) {
    this.#type = value;
  }

  get type() {
    return this.#type;
  }

  override readonly filter = (query: string): ((option: Option) => boolean) => {
    const normalizedQuery = query.toLowerCase();
    const filterByLabel = ({ label }: Option) => label.toLowerCase().includes(normalizedQuery);

    switch (this.type) {
      case 'color':
        return (option: Option) => filterByLabel(option) || libColor.filter(normalizedQuery)(option);
      case 'font-family':
        return ({ label, value }: Option) =>
          filterByLabel({ label, value }) || libFontFamily.filter(normalizedQuery)({ value: value as FontFamilyToken });
      case 'dimension':
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
      const tokenIsRef = isRef(value?.$value); // Check if the token *value* is itself a reference to another token
      const description = tokenIsRef ? `${value?.$type} reference` : value?.$type;
      const color = tokenIsRef
        ? libColor.parse(value.$extensions[EXTENSION_RESOLVED_AS])
        : libColor.parse(value.$value);
      return {
        color: color ?? undefined,
        description,
        label,
        value,
      };
    });
  }

  override getOptionForValue(value: Option['value'] | null): Option | undefined {
    return this.options.find((option) => dequal(option.value.$value, value?.$value));
  }

  override queryToValue(query: string): Option['value'] | null {
    if (this.allow === 'other') {
      const option = this.getOptionForValue(this.value);
      switch (this.type) {
        case 'color':
          return option ?? libColor.queryToValue(query);
        case 'font-family':
        case 'dimension':
        case 'number':
        default:
          return option || { $type: this.type, $value: query };
      }
    }
    const filter = this.filter(query);
    return this.options.find(filter)?.value ?? null;
  }

  override valueToQuery({ $value }: Option['value']): string | undefined {
    const option = this.getOptionForValue({ $value });
    const stringValue = option?.label || typeof $value === 'string' ? $value : undefined;
    switch (this.type) {
      case 'color':
        return stringValue ?? libColor.valueToQuery({ $value });
      case 'font-family':
        return stringValue ?? libFontFamily.valueToQuery({ $value });
      case 'dimension':
      case 'number':
      default:
        return stringValue || JSON.stringify($value);
    }
  }

  renderPreview(option: Option) {
    switch (this.type) {
      case 'color':
        return libColor.preview(option);
      case 'font-family':
        return libFontFamily.preview(option as Option & { value: FontFamilyToken });
      case 'dimension':
      case 'number':
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
