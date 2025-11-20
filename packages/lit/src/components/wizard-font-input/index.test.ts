import { beforeEach, describe, expect, it } from 'vitest';
import './index';

const tag = 'wizard-font-input';

describe(`<${tag}>`, () => {
  beforeEach(() => {
    document.body.innerHTML = `<${tag}></${tag}>`;
  });

  it('shows a select element', () => {
    const element = document.querySelector(tag);
    const select = element?.shadowRoot?.querySelector('select');
    expect(select).toBeDefined();
  });

  it('shows a list of common fonts', () => {
    const element = document.querySelector(tag);
    const options = element?.shadowRoot?.querySelectorAll('option');
    expect(options?.length).toBeGreaterThan(1);
  });
});
