import type {
  ColorToken as ScrapedColorToken,
  ColorSpace,
  ColorComponent,
} from '@nl-design-system-community/css-scraper';
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
      case 'hsl':
        return `hsl(${first} ${rest.map(percentage).join(' ')})`;
      case 'hwb':
        return `hwb(${first} ${rest.map(percentage).join(' ')})`;
      case 'lch':
        return `lch(${percentage(first)} ${rest.join(' ')})`;
      case 'oklch':
        return `oklch(${components.join(' ')})`;
      // These color spaces are cartesian:
      case 'lab':
        return `lab(${percentage(first)} ${rest.join(' ')})`;
      case 'oklab':
        return `oklab(${components.join(' ')})`;
      // These color spaces are cartesian and have components encoded as [ 0.0 - 1.0, 0.0 - 1.0 , 0.0 - 1.0 ]
      case 'srgb':
      case 'display-p3':
      case 'a98-rgb':
      case 'prophoto-rgb':
      case 'rec2020':
      case 'xyz-d50':
      case 'xyz-d65':
      default:
        // Assume a missing color space is also cartesian
        return `color(${colorSpace} ${components.join(' ')})`;
    }
  }
}
