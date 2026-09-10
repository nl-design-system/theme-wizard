import { stringifyToken } from '@nl-design-system-community/design-tokens-schema';
import './index';
import { ClippyColorSample } from '@src/clippy-color-sample';
import { ClippyTokenSampleBorder } from '@src/clippy-token-sample-border';
import { ClippyTokenSampleSpacing } from '@src/clippy-token-sample-spacing';
import { ClippyTokenSampleText } from '@src/clippy-token-sample-text';
import { getTokenColor } from '@src/lib/tokens';
import { beforeEach, describe, expect, it } from 'vitest';
import type { ClippyTokenDetail } from './index';
import {
  borderWidthFixture,
  colorFixture,
  noTokenPath,
  referenceFixture,
  spacingFixture,
  textFontSizeFixture,
} from './fixtures';

const tag = 'clippy-token-detail';

const labels = ['example-label', 'reference-title-label'];

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
    const color = getTokenColor(colorFixture);
    const colorSample = component.shadowRoot
      ?.querySelector('clippy-token-sample')
      ?.shadowRoot?.querySelector('clippy-color-sample') as ClippyColorSample;
    const oklchElement = component.shadowRoot?.querySelector(
      '[data-testid="token-oklch-value"] [data-testid="definition"]',
    ) as HTMLElement;
    const p3Element = component.shadowRoot?.querySelector(
      '[data-testid="token-p3-value"] [data-testid="definition"]',
    ) as HTMLElement;
    const rgbElement = component.shadowRoot?.querySelector(
      '[data-testid="token-rgb-value"] [data-testid="definition"]',
    ) as HTMLElement;

    await expect.element(component).toBeInTheDocument();
    await expect.element(colorSample).toHaveProperty('color', stringifyToken(colorFixture));
    await expect.element(oklchElement).toHaveTextContent(color?.toString({ format: 'oklch' }) as string);
    await expect.element(p3Element).toHaveTextContent(color?.toString({ format: 'color' }) as string);
    await expect.element(rgbElement).toHaveTextContent(color?.toString({ format: 'rgb' }) as string);
  });

  it('Renders with a spacing token', async () => {
    component.token = spacingFixture;
    await component.updateComplete;
    const spacingSample = component.shadowRoot
      ?.querySelector('clippy-token-sample')
      ?.shadowRoot?.querySelector('clippy-token-sample-spacing') as ClippyTokenSampleSpacing;
    await expect.element(spacingSample).toBeInTheDocument();
    await expect.element(spacingSample).toHaveProperty('size', stringifyToken(spacingFixture));
  });

  it('Renders with a text token', async () => {
    component.token = textFontSizeFixture;
    await component.updateComplete;
    const textSample = component.shadowRoot
      ?.querySelector('clippy-token-sample')
      ?.shadowRoot?.querySelector('clippy-token-sample-text') as ClippyTokenSampleText;
    await expect.element(textSample).toBeInTheDocument();
    expect(textSample.getAttribute('font-size')).toBe(stringifyToken(textFontSizeFixture));
  });

  it('Renders with a border token', async () => {
    component.token = borderWidthFixture;
    await component.updateComplete;
    const borderSample = component.shadowRoot
      ?.querySelector('clippy-token-sample')
      ?.shadowRoot?.querySelector('clippy-token-sample-border') as ClippyTokenSampleBorder;
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

  it('the value-label is displayed correctly', async () => {
    document.body.innerHTML = `<${tag} token='${JSON.stringify(spacingFixture)}' value-label="Value label"></${tag}>`;
    component = document.querySelector(tag) as ClippyTokenDetail;
    await component.updateComplete;

    const termElement = component.shadowRoot?.querySelector('[data-testid="token-value"] [data-testid="term"]');
    expect(termElement).toBeTruthy();
    expect(termElement?.textContent).toBe('Value label');
  });

  it('the reference-empty-label is displayed correctly', async () => {
    document.body.innerHTML = `<${tag} token='${JSON.stringify(spacingFixture)}' reference-empty-label="Reference empty label"></${tag}>`;
    component = document.querySelector(tag) as ClippyTokenDetail;
    await component.updateComplete;

    const exampleLabelElement = component.shadowRoot?.querySelector('[data-testid="reference-empty-label"]');
    expect(exampleLabelElement).toBeTruthy();
    expect(exampleLabelElement?.textContent).toBe('Reference empty label');
  });

  it('the reference-to-label is displayed correctly', async () => {
    document.body.innerHTML = `<${tag} token='${JSON.stringify(referenceFixture)}' reference-to-label="Reference to label"></${tag}>`;
    component = document.querySelector(tag) as ClippyTokenDetail;
    await component.updateComplete;

    const labelLabelElement = component.shadowRoot?.querySelector(
      '[data-testid="reference-to-label"] [data-testid="term"]',
    );
    expect(labelLabelElement).toBeTruthy();
    expect(labelLabelElement?.textContent).toBe('Reference to label');
  });

  it('Renders with a token without a path', async () => {
    component.token = noTokenPath;
    await component.updateComplete;

    const tokenIdElement = component.shadowRoot?.querySelector('[data-testid="token-id"]');
    expect(tokenIdElement).not.toBeInTheDocument();

    const cssVariableElement = component.shadowRoot?.querySelector('[data-testid="css-variable"]');
    expect(cssVariableElement).not.toBeInTheDocument();
  });
});
