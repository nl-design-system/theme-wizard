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

  it('does not forward arbitrary anchor-specific attributes from the host', async () => {
    document.body.innerHTML = `<${tag} download="file.pdf" hreflang="en" ping="https://example.com/ping" referrerpolicy="no-referrer" type="application/pdf"></${tag}>`;
    const el = document.querySelector(tag);
    expect(el).not.toBeNull();

    await customElements.whenDefined(tag);
    await el?.updateComplete;

    const a = el!.shadowRoot?.querySelector('a');
    expect(a).not.toBeNull();
    expect(a?.getAttribute('download')).toBeNull();
    expect(a?.getAttribute('hreflang')).toBeNull();
    expect(a?.getAttribute('ping')).toBeNull();
    expect(a?.getAttribute('referrerpolicy')).toBeNull();
    expect(a?.getAttribute('type')).toBeNull();
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

  it('does not forward non-component aria/data attributes to the rendered anchor', async () => {
    document.body.innerHTML = `<${tag} href="/x" aria-label="Meer info" data-testid="link">Lees meer</${tag}>`;
    const el = document.querySelector(tag);
    expect(el).not.toBeNull();

    await customElements.whenDefined(tag);
    await el?.updateComplete;

    const a = el?.shadowRoot?.querySelector('a');
    expect(a).not.toBeNull();
    expect(a?.getAttribute('aria-label')).toBeNull();
    expect(a?.dataset['testid']).toBeUndefined();
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
