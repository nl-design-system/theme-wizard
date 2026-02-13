import { BrandSchema } from '@nl-design-system-community/design-tokens-schema';
import { beforeEach, describe, expect, it } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import './index';

const tag = 'wizard-colorscale-input';

describe(`<${tag}>`, () => {
  beforeEach(() => {
    document.body.innerHTML = `<${tag} label=${tag}></${tag}>`;
  });

  it('shows a list of colors', () => {
    const element = document.querySelector(tag);
    const output = element?.shadowRoot?.querySelector('[role=presentation]');
    expect(output?.childNodes.length).toBeGreaterThan(1);
  });

  it('value corresponds to valid token schema', () => {
    const element = document.querySelector(tag);
    const value = element?.value;
    expect(BrandSchema.safeParse(value)).toBeTruthy();
  });

  it('value updates when color changes', async () => {
    const element = document.querySelector(tag);
    const color = page.getByLabelText(tag);
    await color.fill('#990000').then(() => userEvent.keyboard('{Enter}'));
    const first = element?.value || {};
    await color.fill('#000099').then(() => userEvent.keyboard('{Enter}'));
    const second = element?.value || {};
    expect(first).not.toMatchObject(second);
  });
});
