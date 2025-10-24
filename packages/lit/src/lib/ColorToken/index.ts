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
      case COLOR_SPACES.hsl:
        return `hsl(${first} ${rest.map(percentage).join(' ')})`;
      case COLOR_SPACES.hwb:
        return `hwb(${first} ${rest.map(percentage).join(' ')})`;
      case COLOR_SPACES.lch:
        return `lch(${percentage(first)} ${rest.join(' ')})`;
      case COLOR_SPACES.oklch:
        return `oklch(${components.join(' ')})`;
      // These color spaces are cartesian:
      case COLOR_SPACES.lab:
        return `lab(${percentage(first)} ${rest.join(' ')})`;
      case COLOR_SPACES.oklab:
        return `oklab(${components.join(' ')})`;
      // These color spaces are cartesian and have components encoded as [ 0.0 - 1.0, 0.0 - 1.0 , 0.0 - 1.0 ]
      case COLOR_SPACES.srgb:
      case COLOR_SPACES['display-p3']:
      case COLOR_SPACES['a98-rgb']:
      case COLOR_SPACES['prophoto-rgb']:
      case COLOR_SPACES.rec2020:
      case COLOR_SPACES['xyz-d50']:
      case COLOR_SPACES['xyz-d65']:
      default:
        // Assume a missing color space is also cartesian
        return `color(${colorSpace} ${components.join(' ')})`;
    }
  }
}
