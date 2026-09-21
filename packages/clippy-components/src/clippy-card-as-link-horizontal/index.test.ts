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

  describe('stretched-link overlay', () => {
    it('generates a stretched ::after overlay on a directly-slotted <a>', async () => {
      document.body.innerHTML = `<${tag}><a slot="header" href="/x"><h2>Title</h2></a></${tag}>`;
      component = document.querySelector(tag) as ClippyCardAsLinkHorizontal;
      await component.updateComplete;
      const anchor = component.querySelector('a') as HTMLAnchorElement;
      const after = getComputedStyle(anchor, '::after');

      expect(after.content).not.toBe('none');
      expect(after.position).toBe('absolute');
    });
  });

  describe('focus', () => {
    it(':focus-within matches when the slotted anchor is focused', async () => {
      document.body.innerHTML = `<${tag}><a slot="header" href="/x"><h2>Title</h2></a></${tag}>`;
      component = document.querySelector(tag) as ClippyCardAsLinkHorizontal;
      await component.updateComplete;
      const anchor = component.querySelector('a') as HTMLAnchorElement;
      anchor.focus();
      expect(component.matches(':focus-within')).toBe(true);
    });
  });
});
