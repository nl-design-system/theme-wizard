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
});
