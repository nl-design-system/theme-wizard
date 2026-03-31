import '@nl-design-system-community/clippy-components/clippy-html-image';
import {
  type NumberToken,
  EXTENSION_RESOLVED_AS,
  isRef,
  EXTENSION_TOKEN_SUBTYPE,
  DimensionToken,
  stringifyDimension,
  parseFontWeight,
} from '@nl-design-system-community/design-tokens-schema';
import { parse_dimension } from '@projectwallace/css-parser/parse-dimension';
import { html, nothing } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';

const stringifyValue = (value: string | number | DimensionToken['$value']): string => {
  if (typeof value === 'number' || typeof value === 'string') {
    return value.toString();
  }
  return stringifyDimension(value);
};

const getActualValue = (token: NumberToken | DimensionToken): NumberToken['$value'] | DimensionToken['$value'] => {
  const { $extensions, $value } = token;
  const resolvedAs = $extensions?.[EXTENSION_RESOLVED_AS];
  if (isRef($value)) {
    return resolvedAs as number;
  }
  return $value;
};

/**
 * @description customize how options are filtered when typing
 */
export const filter = <T extends { value: NumberToken | DimensionToken }>(query: string): ((option: T) => boolean) => {
  return ({ value: token }: T) => {
    const actualValue = getActualValue(token);
    return stringifyValue(actualValue).toLowerCase().includes(query);
  };
};

/**
 * @description customize how the user input is resolved to a value
 * Note: for number inputs (line-height, font-weight), this can be a Dimension or Number
 */
export const queryToValue = (query: string): NumberToken | DimensionToken | { $type: 'number'; $value: string } => {
  const parsedNumber = Number(query);

  // Best scenario: the input already was a number
  if (Number.isFinite(parsedNumber)) {
    return {
      $type: 'number',
      $value: parsedNumber,
    };
  }

  // A font-weight maybe? Bold, normal, etc.
  const parsedWeight = parseFontWeight(query);
  if (parsedWeight !== null) {
    return {
      $type: 'number',
      $value: parsedWeight,
    };
  }

  // If all else fails, try it as a dimension
  return {
    $type: 'dimension',
    $value: parse_dimension(query),
  } as DimensionToken;
};

/**
 * @description customize how a value is converted to a query
 */
export const valueToQuery = <T extends { $value: NumberToken['$value'] | DimensionToken['$value'] }>({
  $value,
}: T): string => {
  return stringifyValue($value);
};

export const preview = <T extends { label: string; value: NumberToken }>({ value }: T) => {
  if (value.$extensions?.[EXTENSION_TOKEN_SUBTYPE] !== 'font-weight') {
    return nothing;
  }

  const PREVIEW_VALUE = 'Ag';
  const actualValue = getActualValue(value);
  const styles = {
    fontWeight: stringifyValue(actualValue),
  };
  return html`
    <clippy-html-image>
      <span class="wizard-token-combobox__preview wizard-token-combobox__preview--font-weight" style=${styleMap(styles)}
        >${PREVIEW_VALUE}</span
      >
    </clippy-html-image>
  `;
};
