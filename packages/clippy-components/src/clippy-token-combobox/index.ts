import LocalizationMixin from '@lib/LocalizationMixin';
import colorSampleCss from '@nl-design-system-candidate/color-sample-css/color-sample.css?inline';
import dataBadgeCss from '@nl-design-system-candidate/data-badge-css/data-badge.css?inline';
import {
  type ColorToken,
  type ModernDimensionToken,
  type FontFamilyToken,
  type ResolvedToken,
} from '@nl-design-system-community/design-tokens-schema';
import { safeCustomElement } from '@src/lib/decorators';
import Color from 'colorjs.io';
import { unsafeCSS } from 'lit';
import { DesignToken } from 'style-dictionary/types';
import { ClippyCombobox } from '../clippy-combobox';
import styles from './styles';

export type ClippyTokenComboboxOption = {
  label: string;
  description?: string;
  value: ColorToken | ModernDimensionToken | FontFamilyToken | ResolvedToken | DesignToken;
  color?: Color;
};

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
}

declare global {
  interface HTMLElementTagNameMap {
    [tag]: ClippyTokenCombobox;
  }
}
