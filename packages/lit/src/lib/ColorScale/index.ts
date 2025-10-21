import {
  createHelperElement,
  isColorTokenOkLCh,
  getCSSColorFunction,
  type ColorComponents,
  type ColorSpace,
  type ColorToken,
  type ColorTokenOkLCh,
} from './lib';

export default class ColorScale {
  static #helperElement = createHelperElement();

  #from: ColorToken;
  #fromOkLCh: ColorTokenOkLCh;
  #derived: ColorToken[] = [];
  #derivedOkLCh: ColorTokenOkLCh[] = [];
  #size: number = 12;

  constructor(from: ColorToken) {
    this.#from = from;
    this.#fromOkLCh = ColorScale.tokenToOKLCH(from);
  }

  get from() {
    return this.#from;
  }

  set from(value: ColorToken) {
    this.#from = value;
    this.#fromOkLCh = ColorScale.tokenToOKLCH(value);
    this.#derivedOkLCh = [this.#fromOkLCh];
    this.#derived = this.#derivedOkLCh.map((token) => token); // Convert back to `this.from` color space
  }

  get fromOkLCh() {
    return this.#fromOkLCh;
  }

  get size() {
    return this.#size;
  }

  list() {
    return this.#derived;
  }

  get(index: number) {
    return this.#derived[index];
  }

  static tokenToOKLCH(token: ColorToken): ColorTokenOkLCh {
    // No conversion needed if already in OKLCH color space.
    if (isColorTokenOkLCh(token)) {
      return token;
    }
    const { $value, ...rest } = token;
    const components = ColorScale.#convertColorToOKLCH($value);
    return {
      ...rest,
      $value: {
        ...$value,
        colorSpace: 'oklch',
        components,
      },
    };
  }

  static #convertColorToOKLCH({
    colorSpace,
    components,
  }: {
    colorSpace: ColorSpace;
    components: ColorComponents;
  }): ColorComponents {
    const helperElement = ColorScale.#helperElement;
    if (!helperElement) throw new Error('Cannot run outside of the browser');
    const color = getCSSColorFunction({ colorSpace, components });
    // Use CSS to render original token color in OkLCh color space
    helperElement.style.color = `oklch(from ${color} l c h)`;
    // Then get the computed value in OkLCh
    const value = getComputedStyle(helperElement).color;

    const [l, c, h] = value.match(/(\d+\.?\d*)/g)?.map(Number) || [NaN, NaN, NaN];
    console.log(`oklch(from ${color} l c h)`, value);
    if (isNaN(l) || isNaN(c) || isNaN(h)) {
      throw new Error("Couldn't get color components");
    }
    return [l, c, h];
  }
}
