import { afterEach, describe, expect, test } from 'vitest';
import { createHelperElement, getCSSColorComponents, getHue, toHSL, toHWB } from './lib';

describe('ColorToken/createHelperElement', () => {
  afterEach(() => {
    for (const el of Array.from(document.querySelectorAll('[data-test-id=helper]'))) {
      el.remove();
    }
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

describe('ColorToken/getCSSColorComponents', () => {
  const testScenarios = [
    {
      name: 'extracts all numeric values',
      input: 'color(srgb 0 0 0)',
      result: '0,0,0',
    },
    {
      name: 'ignores numbers in color spaces',
      input: 'color(rec2020 0 0 0)',
      result: '0,0,0',
    },
    {
      name: 'maps to canonical values',
      input: 'color(srgb 0 0.0 .0)',
      result: '0,0,0',
    },
    {
      name: 'supports negative values',
      input: 'color(srgb -1 -1 -1)',
      result: '-1,-1,-1',
    },
    {
      name: 'supports negative values',
      input: `color(srgb 1e3 -1e-3 -0)`,
      result: '1000,-0.001,0',
    },
  ];

  for (const { name, input, result } of testScenarios) {
    test(name, () => {
      const components = getCSSColorComponents(input);
      expect(components.toString()).toBe(result);
    });
  }
});

const colorScenarios = [
  { name: 'red', hsl: [0, 100, 50], hwb: [0, 0, 0], rgb: [1, 0, 0] },
  { name: 'green', hsl: [120, 100, 50], hwb: [120, 0, 0], rgb: [0, 1, 0] },
  { name: 'blue', hsl: [240, 100, 50], hwb: [240, 0, 0], rgb: [0, 0, 1] },
  { name: 'darkred', hsl: [0, 100, 25], hwb: [0, 0, 50], rgb: [0.5, 0, 0] },
  { name: 'darkgreen', hsl: [120, 100, 25], hwb: [120, 0, 50], rgb: [0, 0.5, 0] },
  { name: 'darkblue', hsl: [240, 100, 25], hwb: [240, 0, 50], rgb: [0, 0, 0.5] },
  { name: 'grayred', hsl: [0, 50, 50], hwb: [0, 25, 25], rgb: [0.75, 0.25, 0.25] },
  { name: 'graygreen', hsl: [120, 50, 50], hwb: [120, 25, 25], rgb: [0.25, 0.75, 0.25] },
  { name: 'grayblue', hsl: [240, 50, 50], hwb: [240, 25, 25], rgb: [0.25, 0.25, 0.75] },
];

describe('ColorToken/getHue', () => {
  for (const { name, hsl: [hue], rgb: [r, g, b] } of colorScenarios) {
    test(`can get hue degree of ${name}`, () => {
      const value = getHue([r, g, b]);
      expect(value.toFixed(1)).toBe(hue.toFixed(1));
    });
  }
});

describe('ColorToken/toHSL', () => {
  for (const { name, hsl, rgb: [r, g, b] } of colorScenarios) {
    test(`can convert RGB ${name} to HSL `, () => {
      const value = toHSL([r, g, b]);
      expect(value).toStrictEqual(hsl);
    });
  }
});

describe('ColorToken/toHWB', () => {
  for (const { name, hwb, rgb: [r, g, b] } of colorScenarios) {
    test(`can convert RGB ${name} to HWB `, () => {
      const value = toHWB([r, g, b]);
      expect(value).toStrictEqual(hwb);
    });
  }
});
