import { afterEach, describe, expect, test } from 'vitest';
import { createHelperElement } from './lib';

describe('ColorToken/createHelperElement', () => {
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
