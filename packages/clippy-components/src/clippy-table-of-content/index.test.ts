import './index';
import { describe, expect, it, afterEach, beforeEach } from 'vitest';
import { page } from 'vitest/browser';
import { simple, empty, nested } from './fixtures';
import { ClippyTableOfContent } from './index';

const tag = 'clippy-table-of-content';

describe(`<${tag}>`, () => {
  let component: ClippyTableOfContent;

  // helpers
  const getLinks = () => Array.from(component.shadowRoot!.querySelectorAll('a'));
  const getNav = () => component.shadowRoot!.querySelector('nav');
  const getHeading = () => component.shadowRoot!.querySelector('clippy-heading');

  beforeEach(() => {
    document.body.innerHTML = `<${tag}></${tag}>`;
    component = document.querySelector(tag) as ClippyTableOfContent;
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  describe('Basic rendering', () => {
    it('renders', async () => {
      await component.updateComplete;
      await expect.element(component).toBeInTheDocument();
    });

    it('renders a nav element', async () => {
      await component.updateComplete;
      expect(getNav()).toBeTruthy();
    });

    it('has a nav element with aria-labelledby', async () => {
      await component.updateComplete;
      const nav = getNav();
      expect(nav?.getAttribute('aria-labelledby')).toBeTruthy();
    });

    it('renders a clippy-heading with default label', async () => {
      await component.updateComplete;
      const heading = getHeading();
      expect(heading).toBeTruthy();
      expect(heading?.textContent?.trim()).toBe('Inhoudsopgave');
    });

    it('renders a clippy-heading with custom label', async () => {
      component.label = 'Custom Table of Contents';
      await component.updateComplete;
      const heading = getHeading();
      expect(heading?.textContent?.trim()).toBe('Custom Table of Contents');
    });

    it('renders an unordered list', async () => {
      component.items = simple;
      await component.updateComplete;
      const list = component.shadowRoot!.querySelector('ul');
      expect(list).toBeTruthy();
    });
  });

  describe('Items rendering', () => {
    it('renders navigation items when provided', async () => {
      component.items = simple;
      await component.updateComplete;
      const links = getLinks();
      expect(links).toHaveLength(2);
      expect(links[0].textContent?.trim()).toBe('Anchor 1');
      expect(links[1].textContent?.trim()).toBe('Anchor 2');
    });

    it('renders nothing in the list when items is empty', async () => {
      component.items = empty;
      await component.updateComplete;
      const links = getLinks();
      expect(links).toHaveLength(0);
    });

    it('renders nothing in the list when items is undefined', async () => {
      await component.updateComplete;
      const links = getLinks();
      expect(links).toHaveLength(0);
    });

    it('handles nested items (currently renders only top-level)', async () => {
      component.items = nested;
      await component.updateComplete;
      const links = getLinks();
      // Component currently only renders top-level items, not nested ones
      expect(links).toHaveLength(2);
      expect(links[0].textContent?.trim()).toBe('Parent 1');
      expect(links[1].textContent?.trim()).toBe('Parent 2');
    });
  });

  describe('Accessibility', () => {
    it('has proper heading level', async () => {
      component.items = simple;
      await component.updateComplete;
      const heading = getHeading();
      expect(heading?.getAttribute('level')).toBe('2');
    });

    it('nav element has correct aria-labelledby pointing to heading', async () => {
      component.items = simple;
      await component.updateComplete;
      const nav = getNav();
      const heading = getHeading();
      const navAriaLabelledBy = nav?.getAttribute('aria-labelledby');
      const headingId = heading?.getAttribute('id');
      expect(navAriaLabelledBy).toBe(headingId);
    });

    it('renders accessible label via clippy-heading', async () => {
      component.items = simple;
      component.label = 'Table of Contents';
      await component.updateComplete;
      expect(page.getByText('Table of Contents')).toBeTruthy();
    });
  });

  describe('Link structure', () => {
    it('links have correct href', async () => {
      component.items = simple;
      await component.updateComplete;
      const links = getLinks();
      expect(links[0].getAttribute('href')).toBe('#anchor-1');
      expect(links[1].getAttribute('href')).toBe('#anchor-2');
    });
  });
});
