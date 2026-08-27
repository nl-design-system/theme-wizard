import './index';
import { describe, expect, it, afterEach } from 'vitest';
import { ClippyTokenSample } from './index';

const tag = 'clippy-token-sample';

function getComponent() {
  return document.querySelector(tag) as unknown as ClippyTokenSample;
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
});
