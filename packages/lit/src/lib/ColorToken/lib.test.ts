import { afterEach, describe, expect, test } from 'vitest';
import { createHelperElement, getCSSColorComponents } from './lib';

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
