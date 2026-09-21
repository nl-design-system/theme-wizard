import './index';
import { describe, expect, it, afterEach } from 'vitest';
import { ClippyCardAsLinkArticle } from './index';

const tag = 'clippy-card-as-link-article';

describe(`<${tag}>`, () => {
  let component: ClippyCardAsLinkArticle;

  afterEach(() => {
    document.body.innerHTML = '';
  });

  describe('Basic rendering', () => {
    it('renders', async () => {
      document.body.innerHTML = `<${tag}></${tag}>`;
      component = document.querySelector(tag) as ClippyCardAsLinkArticle;
      await component.updateComplete;
      await expect.element(component).toBeInTheDocument();
    });

    it('inherits the pre-header/header/body/footer slots from clippy-card', async () => {
      document.body.innerHTML = `
        <${tag}>
          <span slot="pre-header">pre-header</span>
          <span slot="header">header</span>
          <span slot="body">body</span>
          <span slot="footer">footer</span>
        </${tag}>
      `;
      component = document.querySelector(tag) as ClippyCardAsLinkArticle;
      await component.updateComplete;
      const root = component.shadowRoot;

      const textOf = (selector: string): string =>
        (root?.querySelector(selector) as HTMLSlotElement)
          .assignedNodes()
          .map((n) => n.textContent?.trim())
          .join('');

      expect(textOf('slot[name="pre-header"]')).toBe('pre-header');
      expect(textOf('slot[name="header"]')).toBe('header');
      expect(textOf('slot[name="body"]')).toBe('body');
      expect(textOf('slot[name="footer"]')).toBe('footer');
    });
  });

  describe('pre-header media defaults', () => {
    it('zeroes the pre-header wrapper padding by default', async () => {
      document.body.innerHTML = `<${tag}><div slot="pre-header">image</div></${tag}>`;
      component = document.querySelector(tag) as ClippyCardAsLinkArticle;
      await component.updateComplete;
      await component.updateComplete;
      const wrapper = component.shadowRoot?.querySelector('.clippy-card__pre-header') as HTMLElement;
      expect(getComputedStyle(wrapper).paddingBlockStart).toBe('0px');
    });

    it('forces directly-slotted pre-header media onto a full-width block line', async () => {
      // The rule also sets border-start-*-radius from clippy-card's token, but getComputedStyle
      // doesn't consistently expose the logical property, and the test environment doesn't load
      // the real --basis-* tokens — so only the reliably-assertable part is checked here.
      document.body.innerHTML = `<${tag}><div slot="pre-header">image</div></${tag}>`;
      component = document.querySelector(tag) as ClippyCardAsLinkArticle;
      await component.updateComplete;
      const media = component.querySelector('[slot="pre-header"]') as HTMLElement;
      expect(getComputedStyle(media).display).toBe('block');
    });
  });

  describe('stretched-link overlay', () => {
    it('generates a stretched ::after overlay on a directly-slotted <a>', async () => {
      document.body.innerHTML = `<${tag}><a slot="header" href="/x"><h2>Title</h2></a></${tag}>`;
      component = document.querySelector(tag) as ClippyCardAsLinkArticle;
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
      component = document.querySelector(tag) as ClippyCardAsLinkArticle;
      await component.updateComplete;
      const anchor = component.querySelector('a') as HTMLAnchorElement;
      anchor.focus();
      expect(component.matches(':focus-within')).toBe(true);
    });
  });
});
