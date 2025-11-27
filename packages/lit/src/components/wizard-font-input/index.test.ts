import { ModernFontFamilyToken } from '@nl-design-system-community/design-tokens-schema';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import './index';
import type { WizardFontInput } from './index';
import { createInvalidRefIssue } from '../../../test/utils';
import { DEFAULT_FONT_OPTIONS } from './index';

const tag = 'wizard-font-input';

const getFontInput = (): WizardFontInput => {
  const element = document.querySelector<WizardFontInput>(tag);
  if (!element) throw new Error(`<${tag}> was not found in the document`);
  return element;
};

const renderFontInput = async (overrides: Partial<WizardFontInput> = {}): Promise<WizardFontInput> => {
  const element = getFontInput();
  Object.assign(element, overrides);
  element.requestUpdate();
  await element.updateComplete;
  return element;
};

const getSelect = (element: WizardFontInput): HTMLSelectElement => {
  const select = element.shadowRoot?.querySelector('select') as HTMLSelectElement | null;
  if (!select) throw new Error('Expected <select> element in wizard-font-input shadow root');
  return select;
};

const getOptions = (element: WizardFontInput): HTMLOptionElement[] => Array.from(getSelect(element).options);

describe(`<${tag}>`, () => {
  beforeEach(() => {
    document.body.innerHTML = `<${tag}></${tag}>`;
  });

  describe('rendering', () => {
    it('renders a select element', async () => {
      const element = await renderFontInput();
      const select = getSelect(element);

      expect(select).toBeInstanceOf(HTMLSelectElement);
    });

    it('renders a list of common fonts including all default options', async () => {
      const element = await renderFontInput();
      const options = getOptions(element);

      expect(options.length).toBeGreaterThan(1);

      const optionLabels = options.map((opt) => opt.textContent?.trim());
      for (const { label } of DEFAULT_FONT_OPTIONS) {
        expect(optionLabels).toContain(label);
      }
    });

    it('renders default font options in an optgroup', async () => {
      const element = await renderFontInput();
      const optgroups = Array.from(element.shadowRoot?.querySelectorAll('optgroup') ?? []);
      const defaultOptgroup = optgroups.find((og) => og.getAttribute('label') === 'Standaardopties');

      expect(defaultOptgroup).toBeDefined();
      const defaultOptions = defaultOptgroup?.querySelectorAll('option');
      expect(defaultOptions?.length).toBe(DEFAULT_FONT_OPTIONS.length);
    });

    it('renders custom options in a separate optgroup when provided', async () => {
      const element = await renderFontInput({
        options: [{ label: 'Custom Font', value: ['Custom Font', 'sans-serif'] }],
      });

      const optgroups = Array.from(element.shadowRoot?.querySelectorAll('optgroup') ?? []);
      const customOptgroup = optgroups.find((og) => og.getAttribute('label') === 'Opties');

      expect(customOptgroup).toBeDefined();
      const customOptions = customOptgroup?.querySelectorAll('option');
      expect(customOptions?.length).toBe(1);
      expect(customOptions?.[0]?.textContent?.trim()).toBe('Custom Font');
    });

    it('does not render a custom options optgroup when no custom options are provided', async () => {
      const element = await renderFontInput({ options: [] });

      const optgroups = Array.from(element.shadowRoot?.querySelectorAll('optgroup') ?? []);
      const customOptgroup = optgroups.find((og) => og.getAttribute('label') === 'Opties');

      expect(customOptgroup).toBeUndefined();
    });
  });

  describe('value handling', () => {
    it.each([
      ['string value', 'Arial' as ModernFontFamilyToken['$value']],
      ['array value', ['Arial', 'sans-serif'] as ModernFontFamilyToken['$value']],
    ])('sets and gets %s', async (_, testValue) => {
      const element = await renderFontInput({ value: testValue });

      expect(element.value).toEqual(testValue);
    });

    it('automatically adds new values to options when set', async () => {
      const newValue: ModernFontFamilyToken['$value'] = ['New Font', 'sans-serif'];
      const element = await renderFontInput({ value: newValue });

      expect(element.options.length).toBeGreaterThan(0);
      const hasNewFont = element.options.some(
        (opt) => opt.label === 'New Font' && JSON.stringify(opt.value) === JSON.stringify(newValue),
      );
      expect(hasNewFont).toBe(true);
    });

    it('does not add default font values to custom options', async () => {
      const defaultValue = DEFAULT_FONT_OPTIONS[0].value;
      const element = await renderFontInput({ value: defaultValue });

      const hasDefaultInCustom = element.options.some((opt) =>
        DEFAULT_FONT_OPTIONS.some((def) => JSON.stringify(def.value) === JSON.stringify(opt.value)),
      );
      expect(hasDefaultInCustom).toBe(false);
    });

    it('updates value when select changes', async () => {
      const element = await renderFontInput();
      const select = getSelect(element);

      const georgiaOption = Array.from(select.options).find((opt) => JSON.parse(opt.value)[0] === 'Georgia');
      expect(georgiaOption).toBeDefined();

      const expectedValue: ModernFontFamilyToken['$value'] = ['Georgia', 'serif'];

      select.value = georgiaOption!.value;
      select.dispatchEvent(new Event('change', { bubbles: true }));
      await element.updateComplete;

      expect(element.value).toEqual(expectedValue);
    });
  });

  describe('change handling', () => {
    it('dispatches a change event when the select value changes', async () => {
      const element = await renderFontInput();
      const select = getSelect(element);
      const changeHandler = vi.fn();

      element.addEventListener('change', changeHandler);

      const [firstOption] = getOptions(element);
      expect(firstOption).toBeDefined();

      select.value = firstOption.value;
      select.dispatchEvent(new Event('change', { bubbles: true }));

      expect(changeHandler).toHaveBeenCalled();
    });

    it('restores previous value when select receives invalid JSON', async () => {
      const element = await renderFontInput();
      const select = getSelect(element);

      const arialOption = getOptions(element).find((opt) => JSON.parse(opt.value)[0] === 'Arial');
      expect(arialOption).toBeDefined();

      // Set a valid value first
      select.value = arialOption!.value;
      select.dispatchEvent(new Event('change', { bubbles: true }));
      await element.updateComplete;
      const previousValue = element.value;
      expect(previousValue).not.toBe('');

      // Inject an invalid option and try to select it
      const invalidOption = document.createElement('option');
      invalidOption.value = 'invalid-json';
      select.appendChild(invalidOption);

      select.value = 'invalid-json';
      select.dispatchEvent(new Event('change', { bubbles: true }));
      await element.updateComplete;

      expect(element.value).toEqual(previousValue);
      expect(select.value).toBe(arialOption!.value);
      expect(select.value).not.toBe('invalid-json');
    });
  });

  describe('error rendering', () => {
    it('renders error messages when errors are present', async () => {
      const element = await renderFontInput({ errors: [createInvalidRefIssue()] });

      const errorMessages = element.shadowRoot?.querySelectorAll('.utrecht-form-field-error-message');
      expect(errorMessages?.length).toBeGreaterThan(0);
    });

    it('marks the select as invalid when errors are present', async () => {
      const element = await renderFontInput({ errors: [createInvalidRefIssue()] });
      const select = getSelect(element);
      expect(select.getAttribute('aria-invalid')).toBe('true');
    });

    it('marks the select as valid when errors are cleared', async () => {
      const element = await renderFontInput({ errors: [createInvalidRefIssue()] });

      element.errors = [];
      element.requestUpdate();
      await element.updateComplete;

      const select = getSelect(element);
      // Not "true" is aria-valid
      expect(select.getAttribute('aria-invalid')).not.toBe(true);
    });
  });
});
