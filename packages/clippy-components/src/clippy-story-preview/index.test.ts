import { describe, expect, it, afterEach } from 'vitest';
import { page } from 'vitest/browser';
import './index';
import type { ClippyStoryPreview } from './index';

const tag = 'clippy-story-preview';

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
    const component = document.querySelector(tag) as ClippyStoryPreview;
    await component?.updateComplete;

    const paragraph = page.getByText('Hello world');
    expect(paragraph).toBeDefined();
  });

  it('does not have size attribute by default', () => {
    document.body.innerHTML = `<${tag}></${tag}>`;
    const element = document.querySelector(tag);
    expect(element?.getAttribute('size')).toBeNull();
  });

  it('reflects size attribute', async () => {
    document.body.innerHTML = `<${tag} size="lg"></${tag}>`;
    const component = document.querySelector(tag) as ClippyStoryPreview;
    await component?.updateComplete;

    const element = document.querySelector(tag);
    expect(element?.getAttribute('size')).toBe('lg');
  });

  it('adds --lg modifier class when size is "lg"', async () => {
    document.body.innerHTML = `<${tag} size="lg"></${tag}>`;
    const component = document.querySelector(tag) as ClippyStoryPreview;
    await component?.updateComplete;

    const inner = document.querySelector(tag)?.shadowRoot?.querySelector('.clippy-story-preview--lg');
    expect(inner).not.toBeNull();
  });

  it('does not add --lg modifier class when size is not set', async () => {
    document.body.innerHTML = `<${tag}></${tag}>`;
    const component = document.querySelector(tag) as ClippyStoryPreview;
    await component?.updateComplete;

    const inner = document.querySelector(tag)?.shadowRoot?.querySelector('.clippy-story-preview--lg');
    expect(inner).toBeNull();
  });

  it('does not add --lg modifier class when size is a different value', async () => {
    document.body.innerHTML = `<${tag} size="sm"></${tag}>`;
    const component = document.querySelector(tag) as ClippyStoryPreview;
    await component?.updateComplete;

    const inner = document.querySelector(tag)?.shadowRoot?.querySelector('.clippy-story-preview--lg');
    expect(inner).toBeNull();
  });
});
