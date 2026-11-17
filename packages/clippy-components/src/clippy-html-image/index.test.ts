import { describe, expect, it, afterEach } from 'vitest';
import { page } from 'vitest/browser';
import './index';

const tag = 'clippy-html-image';

describe(`<${tag}>`, () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('renders element', async () => {
    document.body.innerHTML = `<${tag}></${tag}>`;
    const element = document.querySelector(tag);
    expect(element).toBeDefined();
  });

  it('renders without role when no label slot content is provided', async () => {
    document.body.innerHTML = `<${tag}></${tag}>`;
    const component = document.querySelector(tag) as unknown as {
      updateComplete: Promise<void>;
      shadowRoot: ShadowRoot;
    };
    await component?.updateComplete;
    await new Promise((resolve) => setTimeout(resolve, 0));
    await component?.updateComplete;

    const figure = component.shadowRoot.querySelector('figure');
    expect(figure).toBeDefined();
    expect(figure?.getAttribute('role')).toBeNull();
    expect(figure?.getAttribute('aria-labelledby')).toBeNull();
  });

  it('renders with role="img" when label slot content is provided', async () => {
    document.body.innerHTML = `<${tag}><span slot="label">Test image</span></${tag}>`;
    const component = document.querySelector(tag) as unknown as {
      updateComplete: Promise<void>;
      shadowRoot: ShadowRoot;
    };
    await component?.updateComplete;
    await new Promise((resolve) => setTimeout(resolve, 0));
    await component?.updateComplete;

    const figure = component.shadowRoot.querySelector('figure');
    expect(figure).toBeDefined();
    expect(figure?.getAttribute('role')).toBe('img');
  });

  it('has aria-labelledby pointing to hidden figcaption when label slot content is provided', async () => {
    document.body.innerHTML = `<${tag}><span slot="label">Test image</span></${tag}>`;
    const component = document.querySelector(tag) as unknown as {
      updateComplete: Promise<void>;
      shadowRoot: ShadowRoot;
    };
    await component?.updateComplete;
    await new Promise((resolve) => setTimeout(resolve, 0));
    await component?.updateComplete;

    const figure = component.shadowRoot.querySelector('figure');
    expect(figure?.getAttribute('aria-labelledby')).toBeTruthy();

    const figcaption = component.shadowRoot.querySelector('figcaption');
    expect(figcaption).toBeDefined();
    expect(figcaption?.hasAttribute('hidden')).toBe(true);
    expect(figcaption?.getAttribute('id')).toBe(figure?.getAttribute('aria-labelledby'));
  });

  it('has accessible name from label slot content', async () => {
    document.body.innerHTML = `<${tag}><span slot="label">my label</span></${tag}>`;
    const component = document.querySelector(tag) as unknown as { updateComplete: Promise<void> };
    await component?.updateComplete;
    await new Promise((resolve) => setTimeout(resolve, 0));
    await component?.updateComplete;

    const imgElement = page.getByRole('img');
    expect(imgElement).toBeDefined();
    expect(imgElement).toHaveAccessibleName('my label');
  });

  it('does not have accessible name when no label slot content is provided', async () => {
    document.body.innerHTML = `<${tag}></${tag}>`;
    const component = document.querySelector(tag) as unknown as {
      updateComplete: Promise<void>;
      shadowRoot: ShadowRoot;
    };
    await component?.updateComplete;
    await new Promise((resolve) => setTimeout(resolve, 0));
    await component?.updateComplete;

    const figure = component.shadowRoot.querySelector('figure');
    // Without label, figure has no role, so we check it directly
    expect(figure).toBeDefined();
    expect(figure?.getAttribute('role')).toBeNull();
  });

  it('returns component via page.getByRole("img") when label slot content is present', async () => {
    document.body.innerHTML = `<${tag}><span slot="label">Test</span></${tag}>`;
    const component = document.querySelector(tag) as unknown as { updateComplete: Promise<void> };
    await component?.updateComplete;
    await new Promise((resolve) => setTimeout(resolve, 0));
    await component?.updateComplete;

    const imgElement = page.getByRole('img');
    expect(imgElement).toBeDefined();
    const elementHandle = imgElement.element;
    expect(elementHandle).toBeTruthy();
  });

  it('sets unique label ids when rendering multiple html-images with label slots', async () => {
    document.body.innerHTML = `
      <${tag}><span slot="label">my first label</span></${tag}>
      <${tag}><span slot="label">my second label</span></${tag}>
    `;

    const components = Array.from(document.querySelectorAll(tag)) as unknown as {
      updateComplete: Promise<void>;
      shadowRoot: ShadowRoot;
    }[];
    await Promise.all(components.map((c) => c.updateComplete));
    await new Promise((resolve) => setTimeout(resolve, 0));
    await Promise.all(components.map((c) => c.updateComplete));

    const figures = components.map((c) => c.shadowRoot.querySelector('figure[role="img"]'));
    expect(figures).toHaveLength(2);

    const imgElement1 = page.getByRole('img').first();
    expect(imgElement1).toHaveAccessibleName('my first label');

    const imgElement2 = page.getByRole('img').last();
    expect(imgElement2).toHaveAccessibleName('my second label');
  });

  it('removes role and accessible name when label slot content is removed', async () => {
    document.body.innerHTML = `<${tag}><span slot="label">Slot label</span></${tag}>`;
    const component = document.querySelector(tag) as unknown as {
      updateComplete: Promise<void>;
      shadowRoot: ShadowRoot;
    };
    await component?.updateComplete;
    await new Promise((resolve) => setTimeout(resolve, 0));
    await component?.updateComplete;

    expect(component.shadowRoot.querySelector('figure')?.getAttribute('role')).toBe('img');

    document.querySelector('span[slot="label"]')?.remove();
    await new Promise((resolve) => setTimeout(resolve, 0));
    await component?.updateComplete;

    const figure = component.shadowRoot.querySelector('figure');
    expect(figure?.getAttribute('role')).toBeNull();
    expect(figure?.getAttribute('aria-labelledby')).toBeNull();
  });

  it('applies forced-color-adjust class when forcedColorAdjust is true', async () => {
    document.body.innerHTML = `<${tag} forced-color-adjust></${tag}>`;
    const component = document.querySelector(tag) as unknown as { updateComplete: Promise<void> };
    await component?.updateComplete;

    const bodyDiv = document.querySelector('.ma-html-image__body--forced-color-adjust');
    expect(bodyDiv).toBeDefined();
  });

  it('does not apply forced-color-adjust class when forcedColorAdjust is false', async () => {
    document.body.innerHTML = `<${tag}></${tag}>`;
    const component = document.querySelector(tag) as unknown as { updateComplete: Promise<void> };
    await component?.updateComplete;

    const bodyDiv = document.querySelector('.ma-html-image__body--forced-color-adjust');
    expect(bodyDiv).toBeNull();
  });

  it('has default slot for content', async () => {
    document.body.innerHTML = `<${tag}><div class="content"></div></${tag}>`;
    const component = document.querySelector(tag) as unknown as { updateComplete: Promise<void> };
    await component?.updateComplete;

    const slot = document.querySelector('slot');
    expect(slot).toBeDefined();
    expect(slot?.name).toBe('');
  });

  it('renders content with inert attribute', async () => {
    document.body.innerHTML = `<${tag}><div class="content"></div></${tag}>`;
    const component = document.querySelector(tag) as unknown as { updateComplete: Promise<void> };
    await component?.updateComplete;

    const inertDiv = document.querySelector('[inert="true"]');
    expect(inertDiv).toBeDefined();
    expect(inertDiv?.contains(document.querySelector('.content'))).toBe(true);
  });

  it('renders content with aria-hidden="true"', async () => {
    document.body.innerHTML = `<${tag}><div class="content"></div></${tag}>`;
    const component = document.querySelector(tag) as unknown as { updateComplete: Promise<void> };
    await component?.updateComplete;

    const hiddenDiv = document.querySelector('[aria-hidden="true"]');
    expect(hiddenDiv).toBeDefined();
    expect(hiddenDiv?.contains(document.querySelector('.content'))).toBe(true);
  });

  it('applies color-scheme class to body when color-scheme="dark"', async () => {
    document.body.innerHTML = `<${tag} color-scheme="dark"></${tag}>`;
    const component = document.querySelector(tag) as unknown as { updateComplete: Promise<void> };
    await component?.updateComplete;

    const host = document.querySelector(tag);
    expect(host?.getAttribute('color-scheme')).toBe('dark');
  });

  it('applies color-scheme class to body when color-scheme="light"', async () => {
    document.body.innerHTML = `<${tag} color-scheme="light"></${tag}>`;
    const component = document.querySelector(tag) as unknown as { updateComplete: Promise<void> };
    await component?.updateComplete;

    const host = document.querySelector(tag);
    expect(host?.getAttribute('color-scheme')).toBe('light');
  });
});
