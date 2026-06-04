import {
  type ColorToken,
  type ColorValue,
  isRef,
  parseColor,
  stringifyColor,
  colorTokenValueToColorJS,
  EXTENSION_RESOLVED_AS,
  ColorValueSchema,
} from '@nl-design-system-community/design-tokens-schema';
import Color from 'colorjs.io';
import { html, nothing } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
const DELTA_E_THRESHOLD = 20;
const BROAD_COLOR_NAMES = new Set(['red', 'green', 'blue']);
import PaletteIcon from '@tabler/icons/outline/palette.svg?raw';

/**
 * Try parsing token $value using colorjs.io, returning null if parsing fails.
 *
 * @param value
 * @returns
 */
export const parse = (value: unknown): Color | null => {
  if (typeof value === 'string' && !isRef(value)) {
    return Color.try(value);
  }
  return colorTokenValueToColorJS(value as ColorValue);
};

/**
 * @description customize how options are filtered when typing
 */
export const filter = <T extends { color?: Color }>(query: string) => {
  const queryColor = Color.try(query);
  const maxDeltaE = BROAD_COLOR_NAMES.has(query) ? DELTA_E_THRESHOLD * 2 : DELTA_E_THRESHOLD;
  return ({ color }: T) => Boolean(queryColor && color && queryColor.deltaE(color, '2000') < maxDeltaE);
};

/**
 * @description customize how the user input is resolved to a value
 */
export const queryToValue = (query: string): ColorToken => {
  return { $type: 'color', $value: parseColor(query) };
};

/**
 * @description customize how a value is converted to a query
 */
export const valueToQuery = <T extends { $value: ColorToken['$value'] }>({ $value }: T): string => {
  if (typeof $value === 'string') {
    return $value;
  }

  return stringifyColor($value);
};

export const preview = <T extends { value: ColorToken }>({ value }: T) => {
  if (!value) {
    return nothing;
  }
  const resolvedColor = isRef(value.$value) ? value.$extensions?.[EXTENSION_RESOLVED_AS] : value.$value;
  const parsedColor = ColorValueSchema.safeParse(resolvedColor);
  if (!parsedColor.success) return nothing;
  const colorValue = stringifyColor(parsedColor.data);
  return colorValue
    ? html`
        <svg
          role="img"
          xmlns="http://www.w3.org/2000/svg"
          class="clippy-token-combobox__preview nl-color-sample"
          style=${styleMap({ color: colorValue })}
        >
          <path d="M0 0H32V32H0Z" fill="currentcolor" />
        </svg>
      `
    : nothing;
};

export const defaultIconStartPreview = () => {
  return html`<clippy-icon>${unsafeSVG(PaletteIcon)}</clippy-icon>`;
};
