import { colorTokenValueToColorJS, ColorValue } from '@nl-design-system-community/design-tokens-schema';
import './index';
import { describe, expect, it, afterEach, beforeEach } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import { tokenCollection } from './fixtures';

const tag = 'clippy-token-table-color';

type ComponentElement = { shadowRoot: ShadowRoot; updateComplete: Promise<boolean> };

function getComponent() {
  return document.querySelector(tag) as unknown as ComponentElement;
}

const labels = [
  'example-label',
  'value-label',
  'reference-title-label',
  'background-label',
  'border-label',
  'foreground-label',
];

describe(`<${tag}>`, () => {
  beforeEach(() => {
    document.body.innerHTML = `<${tag} collection=${JSON.stringify(tokenCollection)}></${tag}>`;
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('renders', async () => {
    const component = getComponent();
    await component.updateComplete;

    expect(component.shadowRoot.querySelector('table')).toBeTruthy();
  });

  it('has three table headers with aria-hidden', async () => {
    const component = getComponent();
    await component.updateComplete;
    const headers = component.shadowRoot.querySelectorAll('th[aria-hidden]');
    expect(headers).toHaveLength(3);
  });

  it('has 14 table headers with scope="col"', async () => {
    const component = getComponent();
    await component.updateComplete;
    const headers = component.shadowRoot.querySelectorAll('th[scope="col"]');
    expect(headers).toHaveLength(14);
  });

  it('has 2 table headers with scope="row"', async () => {
    const component = getComponent();
    await component.updateComplete;
    const headers = component.shadowRoot.querySelectorAll('th[scope="row"]');
    expect(headers).toHaveLength(2);

    // Verify that the row headers have the correct text content
    tokenCollection.forEach((group, index) => {
      expect(headers[index].textContent.replace(/[\n\r]+|\s{2,}/g, ' ').trim()).toBe(group.name.split('.').pop());
    });
  });

  it('the first row in table body has 14 clippy-color-sample elements', async () => {
    const component = getComponent();
    await component.updateComplete;
    const samples = component.shadowRoot.querySelectorAll('tbody tr:first-child button clippy-color-sample');
    expect(samples).toHaveLength(14);

    // Verify that each color sample matches the corresponding color entry
    tokenCollection[0].tokens.forEach((token, index) => {
      const sample = samples[index];
      const color = colorTokenValueToColorJS(token.$value as ColorValue);
      expect(sample).toBeTruthy();
      expect(sample.getAttribute('color')).toBe(color.toString({ format: 'hex' }));
    });
  });

  it.each(labels)('the %s is displayed correctly', async (label) => {
    document.body.innerHTML = `<${tag} collection=${JSON.stringify(tokenCollection)} ${label}="${label} label"></${tag}>`;
    const component = getComponent();
    await component.updateComplete;
    const exampleLabelElement = component.shadowRoot.querySelector(`[data-testid="${label}"]`);
    expect(exampleLabelElement).toBeTruthy();
    expect(exampleLabelElement?.textContent).toBe(`${label} label`);
  });

  it('the reference-empty-label is displayed correctly', async () => {
    document.body.innerHTML = `<${tag} collection=${JSON.stringify(tokenCollection)} reference-empty-label="Reference empty label"></${tag}>`;
    const component = getComponent();
    await component.updateComplete;

    const buttonWithNoReferences = page.getByRole('button', { name: 'basis.color.default.color-hover' });
    await userEvent.click(buttonWithNoReferences);

    const exampleLabelElement = component.shadowRoot.querySelector('[data-testid="reference-empty-label"]');
    expect(exampleLabelElement).toBeTruthy();
    expect(exampleLabelElement?.textContent).toBe('Reference empty label');
  });
});
