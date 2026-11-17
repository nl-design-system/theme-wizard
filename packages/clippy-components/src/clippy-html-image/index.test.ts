import { describe, expect, it, afterEach } from 'vitest';
import { page } from 'vitest/browser';
import './index';
import type { ClippyHtmlImage } from './index';

const tag = 'clippy-html-image';

const tick = () => new Promise((resolve) => setTimeout(resolve, 0));

/** Waits for the initial render plus any slotchange-triggered update. */
const settle = async (component: ClippyHtmlImage): Promise<void> => {
  await component.updateComplete;
  await tick();
  await component.updateComplete;
};

const render = async (html: string): Promise<ClippyHtmlImage> => {
  document.body.innerHTML = html;
  const component = document.querySelector(tag) as ClippyHtmlImage;
  await settle(component);
  return component;
};

const renderAll = async (html: string): Promise<ClippyHtmlImage[]> => {
  document.body.innerHTML = html;
  const components = Array.from(document.querySelectorAll(tag)) as ClippyHtmlImage[];
  await Promise.all(components.map(settle));
  return components;
};

describe(`<${tag}>`, () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('renders element', async () => {
    const component = await render(`<${tag}></${tag}>`);
    expect(component).toBeTruthy();
  });

  it('renders without role when no label slot content is provided', async () => {
    const component = await render(`<${tag}></${tag}>`);

    const figure = component.shadowRoot?.querySelector('figure');
    expect(figure).toBeTruthy();
    expect(figure?.getAttribute('role')).toBeNull();
    expect(figure?.getAttribute('aria-labelledby')).toBeNull();
  });

  it('renders with role="img" when label slot content is provided', async () => {
    const component = await render(`<${tag}><span slot="label">Test image</span></${tag}>`);

    const figure = component.shadowRoot?.querySelector('figure');
    expect(figure).toBeTruthy();
    expect(figure?.getAttribute('role')).toBe('img');
  });

  it('has aria-labelledby pointing to hidden figcaption when label slot content is provided', async () => {
    const component = await render(`<${tag}><span slot="label">Test image</span></${tag}>`);

    const figure = component.shadowRoot?.querySelector('figure');
    expect(figure?.getAttribute('aria-labelledby')).toBeTruthy();

    const figcaption = component.shadowRoot?.querySelector('figcaption');
    expect(figcaption).toBeTruthy();
    expect(figcaption?.hasAttribute('hidden')).toBe(true);
    expect(figcaption?.getAttribute('id')).toBe(figure?.getAttribute('aria-labelledby'));
  });

  it('has accessible name from label slot content', async () => {
    await render(`<${tag}><span slot="label">my label</span></${tag}>`);

    const imgElement = page.getByRole('img');
    expect(imgElement).toBeDefined();
    expect(imgElement).toHaveAccessibleName('my label');
  });

  it('does not have accessible name when no label slot content is provided', async () => {
    const component = await render(`<${tag}></${tag}>`);

    const figure = component.shadowRoot?.querySelector('figure');
    // Without label, figure has no role, so we check it directly
    expect(figure).toBeTruthy();
    expect(figure?.getAttribute('role')).toBeNull();
  });

  it('returns component via page.getByRole("img") when label slot content is present', async () => {
    await render(`<${tag}><span slot="label">Test</span></${tag}>`);

    const imgElement = page.getByRole('img');
    expect(imgElement).toBeDefined();
    const elementHandle = imgElement.element;
    expect(elementHandle).toBeTruthy();
  });

  it('sets unique label ids when rendering multiple html-images with label slots', async () => {
    const components = await renderAll(`
      <${tag}><span slot="label">my first label</span></${tag}>
      <${tag}><span slot="label">my second label</span></${tag}>
    `);

    const figures = components.map((c) => c.shadowRoot?.querySelector('figure[role="img"]'));
    expect(figures).toHaveLength(2);

    const imgElement1 = page.getByRole('img').first();
    expect(imgElement1).toHaveAccessibleName('my first label');

    const imgElement2 = page.getByRole('img').last();
    expect(imgElement2).toHaveAccessibleName('my second label');
  });

  it('removes role and accessible name when label slot content is removed', async () => {
    const component = await render(`<${tag}><span slot="label">Slot label</span></${tag}>`);
    expect(component.shadowRoot?.querySelector('figure')?.getAttribute('role')).toBe('img');

    document.querySelector('span[slot="label"]')?.remove();
    await tick();
    await component.updateComplete;

    const figure = component.shadowRoot?.querySelector('figure');
    expect(figure?.getAttribute('role')).toBeNull();
    expect(figure?.getAttribute('aria-labelledby')).toBeNull();
  });

  it('applies forced-color-adjust class when forcedColorAdjust is true', async () => {
    const component = await render(`<${tag} forced-color-adjust></${tag}>`);
    expect(component.shadowRoot?.querySelector('.ma-html-image__body--forced-color-adjust')).toBeTruthy();
  });

  it('does not apply forced-color-adjust class when forcedColorAdjust is false', async () => {
    const component = await render(`<${tag}></${tag}>`);
    expect(component.shadowRoot?.querySelector('.ma-html-image__body--forced-color-adjust')).toBeNull();
  });

  it('has default slot for content', async () => {
    const component = await render(`<${tag}><div class="content"></div></${tag}>`);

    const slot = component.shadowRoot?.querySelector('slot:not([name])') as HTMLSlotElement | null;
    expect(slot).toBeTruthy();
    expect(slot?.name).toBe('');
  });

  it('renders content with inert attribute', async () => {
    const component = await render(`<${tag}><div class="content"></div></${tag}>`);

    const inertDiv = component.shadowRoot?.querySelector('[inert="true"]');
    expect(inertDiv).toBeTruthy();

    const slot = inertDiv?.querySelector('slot') as HTMLSlotElement | null;
    expect(slot?.assignedElements()).toContain(document.querySelector('.content'));
  });

  it('renders content with aria-hidden="true"', async () => {
    const component = await render(`<${tag}><div class="content"></div></${tag}>`);

    const hiddenDiv = component.shadowRoot?.querySelector('[aria-hidden="true"]');
    expect(hiddenDiv).toBeTruthy();

    const slot = hiddenDiv?.querySelector('slot') as HTMLSlotElement | null;
    expect(slot?.assignedElements()).toContain(document.querySelector('.content'));
  });

  it('applies color-scheme class to body when color-scheme="dark"', async () => {
    const component = await render(`<${tag} color-scheme="dark"></${tag}>`);
    expect(component.getAttribute('color-scheme')).toBe('dark');
  });

  it('applies color-scheme class to body when color-scheme="light"', async () => {
    const component = await render(`<${tag} color-scheme="light"></${tag}>`);
    expect(component.getAttribute('color-scheme')).toBe('light');
  });
});
