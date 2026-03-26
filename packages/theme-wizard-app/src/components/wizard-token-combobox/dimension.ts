import '@nl-design-system-community/clippy-components/clippy-html-image';
import {
  type DimensionToken,
  type ModernDimensionValue,
  type ModernDimensionToken,
  EXTENSION_RESOLVED_AS,
  isRef,
  stringifyDimension,
  EXTENSION_TOKEN_SUBTYPE,
} from '@nl-design-system-community/design-tokens-schema';
import { html, nothing } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';

const getActualValue = (token: ModernDimensionToken): ModernDimensionValue => {
  const { $extensions, $value } = token;
  const resolvedAs = $extensions?.[EXTENSION_RESOLVED_AS];
  if (isRef($value)) {
    return resolvedAs as ModernDimensionValue;
  }
  return $value;
};

export const filter = <T extends { value: ModernDimensionToken }>(query: string): ((option: T) => boolean) => {
  return ({ value: token }: T) => {
    const actualValue = getActualValue(token);
    return stringifyDimension(actualValue).toLowerCase().includes(query);
  };
};

export const queryToValue = (query: string): DimensionToken => {
  return { $type: 'dimension', $value: query };
};

export const valueToQuery = <T extends { $value: DimensionToken['$value'] }>({ $value }: T): string => {
  return typeof $value === 'string' ? $value : stringifyDimension($value);
};

export const preview = <T extends { label: string; value: ModernDimensionToken }>({ value }: T) => {
  if (value.$extensions?.[EXTENSION_TOKEN_SUBTYPE] !== 'font-size') return nothing;
  const PREVIEW_VALUE = 'Ag';
  const actualValue = getActualValue(value);
  const styles = {
    fontSize: stringifyDimension(actualValue),
  };
  return html`
    <clippy-html-image>
      <span class="wizard-token-combobox__preview wizard-token-combobox__preview--font-size" style=${styleMap(styles)}
        >${PREVIEW_VALUE}</span
      >
    </clippy-html-image>
  `;
};
