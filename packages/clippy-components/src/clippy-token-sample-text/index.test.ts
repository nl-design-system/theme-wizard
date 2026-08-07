import './index';
import Color from 'colorjs.io';
import { describe, expect, it, afterEach } from 'vitest';
import { ClippyTokenSampleText } from './index';

const tag = 'clippy-token-sample-text';

function getComponent() {
  return document.querySelector(tag) as unknown as ClippyTokenSampleText;
}

describe(`<${tag}>`, () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('renders', async () => {
    document.body.innerHTML = `<${tag}></${tag}>`;
    const component = getComponent();
    await component.updateComplete;

    const element = document.querySelector(tag);
    expect(element).toBeDefined();
  });

  it('sets the font-size', async () => {
    document.body.innerHTML = `<${tag} font-size="24px"></${tag}>`;
    const component = getComponent();
    await component.updateComplete;

    const dummy = component.shadowRoot?.querySelector('.clippy-token-sample-text__dummy') as HTMLParagraphElement;
    expect(dummy).toBeDefined();
    expect(getComputedStyle(dummy).getPropertyValue('font-size')).toBe('24px');
  });

  it('sets the font-family', async () => {
    document.body.innerHTML = `<${tag} font-family="monospace"></${tag}>`;
    const component = getComponent();
    await component.updateComplete;

    const dummy = component.shadowRoot?.querySelector('.clippy-token-sample-text__dummy') as HTMLParagraphElement;
    expect(dummy).toBeDefined();
    expect(getComputedStyle(dummy).getPropertyValue('font-family')).toBe('monospace');
  });

  it('sets the color', async () => {
    document.body.innerHTML = `<${tag} color="red"></${tag}>`;
    const component = getComponent();
    await component.updateComplete;

    const dummy = component.shadowRoot?.querySelector('.clippy-token-sample-text__dummy') as HTMLParagraphElement;
    expect(dummy).toBeDefined();
    const dummyColor = getComputedStyle(dummy).color;
    const normalizedColor = new Color(dummyColor);
    const expectedColor = new Color('red');
    expect(normalizedColor.toString({ format: 'rgb' })).toBe(expectedColor.toString({ format: 'rgb' }));
  });

  it('truncates the text', async () => {
    document.body.innerHTML = `<${tag} truncate></${tag}>`;
    const component = getComponent();
    await component.updateComplete;

    const dummy = component.shadowRoot?.querySelector('.clippy-token-sample-text__dummy') as HTMLParagraphElement;
    expect(dummy).toBeDefined();
    expect(getComputedStyle(dummy).getPropertyValue('-webkit-line-clamp')).toBe('1');
  });
});
