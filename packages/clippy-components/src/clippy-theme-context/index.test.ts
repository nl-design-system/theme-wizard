import { describe, expect, it, afterEach, vi } from 'vitest';
import './index';
import type { ClippyThemeContext } from './index';

const tag = 'clippy-theme-context';

describe(`<${tag}>`, () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('renders element', () => {
    document.body.innerHTML = `<${tag}></${tag}>`;
    const element = document.querySelector(tag);
    expect(element).toBeDefined();
  });

  it('renders no visible content', async () => {
    document.body.innerHTML = `<${tag}></${tag}>`;
    const component = document.querySelector(tag) as ClippyThemeContext;
    await component.updateComplete;

    expect(component.shadowRoot?.textContent?.trim()).toBe('');
    expect(component.shadowRoot?.querySelector('*')).toBeNull();
  });

  it('has no tokens by default', () => {
    document.body.innerHTML = `<${tag}></${tag}>`;
    const component = document.querySelector(tag) as ClippyThemeContext;
    expect(component.tokens).toBeUndefined();
  });

  it('parses theme attribute as JSON', () => {
    document.body.innerHTML = `<${tag} theme='{"basis":{"color":{"accent-1":1}}}'></${tag}>`;
    const component = document.querySelector(tag) as ClippyThemeContext;
    expect(component.tokens).toEqual({ basis: { color: { 'accent-1': 1 } } });
  });

  it('returns undefined for invalid JSON', () => {
    document.body.innerHTML = `<${tag} theme='not json'></${tag}>`;
    const component = document.querySelector(tag) as ClippyThemeContext;
    expect(component.tokens).toBeUndefined();
  });

  it('dispatches theme-change when theme property changes', async () => {
    document.body.innerHTML = `<${tag}></${tag}>`;
    const component = document.querySelector(tag) as ClippyThemeContext;
    await component.updateComplete;

    const listener = vi.fn();
    component.addEventListener('theme-change', listener);

    component.theme = '{"basis":{}}';
    await component.updateComplete;

    expect(listener).toHaveBeenCalledOnce();
    expect(listener.mock.calls[0][0].detail).toEqual({ tokens: { basis: {} } });
  });
});
