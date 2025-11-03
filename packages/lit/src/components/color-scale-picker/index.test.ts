import { BrandSchema } from '@nl-design-system-community/design-tokens-schema';
import { beforeEach, describe, expect, test } from 'vitest';
import { page } from 'vitest/browser';
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

  test('value updates when color changes', async () => {
    const element = document.querySelector(tag);
    /* @ts-expect-error element/shadowroot could be undefined, but it is fine if it would throw */
    const color = page.elementLocator(element?.shadowRoot?.querySelector('input[type=color]'));
    await color.fill('#990000');
    const first = element?.value || {};
    await color.fill('#000099');
    const second = element?.value || {};
    expect(first).not.toMatchObject(second);
  });
});
