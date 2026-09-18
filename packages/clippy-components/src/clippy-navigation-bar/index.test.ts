import './index';
import { describe, expect, it, afterEach, beforeEach } from 'vitest';
import { page } from 'vitest/browser';
import { simple, linkAttributes } from './fixtures';
import { ClippyNavigationBar } from './index';

const tag = 'clippy-navigation-bar';

describe(`<${tag}>`, () => {
  let component: ClippyNavigationBar;

  // helpers
  const getLinks = () => Array.from(component.shadowRoot!.querySelectorAll('a'));
  const getAriaCurrent = (link: Element) => link.getAttribute('aria-current');

  beforeEach(() => {
    document.body.innerHTML = `<${tag}></${tag}>`;
    component = document.querySelector(tag) as ClippyNavigationBar;
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  describe('Basic rendering', () => {
    it('renders', async () => {
      await component.updateComplete;
      await expect.element(component).toBeInTheDocument();
    });

    it('Renders nothing when no items are provided', async () => {
      await component.updateComplete;
      expect(component.shadowRoot?.querySelector('nav')).toBeFalsy();
    });

    it('Renders a nav element when items are provided', async () => {
      component.items = simple;
      await component.updateComplete;
      const links = getLinks();
      expect(links).toHaveLength(2);
      expect(links[0].textContent?.trim()).toBe('Page 1');
      expect(links[1].textContent?.trim()).toBe('Page 2');
    });

    it('applies aria-current="page" to the active link', async () => {
      component.items = simple;
      await component.updateComplete;
      const links = getLinks();
      expect(getAriaCurrent(links[0])).toBe('page');
      expect(getAriaCurrent(links[1])).toBeNull();
    });

    it('correctly applies label', async () => {
      component.items = simple;
      component.label = 'Nav label';
      await component.updateComplete;
      expect(page.getByLabelText('Nav label')).toBeTruthy();
    });
  });

  describe('link attributes', () => {
    it('applies a selection of HTMLAnchorElemnt’s properties', async () => {
      component.items = linkAttributes;
      await component.updateComplete;
      const links = getLinks();
      expect(links[0].getAttribute('hreflang')).toBe('nl');
      expect(links[0].getAttribute('lang')).toBe('nl');
      expect(links[0].getAttribute('target')).toBe('_blank');
    });
  });
});
