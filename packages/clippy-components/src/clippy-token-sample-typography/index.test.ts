import './index';
import { describe, expect, it, afterEach } from 'vitest';
import { ClippyTokenSampleTypography } from './index';

const tag = 'clippy-token-sample-typography';

function getComponent() {
  return document.querySelector(tag) as unknown as ClippyTokenSampleTypography;
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
