import { stringifyToken } from '@nl-design-system-community/design-tokens-schema';
import './index';
import { ClippyColorSample } from '@src/clippy-color-sample';
import { ClippyTokenSampleBorder } from '@src/clippy-token-sample-border';
import { ClippyTokenSampleSpacing } from '@src/clippy-token-sample-spacing';
import { ClippyTokenSampleText } from '@src/clippy-token-sample-text';
import { beforeEach, describe, expect, it } from 'vitest';
import type { ClippyTokenDetail } from './index';
import { borderWidthFixture, colorFixture, spacingFixture, textFontSizeFixture } from './fixtures';

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

    await expect.element(component).toBeInTheDocument();
  });

  it('Renders with a color token', async () => {
    component.token = colorFixture;
    await component.updateComplete;
    const colorSample = component.shadowRoot?.querySelector('clippy-color-sample') as ClippyColorSample;

    await expect.element(component).toBeInTheDocument();
    await expect.element(colorSample).toHaveProperty('color', stringifyToken(colorFixture));
  });

  it('Renders with a spacing token', async () => {
    component.token = spacingFixture;
    await component.updateComplete;
    const spacingSample = component.shadowRoot?.querySelector(
      'clippy-token-sample-spacing',
    ) as ClippyTokenSampleSpacing;
    await expect.element(spacingSample).toBeInTheDocument();
    await expect.element(spacingSample).toHaveProperty('size', stringifyToken(spacingFixture));
  });

  it('Renders with a text token', async () => {
    component.token = textFontSizeFixture;
    await component.updateComplete;
    const textSample = component.shadowRoot?.querySelector('clippy-token-sample-text') as ClippyTokenSampleText;
    await expect.element(textSample).toBeInTheDocument();
    expect(textSample.getAttribute('font-size')).toBe(stringifyToken(textFontSizeFixture));
  });

  it('Renders with a border token', async () => {
    component.token = borderWidthFixture;
    await component.updateComplete;
    const borderSample = component.shadowRoot?.querySelector('clippy-token-sample-border') as ClippyTokenSampleBorder;
    await expect.element(borderSample).toBeInTheDocument();
    expect(borderSample.getAttribute('border-width')).toBe(stringifyToken(borderWidthFixture));
  });

  it.each(labels)('the %s is displayed correctly', async (label) => {
    document.body.innerHTML = `<${tag} ${label}="${label} label" token='${JSON.stringify(colorFixture)}'></${tag}>`;
    component = document.querySelector(tag) as ClippyTokenDetail;
    await component.updateComplete;
    const labelElement = component.shadowRoot?.querySelector(`[data-testid="${label}"]`);
    expect(labelElement).toBeTruthy();
    expect(labelElement?.textContent).toBe(`${label} label`);
  });

  it('the reference-empty-label is displayed correctly', async () => {
    document.body.innerHTML = `<${tag} token='${JSON.stringify(spacingFixture)}' reference-empty-label="Reference empty label"></${tag}>`;
    component = document.querySelector(tag) as ClippyTokenDetail;
    await component.updateComplete;

    const exampleLabelElement = component.shadowRoot?.querySelector('[data-testid="reference-empty-label"]');
    expect(exampleLabelElement).toBeTruthy();
    expect(exampleLabelElement?.textContent).toBe('Reference empty label');
  });
});
