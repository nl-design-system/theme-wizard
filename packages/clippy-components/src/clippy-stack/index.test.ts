import './index';
import { describe, expect, it, afterEach } from 'vitest';
import { ClippyStack } from './index';

const tag = 'clippy-stack';

function getComponent() {
  return document.querySelector(tag) as unknown as ClippyStack;
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

  it('has default size', async () => {
    document.body.innerHTML = `<${tag}></${tag}>`;
    const component = getComponent();
    await component.updateComplete;

    const element = document.querySelector(tag);
    expect(element).toHaveAttribute('size', 'md');
  });

  it('can set size via property', async () => {
    document.body.innerHTML = `<${tag} size="lg"></${tag}>`;
    const component = getComponent();
    await component.updateComplete;

    const element = document.querySelector(tag);
    expect(element).toHaveAttribute('size', 'lg');
  });
});
