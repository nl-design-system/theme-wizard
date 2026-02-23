import { EXTENSION_RESOLVED_AS, FontFamilyToken, isRef } from '@nl-design-system-community/design-tokens-schema';
import '@nl-design-system-community/clippy-components/clippy-html-image';
import { html, nothing } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';

const getActualValue = (token: FontFamilyToken) => {
  const { $extensions, $value } = token;
  const resolvedAs = $extensions?.[EXTENSION_RESOLVED_AS];
  if (isRef($value)) {
    return resolvedAs;
  }
  return $value;
};

export const filter = <T extends { value: FontFamilyToken }>(query: string): ((option: T) => boolean) => {
  return ({ value: token }: T) => {
    const actualValue = getActualValue(token);
    const value = Array.isArray(actualValue) ? actualValue[0] : (actualValue ?? '');
    return value.toLowerCase().includes(query.toLowerCase());
  };
};

export const valueToQuery = <T extends { $value: FontFamilyToken['$value'] }>({ $value }: T): string =>
  Array.isArray($value) ? $value[0] : $value || '';

export const preview = <T extends { label: string; value: FontFamilyToken }>({ value }: T) => {
  const PREVIEW_VALUE = 'Ag';
  const actualValue = getActualValue(value);
  if (!(typeof actualValue === 'string' || Array.isArray(actualValue))) {
    return nothing;
  }
  const fontFamily = Array.isArray(actualValue) ? actualValue.join(', ') : actualValue;
  const styles = {
    fontFamily,
    fontSizeAdjust: 0.5,
  };
  return html`
    <clippy-html-image>
      <span class="wizard-token-combobox__preview--font-family" style=${styleMap(styles)}>${PREVIEW_VALUE}</span>
    </clippy-html-image>
  `;
};
