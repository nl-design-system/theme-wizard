import { beforeEach, describe, expect, it } from 'vitest';
import './index';

const tag = 'clippy-link';

type LitUpdatable = HTMLElement & { updateComplete: Promise<unknown> };

describe(`<${tag}>`, () => {
  beforeEach(() => {
    document.body.innerHTML = `<${tag}></${tag}>`;
  });

  it('renders an anchor element', async () => {
    const el = document.querySelector(tag);
    expect(el).not.toBeNull();

    await customElements.whenDefined(tag);

    const a = el!.shadowRoot?.querySelector('a');
    expect(a).not.toBeNull();
    expect(a?.classList.contains('nl-link')).toBe(true);
  });


  it('sets href on the rendered anchor', async () => {
    const el = document.querySelector(tag) as HTMLElement & { href: string };
    expect(el).not.toBeNull();

    await customElements.whenDefined(tag);

    el.href = '/example';
    await (el as unknown as LitUpdatable).updateComplete;

    const a = el.shadowRoot?.querySelector('a');
    expect(a).not.toBeNull();
    expect(a?.getAttribute('href')).toBe('/example');
  });


  it('forwards restProps to the inner anchor element', async () => {
    document.body.innerHTML = `<${tag}></${tag}>`;
    interface ClippyLinkRestProps extends HTMLElement {
      restProps: Record<string, string>;
      updateComplete: Promise<unknown>;
    }
    const el = document.querySelector(tag) as ClippyLinkRestProps;
    expect(el).not.toBeNull();

    await customElements.whenDefined(tag);

    el.restProps = {
      download: 'file.pdf',
      hreflang: 'en',
      ping: 'https://example.com/ping',
      referrerPolicy: 'no-referrer',
      type: 'application/pdf',
    };
    await el.updateComplete;

    const a = el.shadowRoot?.querySelector('a');
    expect(a).not.toBeNull();
    expect(a?.download).toBe('file.pdf');
    expect(a?.hreflang).toBe('en');
    expect(a?.ping).toBe('https://example.com/ping');
    expect(a?.referrerPolicy).toBe('no-referrer');
    expect(a?.type).toBe('application/pdf');
  });

  it('applies className to the inner anchor element', async () => {
    document.body.innerHTML = `<${tag}></${tag}>`;
    const el = document.querySelector(tag) as HTMLElement & { className: string; updateComplete: Promise<unknown> };
    expect(el).not.toBeNull();

    await customElements.whenDefined(tag);

    el.className = 'my-extra-class';
    await el.updateComplete;

    const a = el.shadowRoot?.querySelector('a');
    expect(a).not.toBeNull();
    expect(a?.classList.contains('my-extra-class')).toBe(true);
  });

  it('adds nl-link--current class when current is set', async () => {
    document.body.innerHTML = `<${tag} current="page"></${tag}>`;
    const el = document.querySelector(tag) as HTMLElement & { current: string };
    expect(el).not.toBeNull();

    await customElements.whenDefined(tag);
    await (el as unknown as LitUpdatable).updateComplete;

    const a = el.shadowRoot?.querySelector('a');
    expect(a).not.toBeNull();
    expect(a?.classList.contains('nl-link--current')).toBe(true);
    expect(a?.getAttribute('aria-current')).toBe('page');
  });

  it('adds nl-link--inline-box class when inline-box is set', async () => {
    document.body.innerHTML = `<${tag} inline-box></${tag}>`;
    const el = document.querySelector(tag) as HTMLElement & { inlineBox: boolean };
    expect(el).not.toBeNull();

    await customElements.whenDefined(tag);
    await (el as unknown as LitUpdatable).updateComplete;

    const a = el.shadowRoot?.querySelector('a');
    expect(a).not.toBeNull();
    expect(a?.classList.contains('nl-link--inline-box')).toBe(true);
  });

  it('disabled removes href/target and marks link as disabled', async () => {
    document.body.innerHTML = `<${tag} href="/x" target="_blank" disabled>Lees meer</${tag}>`;
    const el = document.querySelector(tag) as HTMLElement & { disabled: boolean };
    expect(el).not.toBeNull();

    await customElements.whenDefined(tag);
    await (el as unknown as LitUpdatable).updateComplete;

    const a = el.shadowRoot?.querySelector('a');
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
    await (el as unknown as LitUpdatable).updateComplete;

    const a = el!.shadowRoot?.querySelector('a');
    expect(a).not.toBeNull();
    expect(a?.getAttribute('aria-label')).toBe('Meer info');
    expect(a?.dataset['testid']).toBe('link');

    el!.removeAttribute('aria-label');
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(a?.getAttribute('aria-label')).toBeNull();
  });

  it('does not forward non aria/data attributes by default', async () => {
    document.body.innerHTML = `<${tag} href="/x" title="Tooltip">Lees meer</${tag}>`;
    const el = document.querySelector(tag);
    expect(el).not.toBeNull();

    await customElements.whenDefined(tag);
    await (el as unknown as LitUpdatable).updateComplete;

    const a = el!.shadowRoot?.querySelector('a');
    expect(a).not.toBeNull();
    expect(a?.getAttribute('title')).toBeNull();
  });

  it('forwards non aria/data attributes when forward-attributes is set to all, and cleans up when switching back', async () => {
    document.body.innerHTML = `<${tag} href="/x" forward-attributes="all" title="Tooltip">Lees meer</${tag}>`;
    const el = document.querySelector(tag);
    expect(el).not.toBeNull();

    await customElements.whenDefined(tag);
    await (el as unknown as LitUpdatable).updateComplete;

    const a = el!.shadowRoot?.querySelector('a');
    expect(a).not.toBeNull();

    // Forwarded when policy is "all"
    expect(a?.getAttribute('title')).toBe('Tooltip');
    // The policy attribute itself must never be forwarded
    expect(a?.hasAttribute('forward-attributes')).toBe(false);

    // Switch policy back to default and ensure cleanup happens.
    el!.setAttribute('forward-attributes', 'aria-data');
    await (el as unknown as LitUpdatable).updateComplete;
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(a?.getAttribute('title')).toBeNull();
  });

});
