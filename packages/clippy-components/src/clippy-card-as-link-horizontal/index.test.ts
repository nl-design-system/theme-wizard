import './index';
import { describe, expect, it, afterEach } from 'vitest';
import { ClippyCardAsLinkHorizontal } from './index';

const tag = 'clippy-card-as-link-horizontal';

describe(`<${tag}>`, () => {
  let component: ClippyCardAsLinkHorizontal;

  afterEach(() => {
    document.body.innerHTML = '';
  });

  describe('Basic rendering', () => {
    it('renders', async () => {
      document.body.innerHTML = `<${tag}></${tag}>`;
      component = document.querySelector(tag) as ClippyCardAsLinkHorizontal;
      await component.updateComplete;
      await expect.element(component).toBeInTheDocument();
    });

    it('inherits the header/footer slots from clippy-card', async () => {
      document.body.innerHTML = `
        <${tag}>
          <span slot="header">header</span>
          <span slot="footer">footer</span>
        </${tag}>
      `;
      component = document.querySelector(tag) as ClippyCardAsLinkHorizontal;
      await component.updateComplete;
      const root = component.shadowRoot;

      const textOf = (selector: string): string =>
        (root?.querySelector(selector) as HTMLSlotElement)
          .assignedNodes()
          .map((n) => n.textContent?.trim())
          .join('');

      expect(textOf('slot[name="header"]')).toBe('header');
      expect(textOf('slot[name="footer"]')).toBe('footer');
    });

    it('lays out as a row', async () => {
      document.body.innerHTML = `<${tag}></${tag}>`;
      component = document.querySelector(tag) as ClippyCardAsLinkHorizontal;
      await component.updateComplete;
      expect(getComputedStyle(component).flexDirection).toBe('row');
    });
  });

  describe('stretched link', () => {
    it('positions the slotted link absolutely, stretched over the row', async () => {
      document.body.innerHTML = `
        <${tag}>
          <a slot="link" href="/x">Title</a>
          <h2 slot="header">Title</h2>
        </${tag}>
      `;
      component = document.querySelector(tag) as ClippyCardAsLinkHorizontal;
      await component.updateComplete;
      const anchor = component.querySelector('a[slot="link"]') as HTMLAnchorElement;

      expect(getComputedStyle(anchor).position).toBe('absolute');
    });
  });

  describe('focus', () => {
    it(':focus-within matches when the link is focused', async () => {
      document.body.innerHTML = `
        <${tag}>
          <a slot="link" href="/x">Title</a>
          <h2 slot="header">Title</h2>
        </${tag}>
      `;
      component = document.querySelector(tag) as ClippyCardAsLinkHorizontal;
      await component.updateComplete;
      const anchor = component.querySelector('a[slot="link"]') as HTMLAnchorElement;
      anchor.focus();
      expect(component.matches(':focus-within')).toBe(true);
    });
  });
});
