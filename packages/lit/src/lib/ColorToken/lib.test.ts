import { afterEach, describe, expect, test } from 'vitest';
import { createHelperElement, getCSSColorComponents, getHue } from './lib';

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

describe('ColorToken/getHue', () => {
  [
    { name: 'red', hue: 0, rgb: [1, 0, 0] },
    { name: 'green', hue: 120, rgb: [0, 1, 0] },
    { name: 'blue', hue: 240, rgb: [0, 0, 1] },
    { name: 'yellow', hue: 60, rgb: [1, 1, 0] },
    { name: 'cyan', hue: 180, rgb: [0, 1, 1] },
    { name: 'magenta', hue: 300, rgb: [1, 0, 1] },
  ].forEach(({ name, hue, rgb: [r, g, b] }) =>
    test(`can get hue degree of ${name}`, () => {
      const value = getHue([r, g, b]);
      expect(value.toFixed(1)).toBe(hue.toFixed(1));
    }),
  );
});
