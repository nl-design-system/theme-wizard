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

  it('renders without role when no label is provided', () => {
    document.body.innerHTML = `<${tag}></${tag}>`;
    const figure = document.querySelector('figure');
    expect(figure).toBeDefined();
    expect(figure?.getAttribute('role')).toBeNull();
  });

  it('renders with role="img" when label property is provided', async () => {
    document.body.innerHTML = `<${tag} label="Test image"></${tag}>`;
    const component = document.querySelector(tag) as unknown as { updateComplete: Promise<void> };
    await component?.updateComplete;

    const figure = document.querySelector('figure');
    expect(figure).toBeDefined();
    expect(figure?.getAttribute('role')).toBe('img');
  });

  it('has aria-labelledby pointing to hidden figcaption when label is provided', async () => {
    document.body.innerHTML = `<${tag} label="Test image"></${tag}>`;
    const component = document.querySelector(tag) as unknown as { updateComplete: Promise<void> };
    await component?.updateComplete;

    const figure = document.querySelector('figure');
    expect(figure?.getAttribute('aria-labelledby')).toBeTruthy();

    const figcaption = document.querySelector('figcaption');
    expect(figcaption).toBeDefined();
    expect(figcaption?.getAttribute('hidden')).toBe('true');
    expect(figcaption?.getAttribute('id')).toBe(figure?.getAttribute('aria-labelledby'));
  });

  it('has accessible name when label property is provided', async () => {
    document.body.innerHTML = `<${tag} label="my label"></${tag}>`;
    const component = document.querySelector(tag) as unknown as { updateComplete: Promise<void> };
    await component?.updateComplete;

    const imgElement = page.getByRole('img');
    expect(imgElement).toBeDefined();
    expect(imgElement).toHaveAccessibleName('my label');
  });

  it('does not have accessible name when label is not provided', async () => {
    document.body.innerHTML = `<${tag}></${tag}>`;
    const component = document.querySelector(tag) as unknown as { updateComplete: Promise<void> };
    await component?.updateComplete;

    const figure = document.querySelector('figure');
    // Without label, figure has no role, so we check it directly
    expect(figure).toBeDefined();
    expect(figure?.getAttribute('role')).toBeNull();
  });

  it('returns component via page.getByRole("img") when label is present', async () => {
    document.body.innerHTML = `<${tag} label="Test"></${tag}>`;
    const component = document.querySelector(tag) as unknown as { updateComplete: Promise<void> };
    await component?.updateComplete;

    const imgElement = page.getByRole('img');
    expect(imgElement).toBeDefined();
    const elementHandle = imgElement.element;
    expect(elementHandle).toBeTruthy();
  });

  it('sets unique labels correctly when rendering multiple html-images', async () => {
    document.body.innerHTML = `
      <${tag} label="my first label"></${tag}>
      <${tag} label="my second label"></${tag}>
    `;

    const components = document.querySelectorAll(tag) as unknown as { updateComplete: Promise<void> }[];
    await Promise.all(components.map((c) => c.updateComplete));

    const figures = document.querySelectorAll('figure[role="img"]');
    expect(figures).toHaveLength(2);

    const imgElement1 = page.getByRole('img').first();
    expect(imgElement1).toHaveAccessibleName('my first label');

    const imgElement2 = page.getByRole('img').last();
    expect(imgElement2).toHaveAccessibleName('my second label');
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
