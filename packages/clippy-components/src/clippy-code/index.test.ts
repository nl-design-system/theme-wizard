import { afterEach, describe, expect, it } from 'vitest';
import './index';
import { ClippyCode } from './index';

const tag = 'clippy-code';

function getComponent() {
  return document.querySelector(tag) as unknown as ClippyCode;
}

describe(`<${tag}>`, () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('renders a code element with translate="no" and dir="ltr"', async () => {
    document.body.innerHTML = `<${tag}></${tag}>`;
    const component = getComponent();
    await component.updateComplete;

    const code = component.shadowRoot?.querySelector('code');
    expect(code).toBeTruthy();
    expect(code?.getAttribute('translate')).toBe('no');
    expect(code?.getAttribute('dir')).toBe('ltr');
  });

  it('renders the nl-code class on the code element', async () => {
    document.body.innerHTML = `<${tag}></${tag}>`;
    const component = getComponent();
    await component.updateComplete;

    const code = component.shadowRoot?.querySelector('code');
    expect(code?.classList.contains('nl-code')).toBe(true);
  });

  it('reflects slot contents in the rendered result', async () => {
    document.body.innerHTML = `<${tag}>const x = 1;</${tag}>`;
    const component = getComponent();
    await component.updateComplete;

    expect(component.textContent).toBe('const x = 1;');
  });
});
