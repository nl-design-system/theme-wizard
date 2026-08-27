import './index';
import { stringifyToken } from '@nl-design-system-community/design-tokens-schema';
import { ClippyColorSample } from '@src/clippy-color-sample';
import { ClippyTokenSampleBorder } from '@src/clippy-token-sample-border';
import { ClippyTokenSampleSpacing } from '@src/clippy-token-sample-spacing';
import { ClippyTokenSampleText } from '@src/clippy-token-sample-text';
import { beforeEach, describe, expect, it } from 'vitest';
import {
  borderWidthFixture,
  colorFixture,
  incompatibleTokenType,
  spacingFixture,
  textFontSizeFixture,
} from './fixtures';
import { ClippyTokenSample } from './index';

const tag = 'clippy-token-sample';

describe(`<${tag}>`, () => {
  let component: ClippyTokenSample;

  beforeEach(() => {
    document.body.innerHTML = `<${tag}></${tag}>`;
    component = document.querySelector(tag) as ClippyTokenSample;
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

  it('renders nothing with an undefined token', async () => {
    component.token = undefined;
    await component.updateComplete;
    const elements = component.shadowRoot?.querySelectorAll('[data-testid="token-sample-element"]');
    expect(elements?.length).toBeFalsy();
  });

  it('renders nothing with an incompatible token', async () => {
    component.token = incompatibleTokenType;
    await component.updateComplete;
    const elements = component.shadowRoot?.querySelectorAll('[data-testid="token-sample-element"]');
    expect(elements?.length).toBeFalsy();
  });
});
