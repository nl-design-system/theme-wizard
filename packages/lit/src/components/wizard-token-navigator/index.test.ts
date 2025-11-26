import { html, render } from 'lit';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { WizardTokenNavigator } from './index';
import { ShadowDOMNavigator } from './ShadowDOMNavigator';

class TestWizardTokenNavigator extends WizardTokenNavigator {
  override render() {
    return html`<div>Test</div>`;
  }

  public testFocusToken(tokenPath: string) {
    return this.focusToken(tokenPath);
  }

  public testFocusField(field: HTMLElement, tokenPath: string) {
    return this.focusField(field, tokenPath);
  }

  public testApplyHighlightAnimation(field: HTMLElement) {
    return this.applyHighlightAnimation(field);
  }

  public testScrollToField(field: HTMLElement) {
    return this.scrollToField(field);
  }

  public testFocusFieldInput(field: HTMLElement, tokenPath: string) {
    return this.focusFieldInput(field, tokenPath);
  }

  public testRenderTokenLink(tokenPath: string, displayText?: string) {
    return this.renderTokenLink(tokenPath, displayText);
  }

  public override focusToken(tokenPath: string): void {
    return super.focusToken(tokenPath);
  }

  public override applyHighlightAnimation(field: HTMLElement): void {
    return super.applyHighlightAnimation(field);
  }

  public override scrollToField(field: HTMLElement): void {
    return super.scrollToField(field);
  }

  public override focusFieldInput(field: HTMLElement, tokenPath: string): void {
    return super.focusFieldInput(field, tokenPath);
  }
}

customElements.define('test-wizard-token-navigator', TestWizardTokenNavigator);

const createMockField = (path?: string) => {
  const field = document.createElement('div');
  if (path) field.setAttribute('path', path);
  return field;
};

const createMockMediaQuery = (matches: boolean): MediaQueryList =>
  ({
    addEventListener: vi.fn(),
    addListener: vi.fn(),
    dispatchEvent: vi.fn(),
    matches,
    media: '',
    onchange: null,
    removeEventListener: vi.fn(),
    removeListener: vi.fn(),
  }) as MediaQueryList;

