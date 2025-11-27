import { beforeEach, describe, expect, it, vi } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import { createContrastIssue } from '../../../test/utils/index';
import { WizardTokenInput } from './index';

const tag = 'wizard-token-input';

const baseError = createContrastIssue();

const getTokenInput = (): WizardTokenInput => {
  const element = document.querySelector<WizardTokenInput>(tag);
  if (!element) throw new Error(`<${tag}> was not found in the document`);
  return element;
};

const renderTokenInput = async (overrides: Partial<WizardTokenInput> = {}): Promise<WizardTokenInput> => {
  const element = getTokenInput();
  Object.assign(element, overrides);
  element.requestUpdate();
  await element.updateComplete;
  return element;
};

const getTextarea = (element: WizardTokenInput): HTMLTextAreaElement => {
  const textarea = element.shadowRoot?.querySelector('textarea') as HTMLTextAreaElement | null;
  if (!textarea) throw new Error('Expected <textarea> element in wizard-token-input shadow root');
  return textarea;
};

describe(`<${tag}>`, () => {
  beforeEach(() => {
    document.body.innerHTML = `<${tag}></${tag}>`;
  });

  describe('rendering', () => {
    it('shows a form control', () => {
      const formElement = page.getByRole('textbox');
      expect(formElement).toBeDefined();
    });

    it('renders a textarea element', async () => {
      const element = await renderTokenInput();
      const textarea = getTextarea(element);
      expect(textarea).toBeInstanceOf(HTMLTextAreaElement);
    });

    it('renders a label element', async () => {
      const element = await renderTokenInput({ label: 'Test Label' });
      const label = element.shadowRoot?.querySelector('label');
      expect(label).toBeDefined();
      expect(label?.textContent?.trim()).toBe('Test Label');
    });

    it('sets textarea name attribute', async () => {
      const element = await renderTokenInput({ name: 'test-name' });
      const textarea = getTextarea(element);
      expect(textarea.getAttribute('name')).toBe('test-name');
    });

    it('sets textarea id attribute', async () => {
      const element = await renderTokenInput();
      const textarea = getTextarea(element);
      const label = element.shadowRoot?.querySelector('label');
      expect(textarea.getAttribute('id')).toBe(element.id);
      expect(label?.getAttribute('for')).toBe(element.id);
    });
  });

  describe('valueAsString static method', () => {
    it.each([
      { expected: 'test string', input: 'test string' },
      { expected: '42', input: 42 },
      { expected: '3.14', input: 3.14 },
      { expected: '0', input: 0 },
      { expected: 'true', input: true },
      { expected: 'false', input: false },
      { expected: 'null', input: null },
      { expected: 'undefined', input: undefined },
      {
        expected: JSON.stringify({ key: 'value', nested: { prop: 123 } }, null, 2),
        input: { key: 'value', nested: { prop: 123 } },
      },
    ])('returns string representation for $input', ({ expected, input }) => {
      expect(WizardTokenInput.valueAsString(input)).toBe(expected);
    });
  });

  describe('value handling', () => {
    it('returns empty object when no value is set', async () => {
      const element = await renderTokenInput();
      expect(element.value).toEqual({});
    });

    it.each([
      { expected: 'test-value', token: { $value: 'test-value' } },
      { expected: 'red', token: { $type: 'color', $value: 'red' } },
    ])('returns $value when token has $value property', async ({ expected, token }) => {
      const element = await renderTokenInput({ value: token });
      expect(element.value).toBe(expected);
    });

    it('returns token itself when token has no $value property', async () => {
      const token = { $type: 'color', someOtherProp: 'value' };
      const element = await renderTokenInput({ value: token });
      expect(element.value).toEqual(token);
    });

    it.each([
      { expectedTextarea: 'red', token: { $type: 'color', $value: 'red' } },
      {
        expectedTextarea: JSON.stringify({ $type: 'color', someProp: 'value' }, null, 2),
        token: { $type: 'color', someProp: 'value' },
      },
    ])('updates textarea value when value is set', async ({ expectedTextarea, token }) => {
      const element = await renderTokenInput({ value: token });
      const textarea = getTextarea(element);
      expect(textarea.value).toBe(expectedTextarea);
    });

    it.each([
      { expected: 'new-value', initial: { $value: 'initial' }, newValue: 'new-value' },
      {
        expected: { $type: 'dimension', someOtherProp: 'value2' },
        initial: { $type: 'color', someProp: 'value' },
        newValue: { $type: 'dimension', someOtherProp: 'value2' },
      },
      {
        expected: { $type: 'dimension', $value: '10px' },
        initial: { $type: 'color', $value: 'red' },
        newValue: { $type: 'dimension', $value: '10px' },
      },
    ])('updates value correctly when replacing', async ({ expected, initial, newValue }) => {
      const element = await renderTokenInput({ value: initial });
      element.value = newValue;
      await element.updateComplete;

      expect(element.value).toEqual(expected);
    });
  });

  describe('change handling', () => {
    it('dispatches a change event when the textarea value changes', async () => {
      const mockEventHandler = vi.fn();
      document.addEventListener('change', mockEventHandler);
      await page.getByRole('textbox').fill('null');
      await userEvent.tab();
      expect(mockEventHandler).toBeCalled();
    });

    it('parses valid JSON and updates value', async () => {
      const element = await renderTokenInput();
      const textarea = getTextarea(element);
      textarea.value = '{"$type":"color","$value":"red"}';
      textarea.dispatchEvent(new Event('change', { bubbles: true }));

      await element.updateComplete;
      expect(element.value).toBe('red');
    });

    it('resets textarea value and does not dispatch change event when JSON parsing fails', async () => {
      const element = await renderTokenInput({ value: { $type: 'color', $value: 'blue' } });
      const textarea = getTextarea(element);
      const initialTextareaValue = textarea.value;
      const changeHandler = vi.fn();
      element.addEventListener('change', changeHandler);

      textarea.value = 'invalid json {';
      textarea.dispatchEvent(new Event('change', { bubbles: true }));

      await element.updateComplete;
      expect(textarea.value).toBe(initialTextareaValue);
      expect(element.value).toBe('blue');
      expect(changeHandler).not.toHaveBeenCalled();
    });

    it('only handles events from HTMLTextAreaElement', async () => {
      const element = await renderTokenInput();

      const fakeEvent = new Event('change', { bubbles: true });
      Object.defineProperty(fakeEvent, 'target', { value: document.createElement('input'), writable: false });

      expect(() => element.dispatchEvent(fakeEvent)).not.toThrow();
    });
  });

  describe('error rendering', () => {
    it('renders error messages when errors are present', async () => {
      const element = await renderTokenInput({ errors: [baseError] });

      const errorMessages = element.shadowRoot?.querySelectorAll('.utrecht-form-field-error-message');
      expect(errorMessages?.length).toBeGreaterThan(0);
    });

    it('applies error class to textarea when errors are present', async () => {
      const element = await renderTokenInput({ errors: [baseError] });
      const textarea = getTextarea(element);
      expect(textarea.classList.contains('theme-error')).toBe(true);
    });

    it('removes error class from textarea when errors are cleared', async () => {
      const element = await renderTokenInput({ errors: [baseError] });
      element.errors = [];
      element.requestUpdate();
      await element.updateComplete;

      const textarea = getTextarea(element);
      expect(textarea.classList.contains('theme-error')).toBe(false);
    });
  });

  describe('form association', () => {
    it('has formAssociated static property set to true', () => {
      expect(WizardTokenInput.formAssociated).toBe(true);
    });

    it('has internals_ property and sets form value when value is set', async () => {
      const element = await renderTokenInput();

      expect(element.internals_).toBeDefined();

      const token = { $type: 'color', $value: 'red' };
      const setFormValueSpy = vi.spyOn(element.internals_, 'setFormValue');
      element.value = token;
      await element.updateComplete;

      expect(setFormValueSpy).toHaveBeenCalledWith(JSON.stringify(token, null, 2));
    });
  });
});
