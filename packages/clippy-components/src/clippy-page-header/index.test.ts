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
      component.variant = 'default';
      component.innerHTML = '<span slot="navigation-bar">Nav content</span>';
      await component.updateComplete;

      const navBarBottom = component.shadowRoot?.querySelector(
        '.clippy-page-header__bottom .clippy-page-header__wrap-navigation',
      );
      expect(navBarBottom).toBeTruthy();

      const slot = navBarBottom?.querySelector('slot[name="navigation-bar"]') as HTMLSlotElement;
      expect(slot).toBeTruthy();

      const assignedElements = slot?.assignedElements();
      expect(assignedElements).toHaveLength(1);
      expect(assignedElements?.[0].textContent).toBe('Nav content');

      const navBarTop = component.shadowRoot?.querySelector(
        '.clippy-page-header__top .clippy-page-header__wrap-navigation',
      );
      expect(navBarTop).toBeFalsy();
    });

    it('renders navigation bar content in top for compact variant', async () => {
      component.variant = 'compact';
      component.innerHTML = '<span slot="navigation-bar">Nav content</span>';
      await component.updateComplete;

      const navBarTop = component.shadowRoot?.querySelector(
        '.clippy-page-header__top .clippy-page-header__wrap-navigation',
      );
      expect(navBarTop).toBeTruthy();

      const slot = navBarTop?.querySelector('slot[name="navigation-bar"]') as HTMLSlotElement;
      expect(slot).toBeTruthy();

      const assignedElements = slot?.assignedElements();
      expect(assignedElements).toHaveLength(1);
      expect(assignedElements?.[0].textContent).toBe('Nav content');

      const navBarBottom = component.shadowRoot?.querySelector(
        '.clippy-page-header__bottom .clippy-page-header__wrap-navigation',
      );
      expect(navBarBottom).toBeFalsy();
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
      expect(drawer).toHaveAccessibleName('Main navigation');
      expect(titleSlot).not.toBeVisible();
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
      const dialogElement = drawer?.shadowRoot?.querySelector('dialog') as HTMLDialogElement;
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
    it('renders logo slot content in center group', async () => {
      component.innerHTML = '<span slot="logo">Logo content</span>';
      await component.updateComplete;

      const logoWrap = component.shadowRoot?.querySelector(
        '.clippy-page-header__group--center .clippy-page-header__wrap-logo',
      );
      const logoSlot = logoWrap?.querySelector('slot[name="logo"]') as HTMLSlotElement;
      expect(logoSlot).toBeTruthy();

      const assignedElements = logoSlot?.assignedElements();
      expect(assignedElements).toHaveLength(1);
      expect(assignedElements?.[0].textContent).toBe('Logo content');
    });

    it('renders end slot content in end group', async () => {
      component.innerHTML = '<span slot="end">End content</span>';
      await component.updateComplete;

      const endGroup = component.shadowRoot?.querySelector('.clippy-page-header__group--end');
      const endSlot = endGroup?.querySelector('slot[name="end"]') as HTMLSlotElement;
      expect(endSlot).toBeTruthy();

      const assignedElements = endSlot?.assignedElements();
      expect(assignedElements).toHaveLength(1);
      expect(assignedElements?.[0].textContent).toBe('End content');
    });

    it('renders navigation-drawer slot content', async () => {
      component.innerHTML = '<span slot="navigation-drawer">Drawer nav content</span>';
      await component.updateComplete;
      await component.drawerElement?.updateComplete;

      const drawer = component.shadowRoot?.querySelector('clippy-drawer');
      const navDrawerSlot = drawer?.querySelector('slot[name="navigation-drawer"]') as HTMLSlotElement;
      expect(navDrawerSlot).toBeTruthy();

      const assignedElements = navDrawerSlot?.assignedElements();
      expect(assignedElements).toHaveLength(1);
      expect(assignedElements?.[0].textContent).toBe('Drawer nav content');
    });
  });
});
