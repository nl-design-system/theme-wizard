import { BrandSchema } from '@nl-design-system-community/design-tokens-schema';
import { beforeEach, describe, expect, it } from 'vitest';
import { page } from 'vitest/browser';
import './index';

const tag = 'wizard-colorscale-input';

describe(`<${tag}>`, () => {
  beforeEach(() => {
    document.body.innerHTML = `<${tag}></${tag}>`;
  });

  it('shows a color element', () => {
    const element = document.querySelector(tag);
    const color = element?.shadowRoot?.querySelector('input[type=color]') || undefined;
    expect(color).toBeDefined();
  });

  it('shows a list of colors', () => {
    const element = document.querySelector(tag);
    const output = element?.shadowRoot?.querySelector('output');
    expect(output?.childNodes.length).toBeGreaterThan(1);
  });

  it('value corresponds to valid token schema', () => {
    const element = document.querySelector(tag);
    const value = element?.value;
    expect(BrandSchema.safeParse(value)).toBeTruthy();
  });

  it('value updates when color changes', async () => {
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
