import './index';
import { describe, expect, it, afterEach, beforeEach } from 'vitest';
import { ClippyLayoutDetail } from './index';

const tag = 'clippy-layout-detail';

describe(`<${tag}>`, () => {
  let component: ClippyLayoutDetail;

  beforeEach(() => {
    document.body.innerHTML = `
      <${tag}></${tag}>
    `;
    component = document.querySelector(tag) as ClippyLayoutDetail;
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  describe('Basic rendering', () => {
    it('renders', async () => {
      await component.updateComplete;
      await expect.element(component).toBeInTheDocument();
    });

    it('has the correct tag name', () => {
      expect(component.tagName.toLowerCase()).toBe(tag);
    });

    it('renders all containers', async () => {
      await component.updateComplete;
      const contentContainer = component.shadowRoot?.querySelector('.clippy-layout-detail__content');
      const gridContainer = component.shadowRoot?.querySelector('.clippy-layout-detail__grid');
      const sidebarContainer = component.shadowRoot?.querySelector('.clippy-layout-detail__sidebar');
      const breadcrumbContainer = component.shadowRoot?.querySelector('.clippy-layout-detail__breadcrumb');
      const mainWrap = component.shadowRoot?.querySelector('.clippy-layout-detail__wrap-main');

      expect(contentContainer).not.toBeNull();
      expect(gridContainer).not.toBeNull();
      expect(sidebarContainer).not.toBeNull();
      expect(breadcrumbContainer).not.toBeNull();
      expect(mainWrap).not.toBeNull();
    });
  });

  describe('Slots', () => {
    it('renders content in the default slot (main)', async () => {
      document.body.innerHTML = `
        <${tag}>
          <p>Main content</p>
        </${tag}>
      `;
      component = document.querySelector(tag) as ClippyLayoutDetail;
      await component.updateComplete;

      const mainSlot = component.shadowRoot?.querySelector('slot:not([name])') as HTMLSlotElement;
      const assigned = mainSlot.assignedElements();
      expect(assigned.length).toBe(1);
      expect(assigned[0].textContent).toBe('Main content');
    });

    it('renders content in the sidebar slot', async () => {
      document.body.innerHTML = `
        <${tag}>
          <nav slot="sidebar">Navigation</nav>
        </${tag}>
      `;
      component = document.querySelector(tag) as ClippyLayoutDetail;
      await component.updateComplete;

      const sidebarSlot = component.shadowRoot?.querySelector('slot[name="sidebar"]') as HTMLSlotElement;
      const assigned = sidebarSlot.assignedElements();
      expect(assigned.length).toBe(1);
      expect(assigned[0].textContent).toBe('Navigation');
    });

    it('renders content in the breadcrumb slot', async () => {
      document.body.innerHTML = `
        <${tag}>
          <div slot="breadcrumb">Home / Page</div>
        </${tag}>
      `;
      component = document.querySelector(tag) as ClippyLayoutDetail;
      await component.updateComplete;

      const breadcrumbSlot = component.shadowRoot?.querySelector('slot[name="breadcrumb"]') as HTMLSlotElement;
      const assigned = breadcrumbSlot.assignedElements();
      expect(assigned.length).toBe(1);
      expect(assigned[0].textContent).toBe('Home / Page');
    });

    it('renders multiple elements in each slot', async () => {
      document.body.innerHTML = `
        <${tag}>
          <nav slot="sidebar">Nav 1</nav>
          <nav slot="sidebar">Nav 2</nav>
          <div slot="breadcrumb">Breadcrumb 1</div>
          <div slot="breadcrumb">Breadcrumb 2</div>
          <p>Main paragraph 1</p>
          <p>Main paragraph 2</p>
        </${tag}>
      `;
      component = document.querySelector(tag) as ClippyLayoutDetail;
      await component.updateComplete;

      const sidebarSlot = component.shadowRoot?.querySelector('slot[name="sidebar"]') as HTMLSlotElement;
      const breadcrumbSlot = component.shadowRoot?.querySelector('slot[name="breadcrumb"]') as HTMLSlotElement;
      const mainSlot = component.shadowRoot?.querySelector('slot:not([name])') as HTMLSlotElement;

      expect(sidebarSlot.assignedElements().length).toBe(2);
      expect(breadcrumbSlot.assignedElements().length).toBe(2);
      expect(mainSlot.assignedElements().length).toBe(2);
    });

    it('renders all three slots with content simultaneously', async () => {
      document.body.innerHTML = `
        <${tag}>
          <nav slot="sidebar">Sidebar</nav>
          <div slot="breadcrumb">Breadcrumb</div>
          <main>Main content</main>
        </${tag}>
      `;
      component = document.querySelector(tag) as ClippyLayoutDetail;
      await component.updateComplete;

      const sidebarSlot = component.shadowRoot?.querySelector('slot[name="sidebar"]') as HTMLSlotElement;
      const breadcrumbSlot = component.shadowRoot?.querySelector('slot[name="breadcrumb"]') as HTMLSlotElement;
      const mainSlot = component.shadowRoot?.querySelector('slot:not([name])') as HTMLSlotElement;

      expect(sidebarSlot.assignedElements().length).toBe(1);
      expect(breadcrumbSlot.assignedElements().length).toBe(1);
      expect(mainSlot.assignedElements().length).toBe(1);
    });
  });

  describe('Dynamic slot content', () => {
    it('updates when content is dynamically added to sidebar slot', async () => {
      await component.updateComplete;

      const sidebarSlot = component.shadowRoot?.querySelector('slot[name="sidebar"]') as HTMLSlotElement;
      expect(sidebarSlot.assignedElements().length).toBe(0);

      const nav = document.createElement('nav');
      nav.slot = 'sidebar';
      nav.textContent = 'Dynamic sidebar';
      component.appendChild(nav);

      await component.updateComplete;
      expect(sidebarSlot.assignedElements().length).toBe(1);
      expect(sidebarSlot.assignedElements()[0].textContent).toBe('Dynamic sidebar');
    });

    it('updates when content is dynamically added to breadcrumb slot', async () => {
      await component.updateComplete;

      const breadcrumbSlot = component.shadowRoot?.querySelector('slot[name="breadcrumb"]') as HTMLSlotElement;
      expect(breadcrumbSlot.assignedElements().length).toBe(0);

      const div = document.createElement('div');
      div.slot = 'breadcrumb';
      div.textContent = 'Dynamic breadcrumb';
      component.appendChild(div);

      await component.updateComplete;
      expect(breadcrumbSlot.assignedElements().length).toBe(1);
      expect(breadcrumbSlot.assignedElements()[0].textContent).toBe('Dynamic breadcrumb');
    });

    it('updates when content is dynamically added to main slot', async () => {
      await component.updateComplete;

      const mainSlot = component.shadowRoot?.querySelector('slot:not([name])') as HTMLSlotElement;
      expect(mainSlot.assignedElements().length).toBe(0);

      const main = document.createElement('main');
      main.textContent = 'Dynamic main content';
      component.appendChild(main);

      await component.updateComplete;
      expect(mainSlot.assignedElements().length).toBe(1);
      expect(mainSlot.assignedElements()[0].textContent).toBe('Dynamic main content');
    });

    it('updates when content is dynamically removed', async () => {
      document.body.innerHTML = `
        <${tag}>
          <nav slot="sidebar">Sidebar</nav>
          <div slot="breadcrumb">Breadcrumb</div>
          <main>Main content</main>
        </${tag}>
      `;
      component = document.querySelector(tag) as ClippyLayoutDetail;
      await component.updateComplete;

      const sidebarSlot = component.shadowRoot?.querySelector('slot[name="sidebar"]') as HTMLSlotElement;
      const breadcrumbSlot = component.shadowRoot?.querySelector('slot[name="breadcrumb"]') as HTMLSlotElement;
      const mainSlot = component.shadowRoot?.querySelector('slot:not([name])') as HTMLSlotElement;

      expect(sidebarSlot.assignedElements().length).toBe(1);
      expect(breadcrumbSlot.assignedElements().length).toBe(1);
      expect(mainSlot.assignedElements().length).toBe(1);

      // Remove sidebar content
      const nav = component.querySelector('nav');
      nav?.remove();

      await component.updateComplete;
      expect(sidebarSlot.assignedElements().length).toBe(0);
    });
  });

  describe('Slot wrapper visibility', () => {
    it('hides sidebar wrapper when sidebar slot is empty', async () => {
      await component.updateComplete;

      const sidebarWrapper = component.shadowRoot?.querySelector('.clippy-layout-detail__sidebar');
      expect(sidebarWrapper).toHaveAttribute('hidden');
    });

    it('hides breadcrumb wrapper when breadcrumb slot is empty', async () => {
      await component.updateComplete;

      const breadcrumbWrapper = component.shadowRoot?.querySelector('.clippy-layout-detail__breadcrumb');
      expect(breadcrumbWrapper).toHaveAttribute('hidden');
    });

    it('shows sidebar wrapper when sidebar slot has content', async () => {
      document.body.innerHTML = `
        <${tag}>
          <nav slot="sidebar">Navigation</nav>
        </${tag}>
      `;
      component = document.querySelector(tag) as ClippyLayoutDetail;

      await component.updateComplete;
      // firstUpdated() resolves slot presence and writes @state, scheduling a follow-up
      // update cycle — await updateComplete again to flush it (documented Lit behavior).
      await component.updateComplete;

      const sidebarWrapper = component.shadowRoot?.querySelector('.clippy-layout-detail__sidebar');
      expect(sidebarWrapper).not.toHaveAttribute('hidden');
    });

    it('shows breadcrumb wrapper when breadcrumb slot has content', async () => {
      document.body.innerHTML = `
        <${tag}>
          <div slot="breadcrumb">Home / Page</div>
        </${tag}>
      `;
      component = document.querySelector(tag) as ClippyLayoutDetail;

      await component.updateComplete;
      // firstUpdated() resolves slot presence and writes @state, scheduling a follow-up
      // update cycle — await updateComplete again to flush it (documented Lit behavior).
      await component.updateComplete;

      const breadcrumbWrapper = component.shadowRoot?.querySelector('.clippy-layout-detail__breadcrumb');
      expect(breadcrumbWrapper).not.toHaveAttribute('hidden');
    });

    it('always shows main wrapper regardless of content', async () => {
      await component.updateComplete;

      const mainWrapper = component.shadowRoot?.querySelector('.clippy-layout-detail__wrap-main');
      expect(mainWrapper).not.toHaveAttribute('hidden');

      // Also test with content
      document.body.innerHTML = `
        <${tag}>
          <main>Main content</main>
        </${tag}>
      `;
      component = document.querySelector(tag) as ClippyLayoutDetail;
      await component.updateComplete;

      const mainWrapperWithContent = component.shadowRoot?.querySelector('.clippy-layout-detail__wrap-main');
      expect(mainWrapperWithContent).not.toHaveAttribute('hidden');
    });

    it('hides sidebar wrapper when content is dynamically removed', async () => {
      document.body.innerHTML = `
        <${tag}>
          <nav slot="sidebar">Sidebar</nav>
        </${tag}>
      `;
      component = document.querySelector(tag) as ClippyLayoutDetail;

      await component.updateComplete;
      // firstUpdated() resolves slot presence and writes @state, scheduling a follow-up
      // update cycle — await updateComplete again to flush it (documented Lit behavior).
      await component.updateComplete;

      const sidebarWrapper = component.shadowRoot?.querySelector('.clippy-layout-detail__sidebar');
      expect(sidebarWrapper).not.toHaveAttribute('hidden');

      // Remove sidebar content
      const nav = component.querySelector('nav');
      nav?.remove();

      // Wait for slotchange to fire for removal
      await new Promise((resolve) => requestAnimationFrame(resolve));
      await component.updateComplete;
      expect(sidebarWrapper).toHaveAttribute('hidden');
    });

    it('hides breadcrumb wrapper when content is dynamically removed', async () => {
      document.body.innerHTML = `
        <${tag}>
          <div slot="breadcrumb">Breadcrumb</div>
        </${tag}>
      `;
      component = document.querySelector(tag) as ClippyLayoutDetail;

      await component.updateComplete;
      // firstUpdated() resolves slot presence and writes @state, scheduling a follow-up
      // update cycle — await updateComplete again to flush it (documented Lit behavior).
      await component.updateComplete;

      const breadcrumbWrapper = component.shadowRoot?.querySelector('.clippy-layout-detail__breadcrumb');
      expect(breadcrumbWrapper).not.toHaveAttribute('hidden');

      // Remove breadcrumb content
      const div = component.querySelector('div');
      div?.remove();

      await component.updateComplete;
      // firstUpdated() resolves slot presence and writes @state, scheduling a follow-up
      // update cycle — await updateComplete again to flush it (documented Lit behavior).
      await component.updateComplete;

      expect(breadcrumbWrapper).toHaveAttribute('hidden');
    });

    it('shows sidebar wrapper when content is dynamically added', async () => {
      await component.updateComplete;

      const sidebarWrapper = component.shadowRoot?.querySelector('.clippy-layout-detail__sidebar');
      expect(sidebarWrapper).toHaveAttribute('hidden');

      const nav = document.createElement('nav');
      nav.slot = 'sidebar';
      nav.textContent = 'Dynamic sidebar';
      component.appendChild(nav);

      await component.updateComplete;
      // firstUpdated() resolves slot presence and writes @state, scheduling a follow-up
      // update cycle — await updateComplete again to flush it (documented Lit behavior).
      await component.updateComplete;

      expect(sidebarWrapper).not.toHaveAttribute('hidden');
    });

    it('shows breadcrumb wrapper when content is dynamically added', async () => {
      await component.updateComplete;

      const breadcrumbWrapper = component.shadowRoot?.querySelector('.clippy-layout-detail__breadcrumb');
      expect(breadcrumbWrapper).toHaveAttribute('hidden');

      const div = document.createElement('div');
      div.slot = 'breadcrumb';
      div.textContent = 'Dynamic breadcrumb';
      component.appendChild(div);

      await component.updateComplete;
      // firstUpdated() resolves slot presence and writes @state, scheduling a follow-up
      // update cycle — await updateComplete again to flush it (documented Lit behavior).
      await component.updateComplete;

      expect(breadcrumbWrapper).not.toHaveAttribute('hidden');
    });

    it('handles multiple wrapper visibility states correctly', async () => {
      document.body.innerHTML = `
        <${tag}>
          <nav slot="sidebar">Sidebar</nav>
        </${tag}>
      `;
      component = document.querySelector(tag) as ClippyLayoutDetail;

      await component.updateComplete;
      // firstUpdated() resolves slot presence and writes @state, scheduling a follow-up
      // update cycle — await updateComplete again to flush it (documented Lit behavior).
      await component.updateComplete;

      const sidebarWrapper = component.shadowRoot?.querySelector('.clippy-layout-detail__sidebar');
      const breadcrumbWrapper = component.shadowRoot?.querySelector('.clippy-layout-detail__breadcrumb');
      const mainWrapper = component.shadowRoot?.querySelector('.clippy-layout-detail__wrap-main');

      // Sidebar has content, breadcrumb and main are empty
      expect(sidebarWrapper).not.toHaveAttribute('hidden');
      expect(breadcrumbWrapper).toHaveAttribute('hidden');
      expect(mainWrapper).not.toHaveAttribute('hidden');

      // Add breadcrumb content
      const div = document.createElement('div');
      div.slot = 'breadcrumb';
      div.textContent = 'Breadcrumb';
      component.appendChild(div);

      await component.updateComplete;
      // firstUpdated() resolves slot presence and writes @state, scheduling a follow-up
      // update cycle — await updateComplete again to flush it (documented Lit behavior).
      await component.updateComplete;

      expect(sidebarWrapper).not.toHaveAttribute('hidden');
      expect(breadcrumbWrapper).not.toHaveAttribute('hidden');
      expect(mainWrapper).not.toHaveAttribute('hidden');

      // Remove sidebar content
      const nav = component.querySelector('nav');
      nav?.remove();

      await component.updateComplete;
      // firstUpdated() resolves slot presence and writes @state, scheduling a follow-up
      // update cycle — await updateComplete again to flush it (documented Lit behavior).
      await component.updateComplete;

      expect(sidebarWrapper).toHaveAttribute('hidden');
      expect(breadcrumbWrapper).not.toHaveAttribute('hidden');
      expect(mainWrapper).not.toHaveAttribute('hidden');
    });
  });
});
