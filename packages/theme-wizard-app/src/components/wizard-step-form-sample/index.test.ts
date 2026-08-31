import '.';
import { type BaseDesignToken, stringifyToken } from '@nl-design-system-community/design-tokens-schema';
import { beforeEach, describe, expect, it } from 'vitest';
import type { WizardStepFormSample } from '.';

const tag = 'wizard-step-form-sample';

const colorToken: BaseDesignToken = {
  $type: 'color',
  $value: { alpha: 1, colorSpace: 'srgb', components: [0.8, 0.1, 0.1] },
};

const fontFamilyToken: BaseDesignToken = {
  $type: 'fontFamily',
  $value: 'sans-serif',
};

const mount = async (token: BaseDesignToken | undefined, path: string) => {
  document.body.innerHTML = `<${tag} path="${path}"></${tag}>`;
  const el = document.querySelector(tag) as WizardStepFormSample;
  if (token) {
    el.token = token;
  }
  await el.updateComplete;
  return el;
};

describe(`<${tag}>`, () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('registers itself as a custom element', () => {
    expect(customElements.get(tag)).toBeTruthy();
  });

  it('renders nothing without a token', async () => {
    const el = await mount(undefined, 'basis.color.default.color-document');
    expect(el.shadowRoot?.textContent?.trim()).toBe('');
  });

  it('renders a heading preview for heading paths', async () => {
    const el = await mount(colorToken, 'basis.heading.color');
    expect(el.shadowRoot?.querySelector('clippy-heading')).toBeTruthy();
  });

  it('renders a heading preview for heading paths with a fontFamily token', async () => {
    const el = await mount(fontFamilyToken, 'basis.heading.fontFamily');
    expect(el.shadowRoot?.querySelector('clippy-heading')).toBeTruthy();
  });

  it('renders a button preview for action-1-inverse color paths', async () => {
    const el = await mount(colorToken, 'basis.color.accent-1-inverse.action-1-inverse');
    expect(el.shadowRoot?.querySelector('clippy-button')).toBeTruthy();
  });

  it('does not render a button preview for a non-color token on an action-1-inverse path', async () => {
    const el = await mount(fontFamilyToken, 'basis.color.accent-1-inverse.action-1-inverse');
    expect(el.shadowRoot?.querySelector('clippy-button')).toBeFalsy();
  });

  it('renders a link preview for action-2 color paths', async () => {
    const el = await mount(colorToken, 'basis.color.accent-2.action-2.color-default');
    expect(el.shadowRoot?.querySelector('a.nl-link')).toBeTruthy();
  });

  it.each([
    ['negative-inverse', 'utrecht-alert--error'],
    ['warning-inverse', 'utrecht-alert--warning'],
    ['positive-inverse', 'utrecht-alert--ok'],
    ['info-inverse', 'utrecht-alert--info'],
  ])('renders a %s alert preview for its matching path segment', async (segment, modifierClass) => {
    const el = await mount(colorToken, `basis.color.${segment}.bg-default`);
    const alert = el.shadowRoot?.querySelector('.utrecht-alert');
    expect(alert?.classList.contains(modifierClass)).toBe(true);
  });

  it('falls back to a color swatch sample for unmatched color paths', async () => {
    const el = await mount(colorToken, 'basis.color.default.bg-subtle');
    const sample = el.shadowRoot?.querySelector('clippy-token-sample-text');
    expect(sample?.getAttribute('color')).toBe(stringifyToken(colorToken));
  });

  it('falls back to a font sample for unmatched fontFamily paths', async () => {
    const el = await mount(fontFamilyToken, 'basis.text.font-family-default');
    const sample = el.shadowRoot?.querySelector('clippy-token-sample-text');
    expect(sample?.getAttribute('font-family')).toBe('sans-serif');
  });
});
