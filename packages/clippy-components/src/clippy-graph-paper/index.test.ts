import { describe, expect, it, afterEach } from 'vitest';
import { page } from 'vitest/browser';
import './index';
import type { ClippyGraphPaper } from './index';

const tag = 'clippy-graph-paper';

describe(`<${tag}>`, () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('renders element', async () => {
    document.body.innerHTML = `<${tag}></${tag}>`;
    const element = document.querySelector(tag);
    expect(element).toBeDefined();
  });

  it('has a slot for content', () => {
    document.body.innerHTML = `<${tag}></${tag}>`;
    const element = document.querySelector(tag);
    const slot = element?.shadowRoot?.querySelector('slot');
    expect(slot).toBeDefined();
  });

  it('renders slotted content', async () => {
    document.body.innerHTML = `<${tag}><p>Hello world</p></${tag}>`;
    const component = document.querySelector(tag) as ClippyGraphPaper;
    await component?.updateComplete;

    const paragraph = page.getByText('Hello world');
    expect(paragraph).toBeDefined();
  });

  it('renders a background grid by default', async () => {
    document.body.innerHTML = `<${tag}></${tag}>`;
    const component = document.querySelector(tag) as ClippyGraphPaper;
    await component?.updateComplete;

    const backgroundImage = getComputedStyle(component).backgroundImage;
    expect(backgroundImage).not.toBe('none');
  });

  it('honors a custom --clippy-graph-paper-cell-size', async () => {
    document.body.innerHTML = `<${tag} style="--clippy-graph-paper-cell-size: 16px;"></${tag}>`;
    const component = document.querySelector(tag) as ClippyGraphPaper;
    await component?.updateComplete;

    const backgroundSize = getComputedStyle(component).backgroundSize;
    expect(backgroundSize).toContain('16px');
  });
});
