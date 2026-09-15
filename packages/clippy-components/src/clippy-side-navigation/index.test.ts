import './index';
import { describe, expect, it, afterEach, beforeEach } from 'vitest';
import { page } from 'vitest/browser';
import { nestedWithActive, simple, twoBranches, unrelatedActive } from './fixtures';
import { ClippySideNavigation } from './index';

const tag = 'clippy-side-navigation';

describe(`<${tag}>`, () => {
  let component: ClippySideNavigation;

  // helpers
  const getLinks = () => Array.from(component.shadowRoot!.querySelectorAll('a'));
  const getExpandButtons = () => Array.from(component.shadowRoot!.querySelectorAll<HTMLButtonElement>('button'));
  const getAriaExpanded = (btn: Element) => btn.getAttribute('aria-expanded');
  const getAriaCurrent = (link: Element) => link.getAttribute('aria-current');

  beforeEach(() => {
    document.body.innerHTML = `<${tag}></${tag}>`;
    component = document.querySelector(tag) as ClippySideNavigation;
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

  describe('Expand buttons', () => {
    it('only items with children receive an expand button', async () => {
      component.items = nestedWithActive;
      await component.updateComplete;
      const buttons = getExpandButtons();
      expect(buttons).toHaveLength(2);
    });

    it('expand buttons start aria-expanded="false" when no active descendant', async () => {
      component.items = twoBranches;
      await component.updateComplete;
      const buttons = getExpandButtons();
      buttons.forEach((b) => expect(getAriaExpanded(b)).toBe('false'));
    });

    it('expand buttons have default open and closed labels', async () => {
      component.items = unrelatedActive;
      await component.updateComplete;
      const buttons = getExpandButtons();
      expect(buttons[0].textContent.trim()).toBe('Close submenu for: Page 1');
      expect(buttons[1].textContent.trim()).toBe('Open submenu for: Page 2');
    });

    it('expand buttons can have custom open and closed labels', async () => {
      component.items = unrelatedActive;
      component.labelExpandOpen = 'Open:';
      component.labelExpandClose = 'Close:';
      await component.updateComplete;
      const buttons = getExpandButtons();
      expect(buttons[0].textContent.trim()).toBe('Close: Page 1');
      expect(buttons[1].textContent.trim()).toBe('Open: Page 2');
    });
  });

  describe('auto-expansion for active nested items', () => {
    it('expands all ancestors of an active nested page', async () => {
      component.items = nestedWithActive;
      await component.updateComplete;
      const buttons = getExpandButtons();
      expect(getAriaExpanded(buttons[0])).toBe('true');
      expect(getAriaExpanded(buttons[1])).toBe('true');
    });

    it('does NOT auto-expand unrelated branches', async () => {
      component.items = unrelatedActive;
      await component.updateComplete;
      const buttons = getExpandButtons();
      expect(getAriaExpanded(buttons[0])).toBe('true');
      expect(getAriaExpanded(buttons[1])).toBe('false');
    });
  });

  describe('toggle behavior', () => {
    it('clicking expand button toggles aria-expanded', async () => {
      component.items = twoBranches;
      await component.updateComplete;
      const buttons = getExpandButtons();
      expect(getAriaExpanded(buttons[0])).toBe('false');

      buttons[0].click();
      await component.updateComplete;
      expect(getAriaExpanded(buttons[0])).toBe('true');

      buttons[0].click();
      await component.updateComplete;
      expect(getAriaExpanded(buttons[0])).toBe('false');
    });

    it('collapsing a node only applies aria-expanded="false" the collapsed node', async () => {
      component.items = nestedWithActive;
      await component.updateComplete;
      const buttons = getExpandButtons();
      expect(getAriaExpanded(buttons[0])).toBe('true');
      expect(getAriaExpanded(buttons[1])).toBe('true');

      buttons[0].click();
      await component.updateComplete;

      const updated = getExpandButtons();
      expect(getAriaExpanded(updated[0])).toBe('false');
      expect(getAriaExpanded(updated[1])).toBe('true');
    });

    it('expanding a node does not affect other branches', async () => {
      component.items = twoBranches;
      await component.updateComplete;
      const buttons = getExpandButtons();
      expect(getAriaExpanded(buttons[0])).toBe('false');
      expect(getAriaExpanded(buttons[1])).toBe('false');

      buttons[0].click();
      await component.updateComplete;

      expect(getAriaExpanded(buttons[0])).toBe('true');
      expect(getAriaExpanded(buttons[1])).toBe('false');
    });

    it('collapsing a node with "cascadeCollapse" cascades aria-expanded="false" to all descendants', async () => {
      component.items = nestedWithActive;
      component.cascadeCollapse = true;
      await component.updateComplete;
      const buttons = getExpandButtons();
      expect(getAriaExpanded(buttons[0])).toBe('true');
      expect(getAriaExpanded(buttons[1])).toBe('true');

      buttons[0].click();
      await component.updateComplete;

      const updated = getExpandButtons();
      expect(getAriaExpanded(updated[0])).toBe('false');
      expect(getAriaExpanded(updated[1])).toBe('false');
    });
  });
});
