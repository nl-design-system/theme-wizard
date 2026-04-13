import { createElement } from 'react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import type { ClippyReactElement } from './index';
import './index';

const tag = 'clippy-react-element';

const waitForReactRender = () => new Promise((resolve) => setTimeout(resolve, 0));

describe(`<${tag}>`, () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  describe('connectedCallback', () => {
    it('creates a mount point div when connected', () => {
      document.body.innerHTML = `<${tag}></${tag}>`;
      const el = document.querySelector(tag) as ClippyReactElement;

      const mountPoint = el.querySelector('div');
      expect(mountPoint).not.toBeNull();
    });

    it('appends only one mount point div', () => {
      document.body.innerHTML = `<${tag}></${tag}>`;
      const el = document.querySelector(tag) as ClippyReactElement;

      const divs = el.querySelectorAll('div');
      expect(divs.length).toBe(1);
    });
  });

  describe('render', () => {
    let el: ClippyReactElement;

    beforeEach(() => {
      document.body.innerHTML = `<${tag}></${tag}>`;
      el = document.querySelector(tag) as ClippyReactElement;
    });

    it('renders a React element into the DOM', async () => {
      el.render(createElement('span', { 'data-testid': 'react-output' }, 'Hello'));
      await waitForReactRender();

      const span = el.querySelector('[data-testid="react-output"]');
      expect(span).not.toBeNull();
      expect(span?.textContent).toBe('Hello');
    });

    it('renders updated content when called multiple times', async () => {
      el.render(createElement('span', null, 'First'));
      await waitForReactRender();
      el.render(createElement('span', null, 'Second'));
      await waitForReactRender();
      expect(el.querySelector('span')?.textContent).toBe('Second');
    });

    it('renders nested React elements', async () => {
      el.render(createElement('div', { 'data-testid': 'wrapper' }, createElement('p', null, 'Nested')));
      await waitForReactRender();

      const wrapper = el.querySelector('[data-testid="wrapper"]');
      expect(wrapper).not.toBeNull();
      expect(wrapper?.querySelector('p')?.textContent).toBe('Nested');
    });

    it('does not throw when render is called before connectedCallback (root is null)', () => {
      const detached = document.createElement(tag) as ClippyReactElement;

      expect(() => {
        detached.render(createElement('span', null, 'test'));
      }).not.toThrow();
    });
  });

  describe('disconnectedCallback', () => {
    it('unmounts the React root when removed from the DOM', async () => {
      document.body.innerHTML = `<${tag}></${tag}>`;
      const el = document.querySelector(tag) as ClippyReactElement;

      el.render(createElement('span', { 'data-testid': 'mounted' }, 'Mounted'));
      await waitForReactRender();

      expect(el.querySelector('[data-testid="mounted"]')).not.toBeNull();

      el.remove();

      // After removal the internal React root should be unmounted; no error thrown
      expect(document.querySelector(tag)).toBeNull();
    });

    it('does not throw when disconnected without a root (never connected)', () => {
      const detached = document.createElement(tag) as ClippyReactElement;

      expect(() => {
        detached.disconnectedCallback();
      }).not.toThrow();
    });
  });

  describe('custom element registration', () => {
    it('is registered as a custom element', () => {
      const Constructor = customElements.get(tag);
      expect(Constructor).toBeDefined();
    });

    it('creates an instance of ClippyReactElement', () => {
      document.body.innerHTML = `<${tag}></${tag}>`;
      const el = document.querySelector(tag);

      const Constructor = customElements.get(tag);
      expect(el).toBeInstanceOf(Constructor);
    });
  });

  describe('multiple instances', () => {
    it('each instance has its own independent root', async () => {
      document.body.innerHTML = `
        <${tag} id="first"></${tag}>
        <${tag} id="second"></${tag}>
      `;

      const first = document.querySelector('#first') as ClippyReactElement;
      const second = document.querySelector('#second') as ClippyReactElement;

      first.render(createElement('span', null, 'Alpha'));
      second.render(createElement('span', null, 'Beta'));

      await waitForReactRender();

      expect(first.querySelector('span')?.textContent).toBe('Alpha');
      expect(second.querySelector('span')?.textContent).toBe('Beta');
    });
  });
});
