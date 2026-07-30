import { describe, expect, it, afterEach, beforeEach } from 'vitest';
import './index';

const tag = 'clippy-token-color-table';

type ComponentElement = { shadowRoot: ShadowRoot; updateComplete: Promise<boolean> };

function getComponent() {
  return document.querySelector(tag) as unknown as ComponentElement;
}

describe(`<${tag}>`, () => {
  beforeEach(() => {
    document.body.innerHTML = `<${tag}></${tag}>`;
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('renders', async () => {
    const component = getComponent();
    await component.updateComplete;

    expect(component.shadowRoot.querySelector('table')).toBeTruthy();
  });

  it('has three table headers with aria-hidden', () => {
    const component = getComponent();
    const headers = component.shadowRoot.querySelectorAll('th[aria-hidden="true"]');
    expect(headers.length).toBe(3);
  });

  it('has 14 table headers with scope="col"', () => {
    const component = getComponent();
    const headers = component.shadowRoot.querySelectorAll('th[scope="col"]');
    expect(headers.length).toBe(14);
  });
});
