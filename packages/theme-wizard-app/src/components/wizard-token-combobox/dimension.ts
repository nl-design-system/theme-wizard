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
import { parse_dimension } from '@projectwallace/css-parser/parse-dimension';
import { html, nothing } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';

const getActualValue = (token: DimensionToken): DimensionToken['$value'] => {
  const { $extensions, $value } = token;
  const resolvedAs = $extensions?.[EXTENSION_RESOLVED_AS];
  if (isRef($value)) {
    return resolvedAs as ModernDimensionValue;
  }
  return $value;
};

/**
 * @description customize how options are filtered when typing
 */
export const filter = <T extends { value: ModernDimensionToken }>(query: string): ((option: T) => boolean) => {
  return ({ value: token }: T) => {
    const actualValue = getActualValue(token);
    if (typeof actualValue === 'string') {
      return actualValue.toLowerCase().includes(query);
    }
    return stringifyDimension(actualValue).toLowerCase().includes(query);
  };
};

/**
 * @description customize how the user input is resolved to a value
 */
export const queryToValue = (query: string): DimensionToken => {
  return { $type: 'dimension', $value: parse_dimension(query) } as DimensionToken;
};

/**
 * @description customize how a value is converted to a query
 */
export const valueToQuery = <T extends { $value: DimensionToken['$value'] }>({ $value }: T): string => {
  return typeof $value === 'string' ? $value : stringifyDimension($value);
};

export const preview = <T extends { label: string; value: DimensionToken }>({ value }: T) => {
  if (value.$extensions?.[EXTENSION_TOKEN_SUBTYPE] !== 'font-size') {
    return nothing;
  }

  const PREVIEW_VALUE = 'Ag';
  const actualValue = getActualValue(value);
  const styles = {
    fontSize: typeof actualValue === 'string' ? actualValue : stringifyDimension(actualValue),
  };
  return html`
    <clippy-html-image>
      <span class="wizard-token-combobox__preview wizard-token-combobox__preview--font-size" style=${styleMap(styles)}
        >${PREVIEW_VALUE}</span
      >
    </clippy-html-image>
  `;
};
