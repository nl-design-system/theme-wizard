import type { ColorToken } from '@nl-design-system-community/css-scraper';

type ColorTokenOkLCh = ColorToken & {
  $value: ColorToken['$value'] & {
    colorSpace: 'oklch';
  };
};

export default class ColorScale {
  #from: ColorToken;
  #fromOkLCh: ColorTokenOkLCh;
  #derived: ColorToken[] = [];
  #derivedOkLCh: ColorTokenOkLCh[] = [];

  #size: number = 12;

  constructor(from: ColorToken) {
    this.#from = from;
    this.#fromOkLCh = from; // Convert to OkLCh
  }

  get from() {
    return this.#from;
  }

  set from(value: ColorToken) {
    this.#from = value;
    this.#fromOkLCh = value; // Convert to OkLCh
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
}