describe('WizardTokenNavigator', () => {
  let element: TestWizardTokenNavigator;
  let mockShadowDOMNavigator: {
    expandParentDetails: ReturnType<typeof vi.fn>;
    findElement: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    document.body.innerHTML = '';
    vi.useFakeTimers();

    mockShadowDOMNavigator = {
      expandParentDetails: vi.fn(),
      findElement: vi.fn(),
    };

    element = document.createElement('test-wizard-token-navigator') as TestWizardTokenNavigator;
    document.body.appendChild(element);

    vi.spyOn(ShadowDOMNavigator.prototype, 'findElement').mockImplementation(
      mockShadowDOMNavigator.findElement as (
        root: Document | ShadowRoot | HTMLElement,
        selector: string,
      ) => HTMLElement | null,
    );
    vi.spyOn(ShadowDOMNavigator.prototype, 'expandParentDetails').mockImplementation(
      mockShadowDOMNavigator.expandParentDetails as (element: HTMLElement) => void,
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
    document.body.innerHTML = '';
  });

  describe('focusToken()', () => {
    it('locates the token field and focuses it when the field exists', async () => {
      await element.updateComplete;

      const mockField = createMockField('basis.color.primary');
      mockShadowDOMNavigator.findElement.mockReturnValue(mockField);

      const highlightSpy = vi.spyOn(element, 'applyHighlightAnimation');
      const scrollSpy = vi.spyOn(element, 'scrollToField');
      const focusInputSpy = vi.spyOn(element, 'focusFieldInput');

      element.testFocusToken('basis.color.primary');

      expect(mockShadowDOMNavigator.findElement).toHaveBeenCalledWith(
        document,
        'wizard-token-field[path="basis.color.primary"]',
      );
      expect(mockShadowDOMNavigator.expandParentDetails).toHaveBeenCalledWith(mockField);
      expect(highlightSpy).toHaveBeenCalledWith(mockField);
      expect(scrollSpy).toHaveBeenCalledWith(mockField);
      expect(focusInputSpy).toHaveBeenCalledWith(mockField, 'basis.color.primary');
    });

    it('logs a warning and does not attempt to focus when the field cannot be found', async () => {
      await element.updateComplete;

      mockShadowDOMNavigator.findElement.mockReturnValue(null);
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const focusFieldSpy = vi.spyOn(element, 'testFocusField');

      element.testFocusToken('basis.color.nonexistent');

      expect(consoleWarnSpy).toHaveBeenCalledWith('[ValidationIssues] Token field not found: basis.color.nonexistent');
      expect(focusFieldSpy).not.toHaveBeenCalled();

      consoleWarnSpy.mockRestore();
    });
  });

  describe('focusField()', () => {
    it('expands, highlights, scrolls and focuses the field in sequence', async () => {
      await element.updateComplete;

      const mockField = createMockField();
      const highlightSpy = vi.spyOn(element, 'applyHighlightAnimation');
      const scrollSpy = vi.spyOn(element, 'scrollToField');
      const focusInputSpy = vi.spyOn(element, 'focusFieldInput');

      element.testFocusField(mockField, 'basis.color.primary');

      expect(mockShadowDOMNavigator.expandParentDetails).toHaveBeenCalledWith(mockField);
      expect(highlightSpy).toHaveBeenCalledWith(mockField);
      expect(scrollSpy).toHaveBeenCalledWith(mockField);
      expect(focusInputSpy).toHaveBeenCalledWith(mockField, 'basis.color.primary');
    });
  });

  describe('applyHighlightAnimation()', () => {
    it('adds the highlight class to the field', async () => {
      await element.updateComplete;

      const mockField = createMockField();
      element.testApplyHighlightAnimation(mockField);

      expect(mockField.classList.contains('theme-validation-highlight')).toBe(true);
    });

    it('removes the highlight class and event listener after the animation ends', async () => {
      await element.updateComplete;

      const mockField = createMockField();
      const removeEventListenerSpy = vi.spyOn(mockField, 'removeEventListener');
      element.testApplyHighlightAnimation(mockField);

      expect(mockField.classList.contains('theme-validation-highlight')).toBe(true);

      mockField.dispatchEvent(new Event('animationend', { bubbles: true }));

      expect(mockField.classList.contains('theme-validation-highlight')).toBe(false);
      expect(removeEventListenerSpy).toHaveBeenCalled();
    });
  });

  describe('scrollToField()', () => {
    it.each([
      { expectedBehavior: 'smooth', matches: false },
      { expectedBehavior: 'auto', matches: true },
    ])(
      'calls scrollIntoView with $expectedBehavior behavior when prefers-reduced-motion matches=$matches',
      async ({ expectedBehavior, matches }) => {
        await element.updateComplete;

        const mockField = createMockField();
        const scrollIntoViewSpy = vi.spyOn(mockField, 'scrollIntoView');
        const matchMediaSpy = vi.spyOn(globalThis, 'matchMedia').mockReturnValue(createMockMediaQuery(matches));

        element.testScrollToField(mockField);

        expect(scrollIntoViewSpy).toHaveBeenCalledWith({
          behavior: expectedBehavior,
          block: 'center',
        });

        matchMediaSpy.mockRestore();
      },
    );
  });

  describe('focusFieldInput()', () => {
    it('finds and focuses the input after a short delay', async () => {
      await element.updateComplete;

      const mockField = createMockField();
      const shadowRoot = mockField.attachShadow({ mode: 'open' });
      const mockInput = document.createElement('input');
      mockInput.name = 'basis.color.primary';
      shadowRoot.appendChild(mockInput);

      const focusSpy = vi.spyOn(mockInput, 'focus');
      element.testFocusFieldInput(mockField, 'basis.color.primary');

      expect(focusSpy).not.toHaveBeenCalled();
      vi.advanceTimersByTime(300);
      expect(focusSpy).toHaveBeenCalled();
    });

    it.each([
      { description: 'when input is not found', setup: (field: HTMLElement) => field.attachShadow({ mode: 'open' }) },
      { description: 'when shadowRoot is not available', setup: () => {} },
    ])('does not throw $description', async ({ setup }) => {
      await element.updateComplete;

      const mockField = createMockField();
      setup(mockField);

      expect(() => {
        element.testFocusFieldInput(mockField, 'basis.color.primary');
        vi.advanceTimersByTime(300);
      }).not.toThrow();
    });
  });

  describe('renderTokenLink()', () => {
    it.each([
      { displayText: undefined, expectedText: 'basis.color.primary' },
      { displayText: 'Custom Text', expectedText: 'Custom Text' },
    ])(
      'renders a button with text "$expectedText" when displayText=$displayText',
      async ({ displayText, expectedText }) => {
        await element.updateComplete;

        const result = element.testRenderTokenLink('basis.color.primary', displayText);
        await element.updateComplete;

        expect(result).toBeDefined();
        expect(result.strings).toBeDefined();
        expect(result.values.includes(expectedText)).toBe(true);
      },
    );

    it('renders a button with a click handler that calls focusToken()', async () => {
      await element.updateComplete;

      const TestClass = class extends TestWizardTokenNavigator {
        override render() {
          return html`${this.testRenderTokenLink('basis.color.primary')}`;
        }
      };
      customElements.define('test-wizard-token-navigator-click', TestClass);

      const testElement = document.createElement('test-wizard-token-navigator-click') as TestWizardTokenNavigator;
      document.body.appendChild(testElement);
      await testElement.updateComplete;

      const focusTokenSpy = vi.spyOn(testElement, 'focusToken');
      const button = testElement.renderRoot.querySelector('button.theme-token-link') as HTMLElement;

      expect(button).toBeDefined();
      button?.click();
      await testElement.updateComplete;
      expect(focusTokenSpy).toHaveBeenCalledWith('basis.color.primary');

      testElement.remove();
    });

    it('renders a button with the correct attributes', async () => {
      await element.updateComplete;

      const container = document.createElement('div');
      element.renderRoot.appendChild(container);
      render(element.testRenderTokenLink('basis.color.primary', 'Custom Text'), container);
      await element.updateComplete;

      const button = container.querySelector('button.theme-token-link');
      expect(button?.getAttribute('type')).toBe('button');
      expect(button?.getAttribute('aria-label')).toBeDefined();
      expect(button?.textContent?.trim()).toBe('Custom Text');
    });
  });
});
