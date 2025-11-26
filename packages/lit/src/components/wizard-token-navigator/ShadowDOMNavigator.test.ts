import { beforeEach, describe, expect, it } from 'vitest';
import { ShadowDOMNavigator } from './ShadowDOMNavigator';

const createShadowHost = () => {
  const host = document.createElement('div');
  host.attachShadow({ mode: 'open' });
  return host;
};

const createDetails = (open = false) => {
  const details = document.createElement('details');
  details.open = open;
  return details;
};

describe('ShadowDOMNavigator', () => {
  let navigator: ShadowDOMNavigator;

  beforeEach(() => {
    navigator = new ShadowDOMNavigator();
    document.body.innerHTML = '';
  });

  describe('findElement()', () => {
    it('finds an element in the light DOM', () => {
      const element = document.createElement('div');
      element.id = 'test-element';
      document.body.appendChild(element);

      expect(navigator.findElement(document, '#test-element')).toBe(element);
    });

    it('returns null when the element does not exist in the DOM tree', () => {
      expect(navigator.findElement(document, '#non-existent')).toBeNull();
    });

    it('finds an element inside a single shadow root', () => {
      const host = createShadowHost();
      const shadowElement = document.createElement('div');
      shadowElement.id = 'shadow-element';
      host.shadowRoot!.appendChild(shadowElement);
      document.body.appendChild(host);

      expect(navigator.findElement(document, '#shadow-element')).toBe(shadowElement);
    });

    it('finds an element inside nested shadow roots', () => {
      const outerHost = createShadowHost();
      const innerHost = createShadowHost();
      const innerElement = document.createElement('div');
      innerElement.id = 'nested-element';
      innerHost.shadowRoot!.appendChild(innerElement);
      outerHost.shadowRoot!.appendChild(innerHost);
      document.body.appendChild(outerHost);

      expect(navigator.findElement(document, '#nested-element')).toBe(innerElement);
    });

    it('continues searching subsequent shadow roots when the first one does not contain the element', () => {
      const firstHost = createShadowHost();
      const secondHost = createShadowHost();

      const nonMatchingElement = document.createElement('div');
      nonMatchingElement.id = 'something-else';
      firstHost.shadowRoot!.appendChild(nonMatchingElement);

      const target = document.createElement('div');
      target.id = 'target-element';
      secondHost.shadowRoot!.appendChild(target);

      document.body.appendChild(firstHost);
      document.body.appendChild(secondHost);

      expect(navigator.findElement(document, '#target-element')).toBe(target);
    });

    it('finds an element when starting from a specific root element', () => {
      const container = document.createElement('div');
      const element = document.createElement('div');
      element.id = 'test-element';
      container.appendChild(element);
      document.body.appendChild(container);

      expect(navigator.findElement(container, '#test-element')).toBe(element);
    });

    it('finds an element when starting from a ShadowRoot', () => {
      const host = createShadowHost();
      const shadowElement = document.createElement('div');
      shadowElement.id = 'shadow-element';
      host.shadowRoot!.appendChild(shadowElement);
      document.body.appendChild(host);

      expect(navigator.findElement(host.shadowRoot!, '#shadow-element')).toBe(shadowElement);
    });
  });

  describe('expandParentDetails()', () => {
    it('expands a single parent <details> element', () => {
      const details = createDetails(false);
      const content = document.createElement('div');
      details.appendChild(document.createElement('summary'));
      details.appendChild(content);
      document.body.appendChild(details);

      navigator.expandParentDetails(content);
      expect(details.open).toBe(true);
    });

    it('expands multiple nested parent <details> elements', () => {
      const outerDetails = createDetails(false);
      const innerDetails = createDetails(false);
      const content = document.createElement('div');
      innerDetails.appendChild(content);
      outerDetails.appendChild(innerDetails);
      document.body.appendChild(outerDetails);

      navigator.expandParentDetails(content);
      expect(outerDetails.open).toBe(true);
      expect(innerDetails.open).toBe(true);
    });

    it('does not collapse an already open <details> element', () => {
      const details = createDetails(true);
      const content = document.createElement('div');
      details.appendChild(content);
      document.body.appendChild(details);

      navigator.expandParentDetails(content);
      expect(details.open).toBe(true);
    });

    it('expands <details> elements through shadow DOM boundaries', () => {
      const host = createShadowHost();
      const details = createDetails(false);
      const content = document.createElement('div');
      details.appendChild(content);
      host.shadowRoot!.appendChild(details);
      document.body.appendChild(host);

      navigator.expandParentDetails(content);
      expect(details.open).toBe(true);
    });

    it('stops traversal at the configured max depth to prevent infinite loops', () => {
      let current: HTMLElement = document.body;
      for (let i = 0; i < 35; i++) {
        const div = document.createElement('div');
        current.appendChild(div);
        current = div;
      }
      const target = document.createElement('div');
      current.appendChild(target);

      expect(() => navigator.expandParentDetails(target)).not.toThrow();
    });
  });

  describe('getParentNode()', () => {
    it('returns the parent node for a standard DOM element', () => {
      const parent = document.createElement('div');
      const child = document.createElement('div');
      parent.appendChild(child);

      expect(navigator.getParentNode(child)).toBe(parent);
    });

    it('returns documentElement for document.body', () => {
      expect(navigator.getParentNode(document.body)).toBe(document.documentElement);
    });

    it('returns the host element for a ShadowRoot', () => {
      const host = createShadowHost();
      expect(navigator.getParentNode(host.shadowRoot!)).toBe(host);
    });

    it('returns the ShadowRoot for an element inside a shadow root', () => {
      const host = createShadowHost();
      const shadowElement = document.createElement('div');
      host.shadowRoot!.appendChild(shadowElement);

      expect(navigator.getParentNode(shadowElement)).toBe(host.shadowRoot);
    });

    it('returns the host element when an element has no parentNode but getRootNode returns a ShadowRoot', () => {
      const host = createShadowHost();
      document.body.appendChild(host);
      const testElement = document.createElement('div');
      host.shadowRoot!.appendChild(testElement);

      Object.defineProperty(testElement, 'parentNode', {
        configurable: true,
        get: () => null,
      });

      expect(navigator.getParentNode(testElement)).toBe(host);
    });

    it('returns null when an element has no parentNode and getRootNode does not return a ShadowRoot', () => {
      const testElement = document.createElement('div');

      Object.defineProperty(testElement, 'parentNode', {
        configurable: true,
        get: () => null,
      });
      Object.defineProperty(testElement, 'getRootNode', {
        configurable: true,
        value: () => document,
      });

      expect(navigator.getParentNode(testElement)).toBeNull();
    });

    it('returns the correct parents for nested shadow DOM structures', () => {
      const outerHost = createShadowHost();
      const innerHost = createShadowHost();
      const innerElement = document.createElement('div');
      innerHost.shadowRoot!.appendChild(innerElement);
      outerHost.shadowRoot!.appendChild(innerHost);

      expect(navigator.getParentNode(innerElement)).toBe(innerHost.shadowRoot);
      expect(navigator.getParentNode(innerHost.shadowRoot!)).toBe(innerHost);
    });

    it('returns null for the Document root node', () => {
      expect(navigator.getParentNode(document)).toBeNull();
    });
  });
});
