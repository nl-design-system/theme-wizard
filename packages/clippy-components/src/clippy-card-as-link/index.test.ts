import './index';
import { describe, expect, it, afterEach, vi } from 'vitest';
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

    it('defaults to the "default" appearance', async () => {
      document.body.innerHTML = `<${tag}></${tag}>`;
      component = document.querySelector(tag) as ClippyCardAsLink;
      await component.updateComplete;
      expect(component.appearance).toBe('default');
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
      component = document.querySelector(tag) as ClippyCardAsLink;
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

  describe('appearance', () => {
    it('reflects a valid value to the attribute', async () => {
      document.body.innerHTML = `<${tag} appearance="case"></${tag}>`;
      component = document.querySelector(tag) as ClippyCardAsLink;
      await component.updateComplete;
      expect(component.appearance).toBe('case');
      expect(component.getAttribute('appearance')).toBe('case');
    });

    it('warns and falls back to "default" for an invalid value', async () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
      document.body.innerHTML = `<${tag} appearance="bogus"></${tag}>`;
      component = document.querySelector(tag) as ClippyCardAsLink;
      await component.updateComplete;

      expect(component.appearance).toBe('default');
      expect(warn).toHaveBeenCalled();
      warn.mockRestore();
    });
  });

  describe('archived', () => {
    it('reflects to the attribute', async () => {
      document.body.innerHTML = `<${tag} archived></${tag}>`;
      component = document.querySelector(tag) as ClippyCardAsLink;
      await component.updateComplete;
      expect(component.archived).toBe(true);
      expect(component.hasAttribute('archived')).toBe(true);
    });

    it('defaults to false', async () => {
      document.body.innerHTML = `<${tag}></${tag}>`;
      component = document.querySelector(tag) as ClippyCardAsLink;
      await component.updateComplete;
      expect(component.archived).toBe(false);
    });
  });
});
