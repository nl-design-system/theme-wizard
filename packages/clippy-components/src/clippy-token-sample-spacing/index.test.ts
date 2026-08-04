import { describe, expect, it, afterEach, beforeEach } from 'vitest';
import './index';
import { page } from 'vitest/browser';

const tag = 'clippy-token-sample-spacing';

type ComponentElement = { shadowRoot: ShadowRoot; updateComplete: Promise<boolean> };

function getComponent() {
  return document.querySelector(tag) as unknown as ComponentElement;
}

describe(`<${tag}>`, () => {
  beforeEach(() => {
    document.body.innerHTML = `<${tag}></${tag}>`;
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('renders', async () => {
    const component = getComponent();
    await component.updateComplete;

    expect(page.getByText('clippy-token-sample-spacing')).toBeVisible();
  });
});
