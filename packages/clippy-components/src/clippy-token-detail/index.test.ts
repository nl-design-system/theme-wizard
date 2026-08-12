import { ClippyColorSample } from '@src/clippy-color-sample';
import { beforeEach, describe, expect, it } from 'vitest';
import './index';
import type { ClippyTokenDetail } from './index';
import { colorFixture } from './fixtures';

const tag = 'clippy-token-detail';

const labels = ['example-label', 'value-label', 'reference-title-label'];

describe(`<${tag}>`, () => {
  let component: ClippyTokenDetail;

  beforeEach(() => {
    document.body.innerHTML = `<${tag}></${tag}>`;
    component = document.querySelector(tag) as ClippyTokenDetail;
  });

  it('renders', async () => {
    await component.updateComplete;
    const noTokenMessage = component.shadowRoot?.querySelector('p') as HTMLParagraphElement;

    await expect.element(component).toBeInTheDocument();
    await expect.element(noTokenMessage).toHaveTextContent('No token provided.');
  });

  it('Render with a color token', async () => {
    component.token = colorFixture;
    await component.updateComplete;
    const colorSample = component.shadowRoot?.querySelector('clippy-color-sample') as ClippyColorSample;

    await expect.element(component).toBeInTheDocument();
    await expect.element(colorSample).toHaveProperty('color', colorFixture.displayValue);
  });

  it.each(labels)('the %s is displayed correctly', async (label) => {
    document.body.innerHTML = `<${tag} ${label}="${label} label" token=${JSON.stringify(colorFixture)}></${tag}>`;
    component = document.querySelector(tag) as ClippyTokenDetail;
    await component.updateComplete;
    const labelElement = component.shadowRoot?.querySelector(`[data-testid="${label}"]`);
    expect(labelElement).toBeTruthy();
    expect(labelElement?.textContent).toBe(`${label} label`);
  });
});
