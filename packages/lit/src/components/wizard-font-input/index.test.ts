import { ModernFontFamilyToken } from '@nl-design-system-community/design-tokens-schema';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import './index';
import type { WizardFontInput } from './index';
import { DEFAULT_FONT_OPTIONS } from './index';

const tag = 'wizard-font-input';

describe(`<${tag}>`, () => {
  beforeEach(() => {
    document.body.innerHTML = `<${tag}></${tag}>`;
  });

  it('shows a select element', async () => {
    const element = document.querySelector<WizardFontInput>(tag);
    await element?.updateComplete;
    const select = element?.shadowRoot?.querySelector('select');
    expect(select).toBeDefined();
  });

  it('shows a list of common fonts', async () => {
    const element = document.querySelector<WizardFontInput>(tag);
    await element?.updateComplete;
    const options = element?.shadowRoot?.querySelectorAll('option');
    expect(options?.length).toBeGreaterThan(1);

    const optionLabels = Array.from(options ?? []).map((opt) => opt.textContent?.trim());
    for (const defaultOption of DEFAULT_FONT_OPTIONS) {
      expect(optionLabels).toContain(defaultOption.label);
    }
  });

  it('shows default font options in an optgroup', async () => {
    const element = document.querySelector<WizardFontInput>(tag);
    await element?.updateComplete;
    const optgroups = element?.shadowRoot?.querySelectorAll('optgroup');
    const defaultOptgroup = Array.from(optgroups || []).find(
      (optGroup) => optGroup.getAttribute('label') === 'Standaardopties',
    );
    expect(defaultOptgroup).toBeDefined();
    const defaultOptions = defaultOptgroup?.querySelectorAll('option');
    expect(defaultOptions?.length).toBe(DEFAULT_FONT_OPTIONS.length);
  });

  it('shows custom options in a separate optgroup when provided', async () => {
    const element = document.querySelector<WizardFontInput>(tag);
    element!.options = [{ label: 'Custom Font', value: ['Custom Font', 'sans-serif'] }];
    element!.requestUpdate();
    await element!.updateComplete;

    const optgroups = element?.shadowRoot?.querySelectorAll('optgroup');
    const customOptgroup = Array.from(optgroups || []).find((optGroup) => optGroup.getAttribute('label') === 'Opties');
    expect(customOptgroup).toBeDefined();
    const customOptions = customOptgroup?.querySelectorAll('option');
    expect(customOptions?.length).toBe(1);
    expect(customOptions?.[0]?.textContent?.trim()).toBe('Custom Font');
  });

  it('does not show custom options optgroup when no custom options are provided', async () => {
    const element = document.querySelector<WizardFontInput>(tag);
    element!.options = [];
    element!.requestUpdate();
    await element!.updateComplete;

    const optgroups = element?.shadowRoot?.querySelectorAll('optgroup');
    const customOptgroup = Array.from(optgroups || []).find((optGroup) => optGroup.getAttribute('label') === 'Opties');
    expect(customOptgroup).toBeUndefined();
  });

  it('sets and gets value correctly', () => {
    const element = document.querySelector<WizardFontInput>(tag);
    const testValue: ModernFontFamilyToken['$value'] = ['Arial', 'sans-serif'];
    element!.value = testValue;
    expect(element!.value).toEqual(testValue);
  });

  it('automatically adds new values to options when set', async () => {
    const element = document.querySelector<WizardFontInput>(tag);
    const newValue: ModernFontFamilyToken['$value'] = ['New Font', 'sans-serif'];
    element!.value = newValue;
    element!.requestUpdate();
    await element!.updateComplete;

    expect(element!.options.length).toBeGreaterThan(0);
    const hasNewFont = element!.options.some(
      (opt) => opt.label === 'New Font' && JSON.stringify(opt.value) === JSON.stringify(newValue),
    );
    expect(hasNewFont).toBe(true);
  });

  it('does not add default font values to custom options', async () => {
    const element = document.querySelector<WizardFontInput>(tag);
    const defaultValue = DEFAULT_FONT_OPTIONS[0].value;
    element!.value = defaultValue;
    element!.requestUpdate();
    await element!.updateComplete;

    const hasDefaultInCustom = element!.options.some((opt) =>
      DEFAULT_FONT_OPTIONS.some((def) => JSON.stringify(def.value) === JSON.stringify(opt.value)),
    );
    expect(hasDefaultInCustom).toBe(false);
  });

  it('dispatches change event when select value changes', async () => {
    const element = document.querySelector<WizardFontInput>(tag);
    await element?.updateComplete;
    const select = element?.shadowRoot?.querySelector('select') as HTMLSelectElement;
    expect(select).toBeDefined();
    const changeHandler = vi.fn();
    element!.addEventListener('change', changeHandler);

    const options = select.querySelectorAll('option');
    expect(options.length).toBeGreaterThan(0);
    const firstOption = options[0] as HTMLOptionElement;
    select.value = firstOption.value;
    select.dispatchEvent(new Event('change', { bubbles: true }));

    expect(changeHandler).toHaveBeenCalled();
  });

  it('updates value when select changes', async () => {
    const element = document.querySelector<WizardFontInput>(tag);
    await element?.updateComplete;
    const select = element?.shadowRoot?.querySelector('select') as HTMLSelectElement;
    expect(select).toBeDefined();

    const georgiaOption = Array.from(select.options).find((opt) => JSON.parse(opt.value)[0] === 'Georgia');
    expect(georgiaOption).toBeDefined();
    const newValue: ModernFontFamilyToken['$value'] = ['Georgia', 'serif'];

    select.value = georgiaOption!.value;
    select.dispatchEvent(new Event('change', { bubbles: true }));
    await element!.updateComplete;

    expect(element!.value).toEqual(newValue);
  });
});
