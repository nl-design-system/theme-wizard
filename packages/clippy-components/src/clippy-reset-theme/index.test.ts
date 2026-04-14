import { afterEach, assert, describe, expect, it } from 'vitest';
import type { ClippyResetTheme } from './index';
import './index';

const tag = 'clippy-reset-theme';

describe(`<${tag}>`, () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('registers as a custom element', () => {
    expect(customElements.get(tag)).toBeDefined();
  });

  it('renders element', () => {
    document.body.innerHTML = `<${tag}></${tag}>`;
    const element = document.querySelector(tag);
    expect(element).toBeTruthy();
  });

  it('has a shadow root', () => {
    document.body.innerHTML = `<${tag}></${tag}>`;
    const element = document.querySelector(tag);
    expect(element?.shadowRoot).toBeTruthy();
  });

  it('has a slot in the shadow root', async () => {
    document.body.innerHTML = `<${tag}></${tag}>`;
    const component = document.querySelector(tag) as ClippyResetTheme;
    await component.updateComplete;
    const slot = component.shadowRoot?.querySelector('slot');
    expect(slot).toBeTruthy();
  });

  it('renders slotted content', async () => {
    document.body.innerHTML = `<${tag}><span>Hello</span></${tag}>`;
    const component = document.querySelector(tag) as ClippyResetTheme;
    await component.updateComplete;
    const span = document.querySelector(`${tag} span`);
    expect(span?.textContent).toBe('Hello');
  });

  it('applies reset-theme stylesheet on connect', async () => {
    document.body.innerHTML = `<${tag}></${tag}>`;
    const component = document.querySelector(tag) as ClippyResetTheme;
    await component.updateComplete;
    expect(component.shadowRoot?.adoptedStyleSheets.length).toBeGreaterThan(0);
  });

  it('clears stylesheets on disconnect', async () => {
    document.body.innerHTML = `<${tag}></${tag}>`;
    const component = document.querySelector(tag) as ClippyResetTheme;
    await component.updateComplete;
    expect(component.shadowRoot?.adoptedStyleSheets.length).toBeGreaterThan(0);

    document.body.innerHTML = '';
    expect(component.shadowRoot?.adoptedStyleSheets.length).toBe(0);
  });

  it('reset stylesheet sets CSS custom properties to initial', async () => {
    document.body.innerHTML = `<${tag}></${tag}>`;
    const component = document.querySelector(tag) as ClippyResetTheme;
    await component.updateComplete;

    const stylesheet = component.shadowRoot?.adoptedStyleSheets[0];
    assert(stylesheet instanceof CSSStyleSheet);
    const cssText = [...stylesheet.cssRules].map((r) => r.cssText).join('');
    expect(cssText).toContain('initial');
  });
});
