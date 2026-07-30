import { beforeEach, describe, expect, it } from 'vitest';
import './index';

const tag = 'wizard-color-system-preview';

describe(`<${tag}>`, () => {
  beforeEach(() => {
    document.body.innerHTML = `<${tag} label=${tag}></${tag}>`;
  });

  it('renders', () => {
    const element = document.querySelector(tag);
    expect(element).toBeTruthy();
  });

  it('displays a clippy-token-color table', () => {
    const element = document.querySelector(tag);
    const table = element?.shadowRoot?.querySelector('clippy-token-color-table');
    expect(table).toBeTruthy();
  });
});
