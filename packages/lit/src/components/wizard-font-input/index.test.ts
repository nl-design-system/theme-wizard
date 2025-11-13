import { beforeEach, describe, expect, test } from 'vitest';
import './index';

const tag = 'wizard-font-input';

describe(`<${tag}>`, () => {
  beforeEach(() => {
    document.body.innerHTML = `<${tag}></${tag}>`;
  });

  test('shows a select element', () => {
    const element = document.querySelector(tag);
    const select = element?.shadowRoot?.querySelector('select');
    expect(select).toBeDefined();
  });

  test('shows a list of common fonts', () => {
    const element = document.querySelector(tag);
    const options = element?.shadowRoot?.querySelectorAll('option');
    expect(options?.length).toBeGreaterThan(1);
  });
});
