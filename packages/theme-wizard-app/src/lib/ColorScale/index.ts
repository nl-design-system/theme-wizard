import { COLOR_SPACES, type ColorToken as ColorTokenType } from '@nl-design-system-community/design-tokens-schema';
import ColorToken from '../ColorToken';

export default class ColorScale {
  #from: ColorToken;
  #fromOKLCH: ColorToken;
  #derived: ColorToken[] = [];
  #derivedOKLCH: ColorToken[] = [];
  #inverse: boolean = false;
  // Mandatory high to low
  static readonly #lightnessMask = [0.999, 0.97, 0.95, 0.93, 0.91, 0.79, 0.56, 0.52, 0.48, 0.38, 0.32, 0.26, 0.14, 0.1];

  constructor(from: ColorToken) {
    this.from = from;
    // Explicitly set in constructor to satisfy TypeScript
    this.#from = this.from;
    this.#fromOKLCH = this.fromOKLCH;
    this.#inverse = false;
  }

  get from() {
    return this.#from;
  }

  set from(value: ColorToken) {
    const token = value instanceof ColorToken ? value : new ColorToken(value);
    const colorSpace = token.$value.colorSpace;

    this.#from = token;
    this.#fromOKLCH = token.toColorSpace(COLOR_SPACES.OKLCH);
    this.#derivedOKLCH = this.#deriveScale(this.#fromOKLCH);

    this.#derived = this.#derivedOKLCH.map((token) =>
      token === this.fromOKLCH ? this.from : token.toColorSpace(colorSpace),
    );
  }

  get fromOKLCH() {
    return this.#fromOKLCH;
  }

  get size() {
    return ColorScale.#lightnessMask.length;
  }

  set inverse(value: boolean | undefined) {
    this.#inverse = value ?? false;
    // Recalculate derived colors with new inverse setting
    this.#derivedOKLCH = this.#deriveScale(this.#fromOKLCH);
    const colorSpace = this.#from.$value.colorSpace;
    this.#derived = this.#derivedOKLCH.map((token) =>
      token === this.fromOKLCH ? this.from : token.toColorSpace(colorSpace),
    );
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
    for (const [index, value] of ColorScale.#lightnessMask.entries()) {
      const diff = Math.abs(value - lightness);
      if (diff < nearestLightnessDiff) {
        nearestLightnessDiff = diff;
        nearestIndex = index;
      }
    }
    return nearestIndex;
  }

  #deriveScale(token: ColorToken) {
    const [lightness, chroma, hue] = token.$value.components;
    if (lightness === 'none' || chroma === 'none') {
      throw new Error('Lightness or chroma cannot be of value "none"');
    }

    const nearest = this.#getNearestIndex(lightness);

    // Find the chroma decrease
    const chromaDelta = chroma / (nearest + 1);

    const derived = ColorScale.#lightnessMask.map((l, index) => {
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

    // Reverse the derived colors if inverse is true
    return this.#inverse ? [...derived].reverse() : derived;
  }
}
