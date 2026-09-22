import './index';
import { describe, expect, it, afterEach } from 'vitest';
import { ClippyCard } from './index';

const tag = 'clippy-card';

describe(`<${tag}>`, () => {
  let component: ClippyCard;

  afterEach(() => {
    document.body.innerHTML = '';
  });

  describe('Basic rendering', () => {
    it('renders', async () => {
      document.body.innerHTML = `<${tag}></${tag}>`;
      component = document.querySelector(tag) as ClippyCard;
      await component.updateComplete;
      await expect.element(component).toBeInTheDocument();
    });

    it('does not delegate focus into the shadow DOM', () => {
      expect(ClippyCard.shadowRootOptions.delegatesFocus).toBeFalsy();
    });

    it('projects light DOM children into their named slots', async () => {
      document.body.innerHTML = `
        <${tag}>
          <span slot="pre-header">pre-header</span>
          <span slot="header">header</span>
          <span slot="body">body</span>
          <span slot="footer">footer</span>
        </${tag}>
      `;
      component = document.querySelector(tag) as ClippyCard;
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

  describe('Region wrappers', () => {
    it('wraps a region in a container div once it has slotted content', async () => {
      document.body.innerHTML = `
        <${tag}>
          <span slot="pre-header">pre-header</span>
          <span slot="header">header</span>
          <span slot="body">body</span>
          <span slot="footer">footer</span>
        </${tag}>
      `;
      component = document.querySelector(tag) as ClippyCard;
      await component.updateComplete;
      // firstUpdated() resolves slot presence and writes @state, scheduling a follow-up
      // update cycle — await updateComplete again to flush it (documented Lit behavior).
      await component.updateComplete;
      const root = component.shadowRoot;

      expect(root?.querySelector('.clippy-card__pre-header')).not.toBeNull();
      expect(root?.querySelector('.clippy-card__header')).not.toBeNull();
      expect(root?.querySelector('.clippy-card__body')).not.toBeNull();
      expect(root?.querySelector('.clippy-card__footer')).not.toBeNull();
    });

    it('renders no wrapper div for a region without slotted content', async () => {
      document.body.innerHTML = `<${tag}><span slot="body">body only</span></${tag}>`;
      component = document.querySelector(tag) as ClippyCard;
      await component.updateComplete;
      await component.updateComplete;
      const root = component.shadowRoot;

      expect(root?.querySelector('.clippy-card__pre-header')).toBeNull();
      expect(root?.querySelector('.clippy-card__header')).toBeNull();
      expect(root?.querySelector('.clippy-card__body')).not.toBeNull();
      expect(root?.querySelector('.clippy-card__footer')).toBeNull();
    });

    it('renders header first in the shadow/a11y tree, ahead of link, pre-header, body, and footer', async () => {
      document.body.innerHTML = `
        <${tag}>
          <span slot="pre-header">pre-header</span>
          <h2 slot="header">header</h2>
          <a slot="link" href="#">link</a>
          <p slot="body">body</p>
          <span slot="footer">footer</span>
        </${tag}>
      `;
      component = document.querySelector(tag) as ClippyCard;
      await component.updateComplete;
      await component.updateComplete;

      // DOM order (not light-DOM author order) drives AT reading order. Visual order is
      // handled separately via CSS `order` — see index.ts render() comment and styles.ts.
      await expect.element(component).toMatchAriaInlineSnapshot(`
        - heading "header" [level=2]
        - link "link":
          - /url: "#"
        - text: pre-header
        - paragraph: body
        - text: footer
      `);
    });
  });
});
