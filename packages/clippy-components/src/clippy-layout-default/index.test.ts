import './index';
import { describe, expect, it, afterEach, beforeEach } from 'vitest';
import { ClippyLayoutDefault } from './index';

const tag = 'clippy-layout-default';

describe(`<${tag}>`, () => {
  let component: ClippyLayoutDefault;

  beforeEach(() => {
    document.body.innerHTML = `
      <${tag}></${tag}>
    `;
    component = document.querySelector(tag) as ClippyLayoutDefault;
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
      const contentContainer = component.shadowRoot?.querySelector('.clippy-layout__content');
      const breadcrumbContainer = component.shadowRoot?.querySelector('.clippy-layout__breadcrumb');
      const mainWrap = component.shadowRoot?.querySelector('.clippy-layout__wrap-main');

      expect(contentContainer).not.toBeNull();
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
      component = document.querySelector(tag) as ClippyLayoutDefault;
      await component.updateComplete;

      const mainSlot = component.shadowRoot?.querySelector('slot:not([name])') as HTMLSlotElement;
      const assigned = mainSlot.assignedElements();
      expect(assigned).toHaveLength(1);
      expect(assigned[0].textContent).toBe('Main content');
    });

    it('renders content in the breadcrumb slot', async () => {
      document.body.innerHTML = `
        <${tag}>
          <div slot="breadcrumb">Home / Page</div>
        </${tag}>
      `;
      component = document.querySelector(tag) as ClippyLayoutDefault;
      await component.updateComplete;

      const breadcrumbSlot = component.shadowRoot?.querySelector('slot[name="breadcrumb"]') as HTMLSlotElement;
      const assigned = breadcrumbSlot.assignedElements();
      expect(assigned).toHaveLength(1);
      expect(assigned[0].textContent).toBe('Home / Page');
    });

    it('renders multiple elements in each slot', async () => {
      document.body.innerHTML = `
        <${tag}>
          <div slot="breadcrumb">Breadcrumb 1</div>
          <div slot="breadcrumb">Breadcrumb 2</div>
          <p>Main paragraph 1</p>
          <p>Main paragraph 2</p>
        </${tag}>
      `;
      component = document.querySelector(tag) as ClippyLayoutDefault;
      await component.updateComplete;

      const breadcrumbSlot = component.shadowRoot?.querySelector('slot[name="breadcrumb"]') as HTMLSlotElement;
      const mainSlot = component.shadowRoot?.querySelector('slot:not([name])') as HTMLSlotElement;

      expect(breadcrumbSlot.assignedElements()).toHaveLength(2);
      expect(mainSlot.assignedElements()).toHaveLength(2);
    });
  });

  describe('Dynamic slot content', () => {
    it('updates when content is dynamically added to breadcrumb slot', async () => {
      await component.updateComplete;

      const breadcrumbSlot = component.shadowRoot?.querySelector('slot[name="breadcrumb"]') as HTMLSlotElement;
      expect(breadcrumbSlot.assignedElements()).toHaveLength(0);

      const div = document.createElement('div');
      div.slot = 'breadcrumb';
      div.textContent = 'Dynamic breadcrumb';
      component.appendChild(div);

      await component.updateComplete;
      expect(breadcrumbSlot.assignedElements()).toHaveLength(1);
      expect(breadcrumbSlot.assignedElements()[0].textContent).toBe('Dynamic breadcrumb');
    });

    it('updates when content is dynamically added to main slot', async () => {
      await component.updateComplete;

      const mainSlot = component.shadowRoot?.querySelector('slot:not([name])') as HTMLSlotElement;
      expect(mainSlot.assignedElements()).toHaveLength(0);

      const main = document.createElement('main');
      main.textContent = 'Dynamic main content';
      component.appendChild(main);

      await component.updateComplete;
      expect(mainSlot.assignedElements()).toHaveLength(1);
      expect(mainSlot.assignedElements()[0].textContent).toBe('Dynamic main content');
    });

    it('updates when content is dynamically removed', async () => {
      document.body.innerHTML = `
        <${tag}>
          <div slot="breadcrumb">Breadcrumb</div>
          <main>Main content</main>
        </${tag}>
      `;
      component = document.querySelector(tag) as ClippyLayoutDefault;
      await component.updateComplete;

      const breadcrumbSlot = component.shadowRoot?.querySelector('slot[name="breadcrumb"]') as HTMLSlotElement;
      const mainSlot = component.shadowRoot?.querySelector('slot:not([name])') as HTMLSlotElement;

      expect(breadcrumbSlot.assignedElements()).toHaveLength(1);
      expect(mainSlot.assignedElements()).toHaveLength(1);

      // Remove sidebar content
      const breadcrumb = component.querySelector('[slot="breadcrumb"]');
      breadcrumb?.remove();

      await component.updateComplete;
      expect(breadcrumbSlot.assignedElements()).toHaveLength(0);
    });
  });

  describe('Slot wrapper visibility', () => {
    it('hides breadcrumb wrapper when breadcrumb slot is empty', async () => {
      await component.updateComplete;

      const breadcrumbWrapper = component.shadowRoot?.querySelector('.clippy-layout__breadcrumb');
      expect(breadcrumbWrapper).toHaveAttribute('hidden');
    });

    it('shows breadcrumb wrapper when breadcrumb slot has content', async () => {
      document.body.innerHTML = `
        <${tag}>
          <div slot="breadcrumb">Home / Page</div>
        </${tag}>
      `;
      component = document.querySelector(tag) as ClippyLayoutDefault;

      await component.updateComplete;
      // firstUpdated() resolves slot presence and writes @state, scheduling a follow-up
      // update cycle — await updateComplete again to flush it (documented Lit behavior).
      await component.updateComplete;

      const breadcrumbWrapper = component.shadowRoot?.querySelector('.clippy-layout__breadcrumb');
      expect(breadcrumbWrapper).not.toHaveAttribute('hidden');
    });

    it('always shows main wrapper regardless of content', async () => {
      await component.updateComplete;

      const mainWrapper = component.shadowRoot?.querySelector('.clippy-layout__wrap-main');
      expect(mainWrapper).not.toHaveAttribute('hidden');

      // Also test with content
      document.body.innerHTML = `
        <${tag}>
          <main>Main content</main>
        </${tag}>
      `;
      component = document.querySelector(tag) as ClippyLayoutDefault;
      await component.updateComplete;

      const mainWrapperWithContent = component.shadowRoot?.querySelector('.clippy-layout__wrap-main');
      expect(mainWrapperWithContent).not.toHaveAttribute('hidden');
    });

    it('hides breadcrumb wrapper when content is dynamically removed', async () => {
      document.body.innerHTML = `
        <${tag}>
          <div slot="breadcrumb">Breadcrumb</div>
        </${tag}>
      `;
      component = document.querySelector(tag) as ClippyLayoutDefault;

      await component.updateComplete;
      // firstUpdated() resolves slot presence and writes @state, scheduling a follow-up
      // update cycle — await updateComplete again to flush it (documented Lit behavior).
      await component.updateComplete;

      const breadcrumbWrapper = component.shadowRoot?.querySelector('.clippy-layout__breadcrumb');
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

    it('shows breadcrumb wrapper when content is dynamically added', async () => {
      await component.updateComplete;

      const breadcrumbWrapper = component.shadowRoot?.querySelector('.clippy-layout__breadcrumb');
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
  });
});
