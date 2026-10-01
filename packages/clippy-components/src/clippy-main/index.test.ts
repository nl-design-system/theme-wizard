import './index';
import { describe, expect, it, afterEach, beforeEach } from 'vitest';
import { ClippyMain } from './index';

const tag = 'clippy-main';

describe(`<${tag}>`, () => {
  let component: ClippyMain;

  beforeEach(() => {
    document.body.innerHTML = `
      <${tag}></${tag}>
    `;
    component = document.querySelector(tag) as ClippyMain;
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

    it('renders a main element', async () => {
      await component.updateComplete;
      const main = component.shadowRoot?.querySelector('main');
      expect(main).not.toBeNull();
    });

    it('renders all slot containers', async () => {
      await component.updateComplete;
      const header = component.shadowRoot?.querySelector('.clippy-main__header');
      const aside = component.shadowRoot?.querySelector('.clippy-main__aside');
      const body = component.shadowRoot?.querySelector('.clippy-main__body');

      expect(header).not.toBeNull();
      expect(aside).not.toBeNull();
      expect(body).not.toBeNull();
    });
  });

  describe('Slots', () => {
    it('renders content in the header slot', async () => {
      document.body.innerHTML = `
        <${tag}>
          <h1 slot="header">Title</h1>
        </${tag}>
      `;
      component = document.querySelector(tag) as ClippyMain;
      await component.updateComplete;

      const headerSlot = component.shadowRoot?.querySelector('slot[name="header"]') as HTMLSlotElement;
      const assigned = headerSlot.assignedElements();
      expect(assigned).toHaveLength(1);
      expect(assigned[0].textContent).toBe('Title');
    });

    it('renders content in the aside slot', async () => {
      document.body.innerHTML = `
        <${tag}>
          <nav slot="aside">Navigation</nav>
        </${tag}>
      `;
      component = document.querySelector(tag) as ClippyMain;
      await component.updateComplete;

      const asideSlot = component.shadowRoot?.querySelector('slot[name="aside"]') as HTMLSlotElement;
      const assigned = asideSlot.assignedElements();
      expect(assigned).toHaveLength(1);
      expect(assigned[0].textContent).toBe('Navigation');
    });

    it('renders content in the default slot (body)', async () => {
      document.body.innerHTML = `
        <${tag}>
          <p>Body content</p>
        </${tag}>
      `;
      component = document.querySelector(tag) as ClippyMain;
      await component.updateComplete;

      const bodySlot = component.shadowRoot?.querySelector('slot:not([name])') as HTMLSlotElement;
      const assigned = bodySlot.assignedElements();
      expect(assigned).toHaveLength(1);
      expect(assigned[0].textContent).toBe('Body content');
    });

    it('renders multiple elements in each slot', async () => {
      document.body.innerHTML = `
        <${tag}>
          <h1 slot="header">Title</h1>
          <h2 slot="header">Subtitle</h2>
          <nav slot="aside">Nav 1</nav>
          <nav slot="aside">Nav 2</nav>
          <p>Paragraph 1</p>
          <p>Paragraph 2</p>
        </${tag}>
      `;
      component = document.querySelector(tag) as ClippyMain;
      await component.updateComplete;

      const headerSlot = component.shadowRoot?.querySelector('slot[name="header"]') as HTMLSlotElement;
      const asideSlot = component.shadowRoot?.querySelector('slot[name="aside"]') as HTMLSlotElement;
      const bodySlot = component.shadowRoot?.querySelector('slot:not([name])') as HTMLSlotElement;

      expect(headerSlot.assignedElements()).toHaveLength(2);
      expect(asideSlot.assignedElements()).toHaveLength(2);
      expect(bodySlot.assignedElements()).toHaveLength(2);
    });
  });

  describe('Slot visibility', () => {
    it('hides header container when header slot is empty', async () => {
      await component.updateComplete;
      const headerContainer = component.shadowRoot?.querySelector('.clippy-main__header');
      expect(headerContainer?.hasAttribute('hidden')).toBe(true);
    });

    it('shows header container when header slot has content', async () => {
      document.body.innerHTML = `
        <${tag}>
          <h1 slot="header">Title</h1>
        </${tag}>
      `;
      component = document.querySelector(tag) as ClippyMain;
      await component.updateComplete;
      // firstUpdated() resolves slot presence and writes @state, scheduling a follow-up
      // update cycle — await updateComplete again to flush it (documented Lit behavior).
      await component.updateComplete;

      const headerContainer = component.shadowRoot?.querySelector('.clippy-main__header');
      expect(headerContainer?.hasAttribute('hidden')).toBe(false);
    });

    it('hides aside container when aside slot is empty', async () => {
      await component.updateComplete;
      const asideContainer = component.shadowRoot?.querySelector('.clippy-main__aside');
      expect(asideContainer?.hasAttribute('hidden')).toBe(true);
    });

    it('shows aside container when aside slot has content', async () => {
      document.body.innerHTML = `
        <${tag}>
          <nav slot="aside">Navigation</nav>
        </${tag}>
      `;
      component = document.querySelector(tag) as ClippyMain;
      await component.updateComplete;
      // firstUpdated() resolves slot presence and writes @state, scheduling a follow-up
      // update cycle — await updateComplete again to flush it (documented Lit behavior).
      await component.updateComplete;

      const asideContainer = component.shadowRoot?.querySelector('.clippy-main__aside');
      expect(asideContainer?.hasAttribute('hidden')).toBe(false);
    });

    it('hides body container when body slot is empty', async () => {
      await component.updateComplete;
      const bodyContainer = component.shadowRoot?.querySelector('.clippy-main__body');
      expect(bodyContainer?.hasAttribute('hidden')).toBe(true);
    });

    it('shows body container when body slot has content', async () => {
      document.body.innerHTML = `
        <${tag}>
          <p>Content</p>
        </${tag}>
      `;
      component = document.querySelector(tag) as ClippyMain;
      await component.updateComplete;
      // firstUpdated() resolves slot presence and writes @state, scheduling a follow-up
      // update cycle — await updateComplete again to flush it (documented Lit behavior).
      await component.updateComplete;

      const bodyContainer = component.shadowRoot?.querySelector('.clippy-main__body');
      expect(bodyContainer?.hasAttribute('hidden')).toBe(false);
    });

    it('updates slot visibility when content is dynamically added', async () => {
      await component.updateComplete;

      // Initially all slots are empty
      expect(component.shadowRoot?.querySelector('.clippy-main__header')?.hasAttribute('hidden')).toBe(true);
      expect(component.shadowRoot?.querySelector('.clippy-main__aside')?.hasAttribute('hidden')).toBe(true);
      expect(component.shadowRoot?.querySelector('.clippy-main__body')?.hasAttribute('hidden')).toBe(true);

      // Add content to header
      const header = document.createElement('h1');
      header.slot = 'header';
      header.textContent = 'Title';
      component.appendChild(header);

      await component.updateComplete;
      // firstUpdated() resolves slot presence and writes @state, scheduling a follow-up
      // update cycle — await updateComplete again to flush it (documented Lit behavior).
      await component.updateComplete;

      expect(component.shadowRoot?.querySelector('.clippy-main__header')?.hasAttribute('hidden')).toBe(false);
    });

    it('updates slot visibility when content is dynamically removed', async () => {
      document.body.innerHTML = `
        <${tag}>
          <h1 slot="header">Title</h1>
        </${tag}>
      `;
      component = document.querySelector(tag) as ClippyMain;
      await component.updateComplete;
      await new Promise((resolve) => setTimeout(resolve, 0));
      await component.updateComplete;

      expect(component.shadowRoot?.querySelector('.clippy-main__header')?.hasAttribute('hidden')).toBe(false);

      // Remove content
      const header = component.querySelector('h1');
      header?.remove();

      await component.updateComplete;
      // firstUpdated() resolves slot presence and writes @state, scheduling a follow-up
      // update cycle — await updateComplete again to flush it (documented Lit behavior).
      await component.updateComplete;

      expect(component.shadowRoot?.querySelector('.clippy-main__header')?.hasAttribute('hidden')).toBe(true);
    });
  });

  describe('Variant property', () => {
    it('defaults to "default" variant', () => {
      expect(component.variant).toBe('default');
    });

    it('reflects the variant attribute', async () => {
      component.variant = 'detail';
      await component.updateComplete;
      expect(component.getAttribute('variant')).toBe('detail');
    });

    it('updates variant from attribute', async () => {
      component.setAttribute('variant', 'detail');
      await component.updateComplete;
      expect(component.variant).toBe('detail');
    });
  });
});
