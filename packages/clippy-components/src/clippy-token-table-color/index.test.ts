import { describe, expect, it, afterEach, beforeEach } from 'vitest';
import './index';
import { colorGroups } from './fixtures';

const tag = 'clippy-token-table-color';

type ComponentElement = { shadowRoot: ShadowRoot; updateComplete: Promise<boolean> };

function getComponent() {
  return document.querySelector(tag) as unknown as ComponentElement;
}

describe(`<${tag}>`, () => {
  beforeEach(() => {
    console.log('=== colorGroups', colorGroups);
    document.body.innerHTML = `<${tag} groups=${JSON.stringify(colorGroups)}></${tag}>`;
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
    const headers = component.shadowRoot.querySelectorAll('th[aria-hidden]');
    expect(headers).toHaveLength(3);
  });

  it('has 14 table headers with scope="col"', () => {
    const component = getComponent();
    const headers = component.shadowRoot.querySelectorAll('th[scope="col"]');
    expect(headers).toHaveLength(14);
  });

  it('has 2 table headers with scope="row"', () => {
    const component = getComponent();
    const headers = component.shadowRoot.querySelectorAll('th[scope="row"]');
    expect(headers).toHaveLength(2);

    // Verify that the row headers have the correct text content
    colorGroups.forEach((group, index) => {
      expect(headers[index].textContent.replace(/[\n\r]+|\s{2,}/g, ' ').trim()).toBe(group.key);
    });
  });

  it('the first row in table body has 14 clippy-color-sample elements', () => {
    const component = getComponent();
    const samples = component.shadowRoot.querySelectorAll('tbody tr:first-child clippy-color-sample');
    expect(samples).toHaveLength(14);

    // Verify that each color sample matches the corresponding color entry
    colorGroups[0].colorEntries.forEach((entry, index) => {
      const sample = samples[index];
      expect(sample).toBeTruthy();
      expect(sample.getAttribute('color')).toBe(entry.displayValue);
    });
  });
});
