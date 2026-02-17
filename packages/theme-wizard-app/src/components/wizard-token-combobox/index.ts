import colorSampleCss from '@nl-design-system-candidate/color-sample-css/color-sample.css?inline';
import dataBadgeCss from '@nl-design-system-candidate/data-badge-css/data-badge.css?inline';
import { ClippyCombobox } from '@nl-design-system-community/clippy-components/clippy-combobox';
import { allowedValuesConverter } from '@nl-design-system-community/clippy-components/lib/converters';
import LocalizationMixin from '@nl-design-system-community/clippy-components/lib/LocalizationMixin';
import {
  ColorToken,
  DimensionToken,
  FontFamilyToken,
  isRef,
  ResolvedToken,
} from '@nl-design-system-community/design-tokens-schema';
import { html, nothing, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { DesignToken } from 'style-dictionary/types';

export type Option = {
  label: string;
  description?: string;
  value: ColorToken | DimensionToken | FontFamilyToken | ResolvedToken | DesignToken;
};

// There's no exhaustive list of fonts, so we allow values outside of supplied options.
const defaultAllowance = 'other';

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
  #type?: 'color' | 'dimension' | 'font-family' = undefined;

  static override readonly styles = [...ClippyCombobox.styles, unsafeCSS(colorSampleCss), unsafeCSS(dataBadgeCss)];

  static label(token: Option['value']) {
    if (typeof token?.$value === 'string' || token.$value === undefined) {
      return token.$value;
    }
    return JSON.stringify(token.$value);
  }

  get type() {
    return this.#type;
  }

  set type(value: 'color' | 'dimension' | 'font-family' | undefined) {
    this.#type = value;
  }

  override readonly filter = (query: string) => {
    const normalizedQuery = query.toLowerCase();
    return (option: Option) => {
      const label = option.label.toLowerCase();
      return label.includes(normalizedQuery);
    };
  };

  @property({ type: Array })
  override get options(): Option[] {
    return this.#options;
  }

  override set options(value: Array<{ label: Option['label']; value: Option['value'] }>) {
    this.#options = value.map(({ label, value }) => {
      return {
        description: value?.$type,
        label,
        value,
      };
    });
  }

  override renderEntry({ description, label }: Option, index?: number) {
    const labelClasses = {
      'nl-data-badge': isRef(this.value?.$value),
    };
    return html`
      <div class=${classMap(labelClasses)}>${label}</div>
      ${description && index !== undefined ? html`<div>${description}</div>` : nothing}
    `;
  }
}
