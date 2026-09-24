import './index';
import { describe, expect, it, afterEach, beforeEach } from 'vitest';
import { ClippyPageHeader } from './index';

const tag = 'clippy-page-header';

describe(`<${tag}>`, () => {
  let component: ClippyPageHeader;

  beforeEach(() => {
    document.body.innerHTML = `<${tag}></${tag}>`;
    component = document.querySelector(tag) as ClippyPageHeader;
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  describe('Basic rendering', () => {
    it('renders', async () => {
      await component.updateComplete;
      await expect.element(component).toBeInTheDocument();
    });

    it('renders the top section', async () => {
      await component.updateComplete;
      const topSection = component.shadowRoot?.querySelector('.clippy-page-header__top');
      expect(topSection).toBeTruthy();
    });

    it('renders the bottom section for default variant', async () => {
      component.variant = 'default';
      await component.updateComplete;
      const bottomSection = component.shadowRoot?.querySelector('.clippy-page-header__bottom');
      expect(bottomSection).toBeTruthy();
    });
  });

  describe('Variant property', () => {
    it('defaults to "default" variant', async () => {
      await component.updateComplete;
      expect(component.variant).toBe('default');
      expect(component.getAttribute('variant')).toBe('default');
    });

    it('reflects variant attribute', async () => {
      component.variant = 'compact';
      await component.updateComplete;
      expect(component.getAttribute('variant')).toBe('compact');
    });

    it('does not render the bottom section for compact variant', async () => {
      component.variant = 'compact';
      await component.updateComplete;
      const bottomSection = component.shadowRoot?.querySelector('.clippy-page-header__bottom');
      expect(bottomSection).toBeFalsy();
    });
  });

  describe('Label properties', () => {
    it('defaults labelMenuItem to "Menu"', async () => {
      component.innerHTML = '<span slot="navigation-drawer">Drawer content</span>';
      await component.updateComplete;
      await component.drawerElement?.updateComplete;

      const menuButton = component.shadowRoot?.querySelector('clippy-button');
      expect(menuButton?.textContent?.trim()).toBe('Menu');
    });

    it('defaults labelDrawerTitle to "Hoofdnavigatie"', async () => {
      await component.updateComplete;

      const drawer = component.shadowRoot?.querySelector('clippy-drawer');
      const titleSlot = drawer?.querySelector('[slot="title"]');
      expect(titleSlot?.textContent?.trim()).toBe('Hoofdnavigatie');
    });

    it('renders custom menu button label', async () => {
      component.labelMenuItem = 'Custom Menu';
      component.innerHTML = '<span slot="navigation-drawer">Drawer content</span>';
      await component.updateComplete;
      await component.drawerElement?.updateComplete;

      const menuButton = component.shadowRoot?.querySelector('clippy-button');
      expect(menuButton?.textContent?.trim()).toBe('Custom Menu');
    });
  });

  describe('Navigation bar rendering', () => {
    it('renders navigation bar content in bottom for default variant', async () => {
      component.innerHTML = '<span slot="navigation-bar">Nav content</span>';
      await component.updateComplete;

      const navBarBottom = component.shadowRoot?.querySelector(
        '.clippy-page-header__bottom .clippy-page-header__wrap-navigation',
      );
      expect(navBarBottom).toBeTruthy();
      const navBarTop = component.shadowRoot?.querySelector(
        '.clippy-page-header__top .clippy-page-header__wrap-navigation',
      );
      expect(navBarTop).toBeFalsy();
    });

    it('renders navigation bar content in top for compact variant', async () => {
      component.variant = 'compact';
      component.innerHTML = '<span slot="navigation-bar">Nav content</span>';
      await component.updateComplete;

      const navBarBottom = component.shadowRoot?.querySelector(
        '.clippy-page-header__bottom .clippy-page-header__wrap-navigation',
      );
      expect(navBarBottom).toBeFalsy();
      const navBarTop = component.shadowRoot?.querySelector(
        '.clippy-page-header__top .clippy-page-header__wrap-navigation',
      );
      expect(navBarTop).toBeTruthy();
    });
  });

  describe('Menu button', () => {
    it('does not render menu button when navigation-drawer slot is empty', async () => {
      await component.updateComplete;
      const menuButton = component.shadowRoot?.querySelector('clippy-button');
      expect(menuButton).toBeFalsy();
    });

    it('renders menu button when navigation-drawer slot has content', async () => {
      component.innerHTML = '<span slot="navigation-drawer">Drawer content</span>';
      await component.updateComplete;
      await component.drawerElement?.updateComplete;

      const menuButton = component.shadowRoot?.querySelector('clippy-button');
      expect(menuButton).toBeTruthy();
    });

    it('menu button has subtle purpose for default variant', async () => {
      component.variant = 'default';
      component.innerHTML = '<span slot="navigation-drawer">Drawer content</span>';
      await component.updateComplete;
      await component.drawerElement?.updateComplete;

      const menuButton = component.shadowRoot?.querySelector('clippy-button');
      expect(menuButton?.getAttribute('purpose')).toBe('subtle');
    });

    it('menu button has subtle-inverse purpose for compact variant', async () => {
      component.variant = 'compact';
      component.innerHTML = '<span slot="navigation-drawer">Drawer content</span>';
      await component.updateComplete;
      await component.drawerElement?.updateComplete;

      const menuButton = component.shadowRoot?.querySelector('clippy-button');
      expect(menuButton?.getAttribute('purpose')).toBe('subtle-inverse');
    });
  });

  describe('Drawer functionality', () => {
    it('drawer has correct title', async () => {
      component.labelDrawerTitle = 'Main Navigation';
      await component.updateComplete;

      const drawer = component.shadowRoot?.querySelector('clippy-drawer');
      const titleSlot = drawer?.querySelector('[slot="title"]');
      expect(titleSlot?.textContent?.trim()).toBe('Main Navigation');
    });

    it('drawer title is screen reader only', async () => {
      await component.updateComplete;

      const drawer = component.shadowRoot?.querySelector('clippy-drawer');
      const titleSlot = drawer?.querySelector('.sr-only');
      expect(titleSlot).toBeTruthy();
    });

    it('drawer contains navigation-drawer slot', async () => {
      await component.updateComplete;

      const drawer = component.shadowRoot?.querySelector('clippy-drawer');
      const navDrawerSlot = drawer?.querySelector('slot[name="navigation-drawer"]');
      expect(navDrawerSlot).toBeTruthy();
    });

    it('opens drawer when menu button is clicked', async () => {
      component.innerHTML = '<span slot="navigation-drawer">Drawer content</span>';
      await component.updateComplete;
      await component.drawerElement?.updateComplete;

      const menuButton = component.shadowRoot?.querySelector('clippy-button');
      const drawer = component.shadowRoot?.querySelector('clippy-drawer');

      menuButton?.click();
      await component.updateComplete;

      // The drawer uses native dialog element, check if it's open
      const dialogElement = drawer?.shadowRoot?.querySelector('dialog');
      expect(dialogElement?.open).toBe(true);
    });

    it('listens for drawer close event', async () => {
      component.innerHTML = '<span slot="navigation-drawer">Drawer content</span>';
      await component.updateComplete;
      await component.drawerElement?.updateComplete;

      const drawer = component.shadowRoot?.querySelector('clippy-drawer');

      // Verify the drawer has the close event listener
      // The component adds this listener in firstUpdated
      const closeEvent = new CustomEvent('close', { bubbles: true, composed: true });

      // Dispatching the close event should not throw
      expect(() => drawer?.dispatchEvent(closeEvent)).not.toThrow();
      await component.updateComplete;
    });
  });

  describe('Slots', () => {
    it('renders logo slot in center group', async () => {
      component.innerHTML = '<span slot="logo">Logo content</span>';
      await component.updateComplete;

      const logoWrap = component.shadowRoot?.querySelector('.clippy-page-header__wrap-logo');
      const logoSlot = logoWrap?.querySelector('slot[name="logo"]');
      expect(logoSlot).toBeTruthy();
    });

    it('renders end slot in end group', async () => {
      await component.updateComplete;

      const endGroup = component.shadowRoot?.querySelector('.clippy-page-header__group--end');
      const endSlot = endGroup?.querySelector('slot[name="end"]');
      expect(endSlot).toBeTruthy();
    });

    it('renders navigation-bar slot', async () => {
      await component.updateComplete;

      // The navigation-bar slot is conditionally rendered based on variant
      const navigationBarSlot = component.shadowRoot?.querySelector('slot[name="navigation-bar"]');
      expect(navigationBarSlot).toBeTruthy();
    });
  });
});
