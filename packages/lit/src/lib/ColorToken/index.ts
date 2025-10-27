import type { ScrapedColorToken } from '@nl-design-system-community/css-scraper';
import { ColorSpace, ColorComponent, COLOR_SPACES } from '@nl-design-system-community/design-tokens-schema';
export type { ColorSpace };

export type ColorTokenOkLCh = ColorToken & {
  $value: ColorToken['$value'] & {
    colorSpace: 'oklch';
  };
};

export type ColorComponents = ScrapedColorToken['$value']['components'];

type MinimalScrapedColorToken = Omit<ScrapedColorToken, '$extensions'> & {
  $extensions?: Partial<ScrapedColorToken['$extensions']>;
};

export default class ColorToken {
  #$type = 'color' as const;
  #$value: ScrapedColorToken['$value'];
  #$extensions: MinimalScrapedColorToken['$extensions'];

  constructor(token: MinimalScrapedColorToken) {
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
      // These color spaces are polar:
      case COLOR_SPACES.HSL:
        return `hsl(${first} ${rest.map(percentage).join(' ')})`;
      case COLOR_SPACES.HWB:
        return `hwb(${first} ${rest.map(percentage).join(' ')})`;
      case COLOR_SPACES.LCH:
        return `lch(${percentage(first)} ${rest.join(' ')})`;
      case COLOR_SPACES.OKLCH:
        return `oklch(${components.join(' ')})`;
      // These color spaces are cartesian:
      case COLOR_SPACES.LAB:
        return `lab(${percentage(first)} ${rest.join(' ')})`;
      case COLOR_SPACES.OKLAB:
        return `oklab(${components.join(' ')})`;
      // These color spaces are cartesian and have components encoded as [ 0.0 - 1.0, 0.0 - 1.0 , 0.0 - 1.0 ]
      case COLOR_SPACES.SRGB:
      case COLOR_SPACES.DISPLAY_P3:
      case COLOR_SPACES.A98_RGB:
      case COLOR_SPACES.PROPHOTO_RGB:
      case COLOR_SPACES.REC2020:
      case COLOR_SPACES.XYZ_D50:
      case COLOR_SPACES.XYZ_D65:
      default:
        // Assume a missing color space is also cartesian
        return `color(${colorSpace} ${components.join(' ')})`;
    }
  }
}
