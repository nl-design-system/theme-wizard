import { beforeEach, describe, expect, it } from 'vitest';
import './index';

const tag = 'clippy-link';

describe(`<${tag}>`, () => {
  beforeEach(() => {
    document.body.innerHTML = `<${tag}></${tag}>`;
  });

  it('renders an anchor with base class and sets href', async () => {
    document.body.innerHTML = `<${tag} href="/example"></${tag}>`;
    const el = document.querySelector(tag);
    expect(el).not.toBeNull();

    await customElements.whenDefined(tag);
    await el?.updateComplete;

    const a = el?.shadowRoot?.querySelector('a');
    expect(a).not.toBeNull();
    expect(a?.classList.contains('nl-link')).toBe(true);
    expect(a?.getAttribute('href')).toBe('/example');
  });

  it('forwards anchor-specific attributes via host attributes', async () => {
    document.body.innerHTML = `<${tag} download="file.pdf" hreflang="en" ping="https://example.com/ping" referrerpolicy="no-referrer" type="application/pdf"></${tag}>`;
    const el = document.querySelector(tag);
    expect(el).not.toBeNull();

    await customElements.whenDefined(tag);
    await el?.updateComplete;

    const a = el!.shadowRoot?.querySelector('a');
    expect(a).not.toBeNull();
    expect(a?.getAttribute('download')).toBe('file.pdf');
    expect(a?.getAttribute('hreflang')).toBe('en');
    expect(a?.getAttribute('ping')).toBe('https://example.com/ping');
    expect(a?.getAttribute('referrerpolicy')).toBe('no-referrer');
    expect(a?.getAttribute('type')).toBe('application/pdf');
  });

  it('adds nl-link--current class when aria-current is set on the host', async () => {
    document.body.innerHTML = `<${tag} aria-current="page"></${tag}>`;
    const el = document.querySelector(tag);
    expect(el).not.toBeNull();

    await customElements.whenDefined(tag);
    await el?.updateComplete;

    const a = el?.shadowRoot?.querySelector('a');
    expect(a).not.toBeNull();
    expect(a?.classList.contains('nl-link--current')).toBe(true);
    expect(a?.getAttribute('aria-current')).toBe('page');
  });

  it('adds nl-link--inline-box class when inline-box is set', async () => {
    document.body.innerHTML = `<${tag} inline-box></${tag}>`;
    const el = document.querySelector(tag);
    expect(el).not.toBeNull();

    await customElements.whenDefined(tag);
    await el?.updateComplete;

    const a = el?.shadowRoot?.querySelector('a');
    expect(a).not.toBeNull();
    expect(a?.classList.contains('nl-link--inline-box')).toBe(true);
  });

  it('disabled removes href/target and marks link as disabled', async () => {
    document.body.innerHTML = `<${tag} href="/x" target="_blank" disabled>Lees meer</${tag}>`;
    const el = document.querySelector(tag);
    expect(el).not.toBeNull();

    await customElements.whenDefined(tag);
    await el?.updateComplete;

    const a = el?.shadowRoot?.querySelector('a');
    expect(a).not.toBeNull();
    expect(a?.classList.contains('nl-link--disabled')).toBe(true);
    expect(a?.getAttribute('aria-disabled')).toBe('true');
    expect(a?.getAttribute('href')).toBeNull();
    expect(a?.getAttribute('target')).toBeNull();
    expect(a?.getAttribute('tabindex')).toBe('0');
    expect(a?.getAttribute('role')).toBe('link');
  });

  it('forwards non-component attributes to the rendered anchor', async () => {
    document.body.innerHTML = `<${tag} href="/x" aria-label="Meer info" data-testid="link">Lees meer</${tag}>`;
    const el = document.querySelector(tag);
    expect(el).not.toBeNull();

    await customElements.whenDefined(tag);
    await el?.updateComplete;

    const a = el?.shadowRoot?.querySelector('a');
    expect(a).not.toBeNull();
    expect(a?.getAttribute('aria-label')).toBe('Meer info');
    expect(a?.dataset['testid']).toBe('link');

    el?.removeAttribute('aria-label');
    await el?.updateComplete;

    expect(a?.getAttribute('aria-label')).toBeNull();
  });

  it('forwards non aria/data attributes only when forward-attributes="all", and cleans up when switching back', async () => {
    document.body.innerHTML = `<${tag} href="/x" title="Tooltip">Lees meer</${tag}>`;
    const el = document.querySelector(tag);
    expect(el).not.toBeNull();

    await customElements.whenDefined(tag);
    await el?.updateComplete;

    const a = el!.shadowRoot?.querySelector('a');
    expect(a).not.toBeNull();

    // Not forwarded by default
    expect(a?.getAttribute('title')).toBeNull();

    // Forwarded when policy is "all"
    el!.setAttribute('forward-attributes', 'all');
    await el?.updateComplete;

    // Forwarded when policy is "all"
    expect(a?.getAttribute('title')).toBe('Tooltip');
    // The policy attribute itself must never be forwarded
    expect(a?.hasAttribute('forward-attributes')).toBe(false);

    // Switch policy back to default and ensure cleanup happens.
    el!.setAttribute('forward-attributes', 'aria-data');
    await el?.updateComplete;

    expect(a?.getAttribute('title')).toBeNull();
  });

  it('forwards host class to inner anchor', async () => {
    document.body.innerHTML = `<${tag}></${tag}>`;
    const el = document.querySelector(tag);
    expect(el).not.toBeNull();

    await customElements.whenDefined(tag);

    if (el) el.className = 'my-extra-class';
    await el?.updateComplete;

    const a = el?.shadowRoot?.querySelector('a');
    expect(a).not.toBeNull();
    expect(a?.classList.contains('my-extra-class')).toBe(true);
  });
});
