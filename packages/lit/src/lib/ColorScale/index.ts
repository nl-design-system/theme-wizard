import ColorToken from '../ColorToken';

export default class ColorScale {
  #from: ColorToken;
  #fromOKLCH: ColorToken;
  #derived: ColorToken[] = [];
  #derivedOKLCH: ColorToken[] = [];
  #size: number = 12;

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
    this.#fromOKLCH = token.toColorSpace('oklch');
    this.#derivedOKLCH = [this.#fromOKLCH];
    this.#derived = this.#derivedOKLCH.map((token) => token); // Convert back to `this.from` color space
  }

  get fromOKLCH() {
    return this.#fromOKLCH;
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
}
