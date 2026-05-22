import LocalizationMixin from '@lib/LocalizationMixin';
import colorSampleCss from '@nl-design-system-candidate/color-sample-css/color-sample.css?inline';
import dataBadgeCss from '@nl-design-system-candidate/data-badge-css/data-badge.css?inline';
import {
  type ColorToken,
  type ModernDimensionToken,
  type FontFamilyToken,
  type ResolvedToken,
} from '@nl-design-system-community/design-tokens-schema';
import { allowedValuesConverter } from '@src/lib/converters';
import { safeCustomElement } from '@src/lib/decorators';
import { unsafeCSS } from 'lit';
import { property } from 'lit/decorators.js';
import { type DesignToken } from 'style-dictionary/types';
import { ClippyCombobox } from '../clippy-combobox';
import styles from './styles';

// TODO: update DesignToken with BaseDesignToken from @nl-design-system-community/design-tokens-schema
export type ClippyTokenComboboxOption = {
  label: string;
  description?: string;
  value: ColorToken | ModernDimensionToken | FontFamilyToken | ResolvedToken | DesignToken;
};

// Allow custom overrides
const types = ['color', 'dimension', 'fontFamily', 'number'] as const;

const tag = 'clippy-token-combobox';

// Flatten the generic before applying the mixin to ensure type compatibility.
class C extends ClippyCombobox<ClippyTokenComboboxOption> {}

@safeCustomElement(tag)
export class ClippyTokenCombobox extends LocalizationMixin(C) {
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
}

declare global {
  interface HTMLElementTagNameMap {
    [tag]: ClippyTokenCombobox;
  }
}
