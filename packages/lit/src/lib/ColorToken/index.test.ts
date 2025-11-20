import { COLOR_SPACES, type ColorToken as ColorTokenType } from '@nl-design-system-community/design-tokens-schema';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import ColorToken, { ColorComponents } from './index';

const greenSRGB: ColorTokenType = {
  $type: 'color',
  $value: {
    alpha: 1,
    colorSpace: 'srgb',
    components: [0, 0.5058823529411764, 0.12156862745098039],
  },
};

const greenOKLCH: ColorTokenType = {
  ...greenSRGB,
  $value: {
    ...greenSRGB.$value,
    colorSpace: 'oklch',
    components: [0.524144, 0.165652, 144.827],
  },
};

const invalidColor = 'rgba(0, 0, 0, 0)';

const setSwatch = (color: string) => {
  const swatch = document.querySelector('[data-test-id=swatch]');
  if (swatch instanceof HTMLElement) {
    swatch.style.backgroundColor = color;
  }
};

const getSwatch = () => {
  const swatch = document.querySelector('[data-test-id=swatch]');
  return swatch instanceof HTMLElement && getComputedStyle(swatch).backgroundColor;
};

const createSwatchElement = () => {
  const canRunInBrowser = CSS?.supports('color', 'oklch(from red l c h');
  if (!canRunInBrowser) return;

  const swatch = document.createElement('div');
  swatch.style.display = 'none';
  document.body.appendChild(swatch);
  swatch?.setAttribute('data-test-id', 'swatch');
  setSwatch('none');
};

const removeSwatchElements = () => {
  document.querySelectorAll('[data-test-id=swatch]').forEach((el) => el.remove());
};

/**
 * Test creation of a CSS color declaration from a specific color space.
 * This is done in-browser, and is leaning on relative colors.
 * If the color function is invalid CSS, then the relative color will fail,
 * and the resulting computed style will be `rgba(0, 0, 0, 0)`.
 */
describe('ColorToken', () => {
  it('can be initialized with a scraped color token', () => {
    const colorToken = new ColorToken(greenSRGB);
    expect(colorToken).toBeDefined();
  });

  it('matches initialization token', () => {
    const colorToken = new ColorToken(greenSRGB);
    expect(colorToken.toObject()).toMatchObject(greenSRGB);
  });

  describe('toCSSColorFunction()', () => {
    it('returns correct value for example srgb token', () => {
      const colorToken = new ColorToken(greenSRGB);
      const colorFunction = colorToken.toCSSColorFunction();
      expect(colorFunction).toBe('color(srgb 0 0.5058823529411764 0.12156862745098039)');
    });
    it('returns correct value for example oklch token', () => {
      const colorToken = new ColorToken(greenOKLCH);
      const colorFunction = colorToken.toCSSColorFunction();
      expect(colorFunction).toBe('oklch(0.524144 0.165652 144.827)');
    });
  });

  describe('toColorSpace()', () => {
    Object.values(COLOR_SPACES).forEach((destination) => {
      it(`returns new ColorToken in ${destination} color space`, () => {
        const token = new ColorToken(greenSRGB);
        const newToken = token.toColorSpace(destination);
        expect(newToken.$value.colorSpace).toBe(destination);
      });
    });

    it('returns new ColorToken if destination color space is same as source', () => {
      const token = new ColorToken(greenSRGB);
      const newToken = token.toColorSpace(token.$value.colorSpace);
      // Values are the same
      expect(token.toObject()).toMatchObject(newToken.toObject());
      // But the token is a new token, ie not a shared reference
      expect(token).not.toBe(newToken);
    });

    const token = new ColorToken(greenSRGB);
    Object.values(COLOR_SPACES).forEach((destination) => {
      it(`ColorToken converted to ${destination} and back returns closely matching values`, () => {
        const roundTripToken = new ColorToken(greenSRGB).toColorSpace(destination).toColorSpace('srgb');
        token.$value.components.every((value, index) =>
          // transformation is inherently lossy so therefore the precision is quite low
          expect(value).toBeCloseTo(Number(roundTripToken.$value.components[index]), 1),
        );
      });
    });
  });

  describe('getCSSColorFunction()', () => {
    beforeEach(createSwatchElement);
    afterEach(removeSwatchElements);

    const components: ColorComponents = [1, 1, 1];

    Object.values(COLOR_SPACES).forEach((colorSpace) => {
      it(`supports ${colorSpace}`, () => {
        const colorFunction = ColorToken.getCSSColorFunction({ colorSpace, components });
        setSwatch(`rgb(from ${colorFunction} r g b`);
        expect(getSwatch()).not.toBe(invalidColor);
      });
    });
  });

  describe('getRelativeColorFunction()', () => {
    beforeEach(createSwatchElement);
    afterEach(removeSwatchElements);

    const components: ColorComponents = [1, 1, 1];
    Object.values(COLOR_SPACES).forEach((destination) => {
      Object.values(COLOR_SPACES).forEach((colorSpace) => {
        it(`supports from ${colorSpace} to ${destination}`, () => {
          const colorFunction = ColorToken.getRelativeColorFunction(destination, { colorSpace, components });
          setSwatch(colorFunction);
          expect(getSwatch()).not.toBe(invalidColor);
        });
      });
    });
  });
});
