import './index';
import { describe, expect, it, afterEach } from 'vitest';
import { ClippyTokenSampleBorder } from './index';

const tag = 'clippy-token-sample-border';

function getComponent() {
  return document.querySelector(tag) as unknown as ClippyTokenSampleBorder;
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

  it('border-radius defaults to empty string', async () => {
    document.body.innerHTML = `<${tag}></${tag}>`;
    const component = getComponent();
    await component.updateComplete;

    expect(component).toBeDefined();
    expect(component.borderRadius).toBe('');
  });

  it('border-width defaults to 1px', async () => {
    document.body.innerHTML = `<${tag}></${tag}>`;
    const component = getComponent();
    await component.updateComplete;

    expect(component).toBeDefined();
    expect(component.borderWidth).toBe('1px');
  });

  it('adjusts the border width of the dummy element', async () => {
    document.body.innerHTML = `<${tag} border-width="2px"></${tag}>`;
    const component = getComponent();
    await component.updateComplete;

    const dummy = component.shadowRoot?.querySelector('.clippy-token-sample-border__dummy') as HTMLDivElement;
    expect(dummy).toBeDefined();
    expect(getComputedStyle(dummy).getPropertyValue('border-width')).toBe('2px');
  });

  it('adjusts the border radius of the dummy element', async () => {
    document.body.innerHTML = `<${tag} border-radius="4px"></${tag}>`;
    const component = getComponent();
    await component.updateComplete;

    const dummy = component.shadowRoot?.querySelector('.clippy-token-sample-border__dummy') as HTMLDivElement;
    expect(dummy).toBeDefined();
    expect(getComputedStyle(dummy).getPropertyValue('border-top-left-radius')).toBe('4px');
  });
});
