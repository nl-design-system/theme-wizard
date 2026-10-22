import { afterEach, assert, describe, expect, it } from 'vitest';
import type { ClippyThemeProvider } from './index';
import './index';

const tag = 'clippy-theme-provider';

async function setup() {
  document.body.innerHTML = `<${tag}></${tag}>`;
  const component = document.querySelector(tag) as ClippyThemeProvider;
  await component.updateComplete;
  return component;
}

// The component's own stylesheet (as opposed to its static `display: block` styles) is the
// last one adopted - it's pushed in `connectedCallback`, after Lit adopts `static styles`.
function themeStylesheetOf(component: ClippyThemeProvider): CSSStyleSheet {
  const stylesheet = component.shadowRoot?.adoptedStyleSheets.at(-1);
  assert(stylesheet instanceof CSSStyleSheet);
  return stylesheet;
}

describe(`<${tag}>`, () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('registers as a custom element', () => {
    expect(customElements.get(tag)).toBeDefined();
  });

  it('renders element', async () => {
    const component = await setup();
    expect(component).toBeTruthy();
  });

  it('has a shadow root', async () => {
    const component = await setup();
    expect(component.shadowRoot).toBeTruthy();
  });

  it('has a slot in the shadow root', async () => {
    const component = await setup();
    const slot = component.shadowRoot?.querySelector('slot');
    expect(slot).toBeTruthy();
  });

  it('renders slotted content', async () => {
    document.body.innerHTML = `<${tag}><span>Hello</span></${tag}>`;
    const component = document.querySelector(tag) as ClippyThemeProvider;
    await component.updateComplete;
    const span = document.querySelector(`${tag} span`);
    expect(span?.textContent).toBe('Hello');
  });

  it('adopts its static styles and its own theme stylesheet on connect', async () => {
    const component = await setup();
    expect(component.shadowRoot?.adoptedStyleSheets.length).toBe(2);
  });

  it('removes only its own stylesheet on disconnect, keeping static styles', async () => {
    const component = await setup();
    const ownStylesheet = themeStylesheetOf(component);
    document.body.innerHTML = '';
    expect(component.shadowRoot?.adoptedStyleSheets).not.toContain(ownStylesheet);
    expect(component.shadowRoot?.adoptedStyleSheets.length).toBe(1);
  });

  it('sets a CSS custom property for each token when `theme` is assigned', async () => {
    const component = await setup();
    component.theme = { color: { red: { $type: 'color', $value: '#f00' } } };
    await component.updateComplete;

    const stylesheet = themeStylesheetOf(component);
    const cssText = [...stylesheet.cssRules].map((r) => r.cssText).join('');
    expect(cssText).toContain('--color-red: #f00;');
  });

  it('updates custom properties when `theme` changes', async () => {
    const component = await setup();
    component.theme = { color: { $type: 'color', $value: 'red' } };
    await component.updateComplete;

    component.theme = { color: { $type: 'color', $value: 'blue' } };
    await component.updateComplete;

    const stylesheet = themeStylesheetOf(component);
    const cssText = [...stylesheet.cssRules].map((r) => r.cssText).join('');
    expect(cssText).toContain('--color: blue;');
    expect(cssText).not.toContain('red');
  });

  it('resolves `{a.b.c}` token references to `var(--a-b-c)`', async () => {
    const component = await setup();
    component.theme = {
      color: {
        brand: { $type: 'color', $value: '{color.red}' },
        red: { $type: 'color', $value: '#f00' },
      },
    };
    await component.updateComplete;

    const stylesheet = themeStylesheetOf(component);
    const cssText = [...stylesheet.cssRules].map((r) => r.cssText).join('');
    expect(cssText).toContain('--color-brand: var(--color-red);');
  });

  it('accepts a theme as a JSON string attribute', async () => {
    document.body.innerHTML = `<${tag} theme='{"color":{"red":{"$type":"color","$value":"#f00"}}}'></${tag}>`;
    const component = document.querySelector(tag) as ClippyThemeProvider;
    await component.updateComplete;

    expect(component.theme).toEqual({ color: { red: { $type: 'color', $value: '#f00' } } });

    const stylesheet = themeStylesheetOf(component);
    const cssText = [...stylesheet.cssRules].map((r) => r.cssText).join('');
    expect(cssText).toContain('--color-red: #f00;');
  });
});
