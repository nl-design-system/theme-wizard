import LocalizationMixin from '@lib/LocalizationMixin';
import colorSampleCss from '@nl-design-system-candidate/color-sample-css/color-sample.css?inline';
import dataBadgeCss from '@nl-design-system-candidate/data-badge-css/data-badge.css?inline';
import {
  type ColorToken,
  type ModernDimensionToken,
  type FontFamilyToken,
  type ResolvedToken,
  type BaseDesignToken,
} from '@nl-design-system-community/design-tokens-schema';
import { allowedValuesConverter } from '@src/lib/converters';
import { safeCustomElement } from '@src/lib/decorators';
import { html, nothing, unsafeCSS } from 'lit';
import { property } from 'lit/decorators.js';
import { ClippyCombobox } from '../clippy-combobox';
import * as libColor from './color';
import styles from './styles';

export type ClippyTokenComboboxOption = {
  label: string;
  description?: string;
  value: ColorToken | ModernDimensionToken | FontFamilyToken | ResolvedToken | BaseDesignToken;
};

// Allow custom overrides
const defaultAllowance = 'other';
const types = ['color', 'dimension', 'fontFamily', 'number'] as const;

const tag = 'clippy-token-combobox';

// Flatten the generic before applying the mixin to ensure type compatibility.
class C extends ClippyCombobox<ClippyTokenComboboxOption> {}

@safeCustomElement(tag)
export class ClippyTokenCombobox extends LocalizationMixin(C) {
  @property({ converter: allowedValuesConverter(ClippyCombobox.allowances, defaultAllowance) })
  override allow: (typeof ClippyCombobox.allowances)[number] = defaultAllowance;

  static override readonly styles = [
    styles,
    ...ClippyCombobox.styles,
    unsafeCSS(colorSampleCss),
    unsafeCSS(dataBadgeCss),
  ];

  /**
   * The type of token to filter for.
   */
  #type?: (typeof types)[number] = undefined;
  @property({ converter: allowedValuesConverter(types) })
  set type(value: (typeof types)[number] | undefined) {
    this.#type = value;
  }

  get type() {
    return this.#type;
  }

  #options: ClippyTokenComboboxOption[] = [];
  @property({ type: Array })
  override get options(): ClippyTokenComboboxOption[] {
    return this.#options;
  }

  override set options(value: ClippyTokenComboboxOption[]) {
    this.#options = value;
  }

  renderPreview(option: ClippyTokenComboboxOption) {
    // TODO fix type safety by making sure option type is inferred from `option.value.$type`
    switch (option.value.$type) {
      case 'color':
        return libColor.preview(option as ClippyTokenComboboxOption & { value: ColorToken });
      default:
        return nothing;
    }
  }

  override renderEntry(option: ClippyTokenComboboxOption, index?: number) {
    const { description, label } = option;
    return html`
      <span class="wizard-token-combobox__option">
        ${this.renderPreview(option)}
        <span>${label}</span>
      </span>
      ${description && index !== undefined ? html`<div>${description}</div>` : nothing}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [tag]: ClippyTokenCombobox;
  }
}
