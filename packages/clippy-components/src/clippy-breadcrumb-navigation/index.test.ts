import './index';
import { describe, expect, it, afterEach, beforeEach } from 'vitest';
import { simple, single } from './fixtures';
import { ClippyBreadcrumbNavigation } from './index';

const tag = 'clippy-breadcrumb-navigation';

describe(`<${tag}>`, () => {
  let component: ClippyBreadcrumbNavigation;

  // Helper functions
  const getLinks = () => Array.from(component.shadowRoot!.querySelectorAll('a'));
  const getListItems = () => Array.from(component.shadowRoot!.querySelectorAll('li'));
  const getNav = () => component.shadowRoot?.querySelector('nav');
  const getHeading = () => component.shadowRoot?.querySelector('clippy-heading');
  const getOl = () => component.shadowRoot?.querySelector('ol');

  beforeEach(() => {
    document.body.innerHTML = `<${tag}></${tag}>`;
    component = document.querySelector(tag) as ClippyBreadcrumbNavigation;
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

    it('renders nothing when no items are provided', async () => {
      await component.updateComplete;
      expect(getNav()).toBeTruthy();
      expect(getOl()?.querySelectorAll('li').length).toBe(0);
    });
  });

  describe('Items rendering', () => {
    it('renders list items for each breadcrumb item and separators', async () => {
      component.items = simple;
      await component.updateComplete;
      const listItems = getListItems();
      expect(listItems).toHaveLength(5);
    });

    it('renders the correct number of links', async () => {
      component.items = simple;
      await component.updateComplete;
      const links = getLinks();
      expect(links).toHaveLength(3);
    });

    it('renders link labels correctly', async () => {
      component.items = simple;
      await component.updateComplete;
      const links = getLinks();
      expect(links[0].textContent?.trim()).toBe('Path');
      expect(links[1].textContent?.trim()).toBe('To');
      expect(links[2].textContent?.trim()).toBe('Page');
    });

    it('renders link hrefs correctly', async () => {
      component.items = simple;
      await component.updateComplete;
      const links = getLinks();
      expect(links[0].getAttribute('href')).toBe('#path');
      expect(links[1].getAttribute('href')).toBe('#to');
    });

    it('renders a single item without separator', async () => {
      component.items = single;
      await component.updateComplete;
      const listItems = getListItems();
      expect(listItems).toHaveLength(1);
    });

    it('renders separators between items', async () => {
      component.items = simple;
      await component.updateComplete;
      const listItems = getListItems();
      const separatorItems = listItems.filter((li) => li.getAttribute('aria-hidden') === 'true');
      expect(separatorItems).toHaveLength(2);
    });
  });

  describe('Current item handling', () => {
    it('applies aria-current="page" to the current item', async () => {
      component.items = simple;
      await component.updateComplete;
      const links = getLinks();
      expect(links[0].getAttribute('aria-current')).toBeNull();
      expect(links[1].getAttribute('aria-current')).toBeNull();
      expect(links[2].getAttribute('aria-current')).toBe('page');
    });

    it('applies aria-disabled="page" to the current item', async () => {
      component.items = simple;
      await component.updateComplete;
      const links = getLinks();
      expect(links[0].getAttribute('aria-disabled')).toBeNull();
      expect(links[1].getAttribute('aria-disabled')).toBeNull();
      expect(links[2].getAttribute('aria-disabled')).toBe('true');
    });

    it('adds disabled class to current item link', async () => {
      component.items = simple;
      await component.updateComplete;
      const links = getLinks();
      expect(links[2].classList.contains('utrecht-breadcrumb-nav__link--disabled')).toBe(true);
    });

    it('omits href for current item', async () => {
      component.items = simple;
      await component.updateComplete;
      const links = getLinks();
      expect(links[2].hasAttribute('href')).toBe(false);
    });

    it('only item with current flag gets current property', async () => {
      component.items = simple;
      await component.updateComplete;
      const links = getLinks();
      expect(links[0].getAttribute('aria-current')).toBeNull();
      expect(links[1].getAttribute('aria-current')).toBeNull();
      expect(links[2].getAttribute('aria-current')).toBe('page');
    });
  });

  describe('Label property', () => {
    it('uses default label "Kruimelpad"', async () => {
      await component.updateComplete;
      const heading = getHeading();
      expect(heading?.textContent?.trim()).toBe('Kruimelpad');
    });

    it('renders custom label', async () => {
      component.label = 'Breadcrumb';
      await component.updateComplete;
      const heading = getHeading();
      expect(heading?.textContent?.trim()).toBe('Breadcrumb');
    });

    it('associates nav with label via aria-labelledby', async () => {
      component.items = simple;
      component.label = 'Custom Navigation';
      await component.updateComplete;
      const nav = getNav();
      const heading = getHeading();
      expect(nav?.getAttribute('aria-labelledby')).toBe(heading?.id);
    });
  });

  describe('Accessibility and semantic markup', () => {
    it('renders an ordered list', async () => {
      component.items = simple;
      await component.updateComplete;
      expect(getOl()).toBeTruthy();
    });

    it('has correct breadcrumb list itemtype', async () => {
      component.items = simple;
      await component.updateComplete;
      const ol = getOl();
      expect(ol?.getAttribute('itemtype')).toBe('https://schema.org/BreadcrumbList');
      expect(ol?.getAttribute('itemscope')).toBe('');
    });

    it('has correct itemtype on list items', async () => {
      component.items = simple;
      await component.updateComplete;
      const listItems = getListItems().filter((li) => !li.hasAttribute('aria-hidden'));
      listItems.forEach((li) => {
        expect(li.getAttribute('itemtype')).toBe('https://schema.org/ListItem');
        expect(li.getAttribute('itemscope')).toBe('');
        expect(li.getAttribute('itemprop')).toBe('itemListElement');
      });
    });

    it('has itemprop on links', async () => {
      component.items = simple;
      await component.updateComplete;
      const links = getLinks();
      links.forEach((link) => {
        expect(link.getAttribute('itemprop')).toBe('item');
      });
    });

    it('screen reader only heading is present', async () => {
      await component.updateComplete;
      const heading = getHeading();
      expect(heading?.classList.contains('sr-only')).toBe(true);
    });
  });
});
