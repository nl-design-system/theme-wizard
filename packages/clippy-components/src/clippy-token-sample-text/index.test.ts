import './index';
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
});
