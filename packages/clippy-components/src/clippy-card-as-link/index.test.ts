import './index';
import { describe, expect, it, afterEach } from 'vitest';
import { ClippyCardAsLink } from './index';

const tag = 'clippy-card-as-link';

describe(`<${tag}>`, () => {
  let component: ClippyCardAsLink;

  afterEach(() => {
    document.body.innerHTML = '';
  });

  describe('Basic rendering', () => {
    it('renders', async () => {
      document.body.innerHTML = `<${tag}></${tag}>`;
      component = document.querySelector(tag) as ClippyCardAsLink;
      await component.updateComplete;
      await expect.element(component).toBeInTheDocument();
    });

    it('projects the link slot', async () => {
      document.body.innerHTML = `<${tag}><a slot="link" href="/x">Title</a></${tag}>`;
      component = document.querySelector(tag) as ClippyCardAsLink;
      await component.updateComplete;
      const slot = component.shadowRoot?.querySelector('slot[name="link"]') as HTMLSlotElement;
      const [assigned] = slot.assignedElements();
      expect(assigned?.getAttribute('href')).toBe('/x');
    });

    it('renders the link slot right after the header, before pre-header/body/footer', async () => {
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

  describe('stretched link', () => {
    it('positions the slotted link absolutely, stretched over the host', async () => {
      document.body.innerHTML = `<${tag}><a slot="link" href="/x">Title</a></${tag}>`;
      component = document.querySelector(tag) as ClippyCardAsLink;
      await component.updateComplete;
      const anchor = component.querySelector('a') as HTMLAnchorElement;
      const style = getComputedStyle(anchor);
      expect(style.position).toBe('absolute');
      expect(style.inset).toBe('0px');
    });

    it('visually hides the anchor text without removing it from the accessibility tree', async () => {
      document.body.innerHTML = `<${tag}><a slot="link" href="/x">Accessible name</a></${tag}>`;
      component = document.querySelector(tag) as ClippyCardAsLink;
      await component.updateComplete;
      const anchor = component.querySelector('a') as HTMLAnchorElement;
      expect(anchor.textContent?.trim()).toBe('Accessible name');
      expect(getComputedStyle(anchor).textIndent).not.toBe('0px');
    });
  });

  describe('focus', () => {
    it(':focus-within matches when the link is focused', async () => {
      document.body.innerHTML = `<${tag}><a slot="link" href="/x">Title</a></${tag}>`;
      component = document.querySelector(tag) as ClippyCardAsLink;
      await component.updateComplete;
      const anchor = component.querySelector('a') as HTMLAnchorElement;
      anchor.focus();
      expect(component.matches(':focus-within')).toBe(true);
    });

    it('reflects link-focus-visible on the host while a focus-visible descendant is focused', async () => {
      document.body.innerHTML = `<${tag}><a slot="link" href="/x">Title</a></${tag}>`;
      component = document.querySelector(tag) as ClippyCardAsLink;
      await component.updateComplete;
      const anchor = component.querySelector('a') as HTMLAnchorElement;
      anchor.focus();
      expect(component.hasAttribute('link-focus-visible')).toBe(anchor.matches(':focus-visible'));
    });

    it('removes link-focus-visible from the host once focus leaves', async () => {
      document.body.innerHTML = `<${tag}><a slot="link" href="/x">Title</a></${tag}>`;
      component = document.querySelector(tag) as ClippyCardAsLink;
      await component.updateComplete;
      const anchor = component.querySelector('a') as HTMLAnchorElement;
      anchor.focus();
      anchor.blur();
      expect(component.hasAttribute('link-focus-visible')).toBe(false);
    });
  });
});
