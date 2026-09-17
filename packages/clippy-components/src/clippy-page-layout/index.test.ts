import './index';
import { describe, expect, it, afterEach, beforeEach } from 'vitest';
import { ClippyPageLayout } from './index';

const tag = 'clippy-page-layout';

describe(`<${tag}>`, () => {
  let component: ClippyPageLayout;

  beforeEach(() => {
    document.body.innerHTML = `
      <${tag}>
        <span slot="header">header</span>
        <span>content</span>
        <span slot="footer">footer</span>
      </${tag}>
    `;
    component = document.querySelector(tag) as ClippyPageLayout;
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  describe('Basic rendering', () => {
    it('renders', async () => {
      await component.updateComplete;
      await expect.element(component).toBeInTheDocument();
    });

    it('projects light DOM children into their slots', async () => {
      await component.updateComplete;
      const root = component.shadowRoot;

      const textOf = (selector: string): string =>
        (root?.querySelector(selector) as HTMLSlotElement)
          .assignedNodes()
          .map((n) => n.textContent?.trim())
          .join('');

      expect(textOf('slot[name="header"]')).toBe('header');
      expect(textOf('slot[name="footer"]')).toBe('footer');
      expect(textOf('slot:not([name])')).toBe('content');
    });
  });
});
