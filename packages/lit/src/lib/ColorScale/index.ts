import { COLOR_SPACES, type ColorToken as ColorTokenType } from '@nl-design-system-community/design-tokens-schema';
import ColorToken from '../ColorToken';

export default class ColorScale {
  #from: ColorToken;
  #fromOKLCH: ColorToken;
  #derived: ColorToken[] = [];
  #derivedOKLCH: ColorToken[] = [];
  // Mandatory high to low
  static readonly #lightnessMask = [0.999, 0.97, 0.95, 0.93, 0.91, 0.79, 0.56, 0.52, 0.48, 0.38, 0.32, 0.26, 0.14, 0.1];

  constructor(from: ColorToken) {
    this.from = from;
    // Explicitly set in constructor to satisfy TypeScript
    this.#from = this.from;
    this.#fromOKLCH = this.fromOKLCH;
  }

  get from() {
    return this.#from;
  }

  set from(value: ColorToken) {
    const token = value instanceof ColorToken ? value : new ColorToken(value);
    this.#from = token;
    this.#fromOKLCH = token.toColorSpace(COLOR_SPACES.OKLCH);
    this.#derivedOKLCH = this.#deriveScale();

    this.#derived = this.#derivedOKLCH.map((token) =>
      token === this.fromOKLCH ? this.from : token.toColorSpace(this.from.$value.colorSpace),
    );
  }

  get fromOKLCH() {
    return this.#fromOKLCH;
  }

  get size() {
    return ColorScale.#lightnessMask.length;
  }

  list() {
    return this.#derived;
  }

  get(index: number) {
    return this.#derived[index];
  }

  toObject() {
    return this.#derived.reduce(
      (acc, token, index) => ({
        ...acc,
        [`${index + 1}`]: token.toObject(),
      }),
      {} as Record<string, ColorTokenType>,
    );
  }

  #getNearestIndex(lightness: number) {
    // Find the nearest lightness of the base color.
    let nearestIndex = 0;
    let nearestLightnessDiff = 100;
    ColorScale.#lightnessMask.forEach((value, index) => {
      const diff = Math.abs(value - lightness);
      if (diff < nearestLightnessDiff) {
        nearestLightnessDiff = diff;
        nearestIndex = index;
      }
    });
    return nearestIndex;
  }

  #deriveScale() {
    const [lightness, chroma, hue] = this.#fromOKLCH.$value.components;
    if (lightness === 'none' || chroma === 'none') {
      throw new Error('Lightness or chroma cannot be of value "none"');
    }

    const nearest = this.#getNearestIndex(lightness);

    // Find the chroma decrease
    const chromaDelta = chroma / (nearest + 1);

    return ColorScale.#lightnessMask.map((l, index) => {
      if (index === nearest) {
        // Simply return the initial color
        return this.fromOKLCH;
      } else if (index < nearest) {
        // Reduce chroma each step lighter than the base color.
        const c = chroma - chromaDelta * (nearest - index);
        return new ColorToken({
          $value: {
            alpha: 1,
            colorSpace: COLOR_SPACES.OKLCH,
            components: [l, c, hue],
          },
        });
      } else {
        return new ColorToken({
          $value: {
            alpha: 1,
            colorSpace: COLOR_SPACES.OKLCH,
            components: [l, chroma, hue],
          },
        });
      }
    });
  }
}
