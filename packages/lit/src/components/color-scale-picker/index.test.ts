import { beforeEach, describe, expect, test } from 'vitest';
import { BrandSchema } from '@nl-design-system-community/design-tokens-schema'
import './index';

const tag = 'color-scale-picker';

describe(`<${tag}>`, () => {
  beforeEach(() => {
    document.body.innerHTML = `<${tag}></${tag}>`;
  });

  test('shows a color element', () => {
    const element = document.querySelector(tag);
    const color = element?.shadowRoot?.querySelector('input[type=color]');
    expect(color).toBeDefined();
  });

  test('shows a list of colors', () => {
    const element = document.querySelector(tag);
    const output = element?.shadowRoot?.querySelector('output');
    expect(output?.childNodes.length).toBeGreaterThan(1);
  });

  test('value corresponds to valid token schema', () => {
    const element = document.querySelector(tag);
    const value = element?.value;
    expect(BrandSchema.safeParse(value)).toBeTruthy();
  });
});
