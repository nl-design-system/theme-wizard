import { describe, expect, it, afterEach, beforeEach } from 'vitest';
import './index';
import { colorgroups } from './fixtures';

const tag = 'clippy-token-color-table';

type ComponentElement = { shadowRoot: ShadowRoot; updateComplete: Promise<boolean> };

function getComponent() {
  return document.querySelector(tag) as unknown as ComponentElement;
}

describe(`<${tag}>`, () => {
  beforeEach(() => {
    document.body.innerHTML = `<${tag} .groups="${colorgroups}"></${tag}>`;
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

  it('has 2 table headers with scope="row"', () => {
    const component = getComponent();
    const headers = component.shadowRoot.querySelectorAll('th[scope="row"]');
    expect(headers.length).toBe(2);
  });

  it('the first row in table body has 14 clippy-color-sample elements', () => {
    const component = getComponent();
    const samples = component.shadowRoot.querySelectorAll('clippy-color-sample');
    expect(samples.length).toBe(14);
  });
});
