import './index';
import { describe, expect, it, afterEach } from 'vitest';
import { page } from 'vitest/browser';
import { ClippyCardAsLink } from './index';

const tag = 'clippy-card-as-link';

describe(`<${tag}>`, () => {
  let component: ClippyCardAsLink;

  afterEach(() => {
    document.body.innerHTML = '';
  });

  describe('Basic rendering', () => {
    it('renders', async () => {
      document.body.innerHTML = `
        <${tag}></${tag}>
      `;
      component = document.querySelector(tag) as ClippyCardAsLink;
      await component.updateComplete;
      await expect.element(component).toBeInTheDocument();
    });

    it('projects the link slot', async () => {
      document.body.innerHTML = `
        <${tag}>
          <a slot="link" href="/x">Title</a>
        </${tag}>
      `;
      component = document.querySelector(tag) as ClippyCardAsLink;
      await component.updateComplete;
      const slot = component.shadowRoot?.querySelector('slot[name="link"]') as HTMLSlotElement;
      const [assigned] = slot.assignedElements();
      expect(assigned?.getAttribute('href')).toBe('/x');
    });

    it('renders the slots in the correct DOM order', async () => {
      document.body.innerHTML = `
        <${tag}>
          <a slot="link" href="/x">Title</a>
          <span slot="pre-header">pre-header</span>
          <span slot="header">header</span>
          <span slot="body">body</span>
          <span slot="footer">footer</span>
        </${tag}>
      `;
      component = document.querySelector(tag) as ClippyCardAsLink;
      await component.updateComplete;
      const slotNames = [...(component.shadowRoot?.querySelectorAll('slot') ?? [])].map((slot) => slot.name);
      expect(slotNames).toEqual(['header', 'link', 'pre-header', 'body', 'footer']);
    });
  });

  it('stretches the link over the host while visually hiding its text, without removing it from the accessibility tree', async () => {
    document.body.innerHTML = `
      <${tag}>
        <a slot="link" href="/x">Accessible name</a>
      </${tag}>
    `;
    component = document.querySelector(tag) as ClippyCardAsLink;
    await component.updateComplete;

    const link = page.getByRole('link', { name: 'Accessible name' });
    await expect.element(link).toBeInTheDocument();
    await expect.element(link).not.toBeVisible();
  });

  it('exposes a full accessibility tree covering every region and the link', async () => {
    document.body.innerHTML = `
      <${tag}>
        <a slot="link" href="/x">Read the full article</a>
        <span slot="pre-header">Category</span>
        <h2 slot="header">Article title</h2>
        <p slot="body">Article summary text.</p>
        <span slot="footer">5 min read</span>
      </${tag}>
    `;
    component = document.querySelector(tag) as ClippyCardAsLink;
    await component.updateComplete;

    await expect.element(component).toMatchAriaInlineSnapshot(`
      - heading "Article title" [level=2]
      - link "Read the full article":
        - /url: /x
      - text: Category
      - paragraph: Article summary text.
      - text: 5 min read
    `);
  });

  describe('focus', () => {
    it(':focus-within matches when the link is focused', async () => {
      document.body.innerHTML = `
        <${tag}>
          <a slot="link" href="/x">Title</a>
        </${tag}>
      `;
      component = document.querySelector(tag) as ClippyCardAsLink;
      await component.updateComplete;
      const anchor = component.querySelector('a') as HTMLAnchorElement;
      anchor.focus();
      expect(component.matches(':focus-within')).toBe(true);
    });

    it('reflects link-focus-visible on the host while a focus-visible descendant is focused', async () => {
      document.body.innerHTML = `
        <${tag}>
          <a slot="link" href="/x">Title</a>
        </${tag}>
      `;
      component = document.querySelector(tag) as ClippyCardAsLink;
      await component.updateComplete;
      const anchor = component.querySelector('a') as HTMLAnchorElement;
      anchor.focus();
      expect(component.hasAttribute('link-focus-visible')).toBe(anchor.matches(':focus-visible'));
    });

    it('removes link-focus-visible from the host once focus leaves', async () => {
      document.body.innerHTML = `
        <${tag}>
          <a slot="link" href="/x">Title</a>
        </${tag}>
      `;
      component = document.querySelector(tag) as ClippyCardAsLink;
      await component.updateComplete;
      const anchor = component.querySelector('a') as HTMLAnchorElement;
      anchor.focus();
      anchor.blur();
      expect(component.hasAttribute('link-focus-visible')).toBe(false);
    });
  });
});
