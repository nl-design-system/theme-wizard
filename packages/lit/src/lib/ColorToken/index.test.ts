import type { ColorToken as ScrapedColorToken } from '@nl-design-system-community/css-scraper';
import { afterEach, beforeEach, describe, expect, test } from 'vitest';
import ColorToken, { ColorComponents, ColorSpace } from './index';

const greenSRGB: ScrapedColorToken = {
  $extensions: {
    'nl.nldesignsystem.theme-wizard.css-authored-as': '#00811f',
    'nl.nldesignsystem.theme-wizard.css-properties': ['color', 'background-color'],
    'nl.nldesignsystem.theme-wizard.token-id': 'green-d70ab7a9',
    'nl.nldesignsystem.theme-wizard.usage-count': 5,
  },
  $type: 'color',
  $value: {
    alpha: 1,
    colorSpace: 'srgb',
    components: [0, 0.5058823529411764, 0.12156862745098039],
  },
};

const greenOkLCh: ScrapedColorToken = {
  ...greenSRGB,
  $value: {
    ...greenSRGB.$value,
    colorSpace: 'oklch',
    components: [0.524144, 0.165652, 144.827],
  },
};

/**
 * Test creation of a CSS color declaration from a specific color space.
 * This is done in-browser, and is leaning on relative colors.
 * If the color function is invalid CSS, then the relative color will fail,
 * and the resulting computed style will be `rgba(0, 0, 0, 0)`.
 */
describe('ColorToken', () => {
  test('can be initialized with a scraped color token', () => {
    const colorToken = new ColorToken(greenSRGB);
    expect(colorToken).toBeDefined();
  });

  test('matches initialization token', () => {
    const colorToken = new ColorToken(greenSRGB);
    expect(colorToken).toMatchObject(greenSRGB);
  });

  describe('toCSSColorFunction()', () => {
    test('returns correct value for example srgb token', () => {
      const colorToken = new ColorToken(greenSRGB);
      const colorFunction = colorToken.toCSSColorFunction();
      expect(colorFunction).toBe('color(srgb 0 0.5058823529411764 0.12156862745098039)');
    });
    test('returns correct value for example oklch token', () => {
      const colorToken = new ColorToken(greenOkLCh);
      const colorFunction = colorToken.toCSSColorFunction();
      expect(colorFunction).toBe('oklch(0.524144 0.165652 144.827)');
    });
  });

  describe('toCSSColorFunction()', () => {
    test('returns correct srgb value for example token', () => {
      const colorToken = new ColorToken(greenSRGB);
      const colorFunction = colorToken.toCSSColorFunction();
      expect(colorFunction).toBe('color(srgb 0 0.5058823529411764 0.12156862745098039)');
    });
  });

  describe('getCSSColorFunction()', () => {
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

    beforeEach(() => {
      const canRunInBrowser = CSS?.supports('color', 'oklch(from red l c h');
      if (!canRunInBrowser) return;

      const swatch = document.createElement('div');
      swatch.style.display = 'none';
      document.body.appendChild(swatch);
      swatch?.setAttribute('data-test-id', 'swatch');
      setSwatch('none');
    });

    afterEach(() => {
      document.querySelectorAll('[data-test-id=swatch]').forEach((el) => el.remove());
    });

    const components: ColorComponents = [1, 1, 1];
    const colorSpaces: ColorSpace[] = [
      // Polar
      'hsl',
      'hwb',
      'lch',
      'oklch',
      // Cartesian
      'lab',
      'oklab',
      // Cartesian 0-1
      'srgb',
      'display-p3',
      'a98-rgb',
      'prophoto-rgb',
      'rec2020',
      'xyz-d50',
      'xyz-d65',
    ];
    colorSpaces.forEach((colorSpace) => {
      test(`supports ${colorSpace}`, () => {
        const colorFunction = ColorToken.getCSSColorFunction({ colorSpace, components });
        setSwatch(`rgb(from ${colorFunction} r g b`);
        expect(getSwatch()).not.toBe(invalidColor);
      });
    });
  });
});
