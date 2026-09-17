import './index';
import { describe, expect, it, afterEach, beforeEach } from 'vitest';
import { vi } from 'vitest';
import { ClippyPageLayout } from './index';

const tag = 'clippy-page-layout';

/* ResizeObserver mock */
class ResizeObserverMock {
  static instances: ResizeObserverMock[] = [];

  static lastInstance(): ResizeObserverMock {
    return this.instances[this.instances.length - 1];
  }

  observed: Element[] = [];
  disconnected = false;

  constructor(private callback: ResizeObserverCallback) {
    ResizeObserverMock.instances.push(this);
  }

  observe(target: Element) {
    this.observed.push(target);
  }

  unobserve(_target: Element) {
    /* not used by the component */
  }

  disconnect() {
    this.disconnected = true;
    this.observed = [];
  }

  /* Fire the callback with a fake border-box height */
  trigger(height: number) {
    const entry = {
      borderBoxSize: [{ blockSize: height, inlineSize: 800 }],
      contentRect: { bottom: height, height, left: 0, right: 800, top: 0, width: 800, x: 0, y: 0 },
      target: this.observed[0],
    } as unknown as ResizeObserverEntry;
    this.callback([entry], this as unknown as ResizeObserver);
  }
}

describe(`<${tag}>`, () => {
  let component: ClippyPageLayout;

  beforeEach(() => {
    ResizeObserverMock.instances = [];
    vi.stubGlobal('ResizeObserver', ResizeObserverMock);

    document.body.innerHTML = `
      <${tag}>
        <span slot="header">header</span>
        <span>content</span>
        <span slot="footer">footer</span>
      </${tag}>
    `;
    component = document.querySelector(tag) as ClippyPageLayout;
  });

  afterEach(() => {
    document.body.innerHTML = '';
    vi.unstubAllGlobals();
  });

  describe('Basic rendering', () => {
    it('renders', async () => {
      await component.updateComplete;
      await expect.element(component).toBeInTheDocument();
    });

    it('projects light DOM children into their slots', async () => {
      await component.updateComplete;
      const root = component.shadowRoot;

      const textOf = (selector: string): string =>
        (root?.querySelector(selector) as HTMLSlotElement)
          .assignedNodes()
          .map((n) => n.textContent?.trim())
          .join('');

      expect(textOf('slot[name="header"]')).toBe('header');
      expect(textOf('slot[name="footer"]')).toBe('footer');
      expect(textOf('slot:not([name])')).toBe('content');
    });
  });

  describe('Set header block size', () => {
    it('observes the shadow header element', async () => {
      await component.updateComplete;
      const root = component.shadowRoot;
      const observer = ResizeObserverMock.lastInstance();
      expect(observer.observed).toContain(root?.querySelector('header'));
    });

    it('writes the measured block-size to the host', async () => {
      await component.updateComplete;
      ResizeObserverMock.lastInstance().trigger(128);
      expect(component.style.getPropertyValue('--clippy-page-layout-header-block-size')).toBe('128px');
    });

    it('updates the value when the header resizes', async () => {
      await component.updateComplete;
      const observer = ResizeObserverMock.lastInstance();
      observer.trigger(64);
      observer.trigger(96);
      expect(component.style.getPropertyValue('--clippy-page-layout-header-block-size')).toBe('96px');
    });

    it('skips redundant writes when the height is unchanged', async () => {
      await component.updateComplete;
      const observer = ResizeObserverMock.lastInstance();
      const setProperty = vi.spyOn(component.style, 'setProperty');

      observer.trigger(100);
      expect(setProperty).toHaveBeenCalledTimes(1);

      observer.trigger(100); // same height → guarded, no write
      expect(setProperty).toHaveBeenCalledTimes(1);

      observer.trigger(101);
      expect(setProperty).toHaveBeenCalledTimes(2);
      expect(component.style.getPropertyValue('--clippy-page-layout-header-block-size')).toBe('101px');
    });

    it('stops observing when the element is disconnected', async () => {
      await component.updateComplete;
      const observer = ResizeObserverMock.lastInstance();
      component.remove();
      expect(observer.disconnected).toBe(true);
    });

    it('resumes observing when the element is reconnected', async () => {
      await component.updateComplete;
      const root = component.shadowRoot;
      const observer = ResizeObserverMock.lastInstance();
      const header = root?.querySelector('header');

      component.remove();
      document.body.appendChild(component);

      expect(observer.observed).toContain(header);
    });
  });
});
