import { afterEach, beforeEach, describe, expect, test } from 'vitest';
import { ColorComponents, ColorSpace, createHelperElement, getCSSColorFunction } from './lib';

describe('ColorScale/createHelperElement', () => {
  afterEach(() => {
    document.querySelectorAll('[data-test-id=helper]').forEach((el) => el.remove());
  });

  test('creates a div', () => {
    const helper = createHelperElement();
    helper?.setAttribute('data-test-id', 'helper');
    const createdElement = document.querySelector('[data-test-id=helper]');
    expect(createdElement).toBeDefined();
  });

  test('created div has display:none', () => {
    const helper = createHelperElement();
    helper?.setAttribute('data-test-id', 'helper');
    const createdElement = document.querySelector('[data-test-id=helper]');
    const display = createdElement && getComputedStyle(createdElement).display;
    expect(display).toBe('none');
  });
});

/**
 * Test creation of a CSS color declaration from a specific color space.
 * This is done in-browser, and is leaning on relative colors.
 * If the color function is invalid CSS, then the relative color will fail,
 * and the resulting computed style will be `rgba(0, 0, 0, 0)`.
 */
describe('ColorScale/getCSSColorFunction', () => {
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
    const swatch = createHelperElement();
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
      const colorFunction = getCSSColorFunction({ colorSpace, components });
      setSwatch(`rgb(from ${colorFunction} r g b`);
      expect(getSwatch()).not.toBe(invalidColor);
    });
  });
});
