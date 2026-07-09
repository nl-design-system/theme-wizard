import { describe, expect, it, afterEach } from 'vitest';
import './index';

const tag = 'clippy-color-table';

type ComponentElement = { shadowRoot: ShadowRoot; updateComplete: Promise<boolean> };

function getComponent() {
  return document.querySelector(tag) as unknown as ComponentElement;
}

describe(`<${tag}>`, () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('renders', async () => {
    document.body.innerHTML = `<${tag}></${tag}>`;
    const component = getComponent();
    await component.updateComplete;

    expect(component.shadowRoot.querySelector('table')).toBeTruthy();
  });
});
