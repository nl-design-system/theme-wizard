import { ColorToken, ColorValue, parseColor, stringifyColor } from '@nl-design-system-community/design-tokens-schema';
import Color from 'colorjs.io';
import { html, nothing } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';
const DELTA_E_THRESHOLD = 20;
const BROAD_COLOR_NAMES = new Set(['red', 'green', 'blue']);

/**
 * Try parsing token $value using colorjs.io, returning null if parsing fails.
 *
 * @param value
 * @returns
 */
export const parse = (value: unknown): Color | null => {
  try {
    const string = typeof value === 'string' ? value : stringifyColor(value as ColorValue);
    return new Color(string);
  } catch {
    return null;
  }
};

export const filter = <T extends { color?: Color }>(query: string) => {
  const queryColor = Color.try(query);
  const maxDeltaE = BROAD_COLOR_NAMES.has(query) ? DELTA_E_THRESHOLD * 2 : DELTA_E_THRESHOLD;
  return ({ color }: T) => Boolean(queryColor && color && queryColor.deltaE(color, '2000') < maxDeltaE);
};

export const queryToValue = (query: string): ColorToken => {
  return { $type: 'color', $value: parseColor(query) };
};

export const valueToQuery = <T extends { $value: ColorToken['$value'] }>({ $value }: T): string => {
  try {
    return typeof $value === 'string' ? $value : stringifyColor($value);
  } catch {
    return ''; // If the value can't be stringified, return an empty string to avoid displaying invalid data in the input.
  }
};

export const preview = <T extends { value: ColorToken; color?: Color }>({ color, value }: T) => {
  if (!value) {
    return nothing;
  }
  const colorValue = color?.toString() ?? stringifyColor(value?.$value);
  return colorValue
    ? html`
        <svg
          role="img"
          xmlns="http://www.w3.org/2000/svg"
          class="wizard-token-combobox__preview nl-color-sample"
          style=${styleMap({ color: colorValue })}
        >
          <path d="M0 0H32V32H0Z" fill="currentcolor" />
        </svg>
      `
    : nothing;
};
