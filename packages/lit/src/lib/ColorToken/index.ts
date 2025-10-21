import {
  COLOR_SPACES,
  type ColorSpace,
  type ColorComponent,
  type ColorToken as ColorTokenType,
} from '@nl-design-system-community/design-tokens-schema';
import { createHelperElement } from './lib';

type MinimalColorToken = Omit<ColorTokenType, '$type'> & { $type?: ColorTokenType['$type'] };
export type ColorComponents = ColorTokenType['$value']['components'];

export default class ColorToken {
  #$type = 'color' as const;
  #$value: ColorTokenType['$value'];
  #$extensions: ColorTokenType['$extensions'];
  static #helperElement = createHelperElement();

  constructor(token: MinimalColorToken) {
    const { $extensions, $value } = token;
    this.#$extensions = $extensions || {};
    this.#$value = $value;
  }

  get $type() {
    return this.#$type;
  }

  get $value() {
    return this.#$value;
  }

  get $extensions() {
    return this.#$extensions;
  }

  /**
   * Return a new ColorToken in the destination color space
   */
  toColorSpace(destination: ColorSpace): ColorToken {
    const helperElement = ColorToken.#helperElement;
    if (!helperElement) throw new Error('Cannot run outside of the browser');

    if (this.$value.colorSpace === destination) return new ColorToken(this);

    const relativeColor = ColorToken.getRelativeColorFunction(destination, this.$value);
    helperElement.style.color = relativeColor;
    const value = getComputedStyle(helperElement).color;

    const components = value.match(/(\d+\.?\d*)/g)?.map(Number) || [NaN, NaN, NaN];
    return new ColorToken({
      ...this,
      $value: {
        ...this.#$value,
        colorSpace: destination,
        components,
      },
    });
  }

  toCSSColorFunction(): string {
    return ColorToken.getCSSColorFunction(this.$value);
  }

  static getCSSColorFunction({
    colorSpace,
    components,
  }: {
    colorSpace: ColorSpace;
    components: ColorComponents;
  }): string {
    /**
     * @SEE https://www.designtokens.org/tr/third-editors-draft/color/#supported-color-spaces
     */
    const percentage = (c: ColorComponent) => (c === 'none' ? c : `${c}%`);

    const [first, ...rest] = components;

    switch (colorSpace) {
      case COLOR_SPACES.HSL:
        return `hsl(${first} ${rest.map(percentage).join(' ')})`;
      case COLOR_SPACES.HWB:
        return `hwb(${first} ${rest.map(percentage).join(' ')})`;
      case COLOR_SPACES.LAB:
        return `lab(${percentage(first)} ${rest.join(' ')})`;
      case COLOR_SPACES.LCH:
        return `lch(${percentage(first)} ${rest.join(' ')})`;
      case COLOR_SPACES.OKLAB:
        return `oklab(${components.join(' ')})`;
      case COLOR_SPACES.OKLCH:
        return `oklch(${components.join(' ')})`;
      case COLOR_SPACES.SRGB:
      case COLOR_SPACES.DISPLAY_P3:
      case COLOR_SPACES.A98_RGB:
      case COLOR_SPACES.PROPHOTO_RGB:
      case COLOR_SPACES.REC2020:
      case COLOR_SPACES.XYZ_D50:
      case COLOR_SPACES.XYZ_D65:
      default:
        return `color(${colorSpace} ${components.join(' ')})`;
    }
  }

  static getRelativeColorFunction(
    destination: ColorSpace,
    {
      colorSpace,
      components,
    }: {
      colorSpace: ColorSpace;
      components: ColorComponents;
    },
  ): string {
    const value = ColorToken.getCSSColorFunction({
      colorSpace,
      components,
    });
    switch (destination) {
      case COLOR_SPACES.HSL:
        return `hsl(from ${value} h s l)`;
      case COLOR_SPACES.HWB:
        return `hwb(from ${value} h w b)`;
      case COLOR_SPACES.LAB:
        return `lab(from ${value} l a b)`;
      case COLOR_SPACES.LCH:
        return `lch(from ${value} l c h)`;
      case COLOR_SPACES.OKLAB:
        return `oklab(from ${value} l a b)`;
      case COLOR_SPACES.OKLCH:
        return `oklch(from ${value} l c h)`;
      case COLOR_SPACES.SRGB:
      case COLOR_SPACES.DISPLAY_P3:
      case COLOR_SPACES.A98_RGB:
      case COLOR_SPACES.PROPHOTO_RGB:
      case COLOR_SPACES.REC2020:
        return `color(from ${value} ${destination} r g b)`;
      case COLOR_SPACES.XYZ_D50:
      case COLOR_SPACES.XYZ_D65:
        return `color(from ${value} ${destination} x y z)`;
      default:
        return `color(from ${value} ${destination} r g b)`;
    }
  }
}
