import { ModernFontFamilyToken } from '@nl-design-system-community/design-tokens-schema';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import './index';
import type { WizardFontInput } from './index';
import { createInvalidRefIssue } from '../../../test/utils';
import { DEFAULT_FONT_OPTIONS } from './index';

const tag = 'wizard-font-input';

describe(`<${tag}>`, () => {
  beforeEach(() => {
    document.body.innerHTML = `<${tag}></${tag}>`;
  });

  it.each(DEFAULT_FONT_OPTIONS)('renders a list of common fonts including $label', async ({ label }) => {
    const textbox = page.getByRole('textbox');
    await textbox.click();
    const option = page.getByText(label);
    expect(option).toBeInTheDocument();
  });

  it.each([
    ['string value', 'Arial' as ModernFontFamilyToken['$value']],
    ['array value', ['Arial', 'sans-serif'] as ModernFontFamilyToken['$value']],
  ])('sets and gets %s', async (_, testValue) => {
    const component: WizardFontInput = document.querySelector(tag)!;
    component.value = testValue;
    expect(component.value).toBe(testValue);
  });

  it('dispatches a change event when the select value changes', async () => {
    const component: WizardFontInput = document.querySelector(tag)!;
    const changeHandler = vi.fn();
    component.addEventListener('change', changeHandler);
    const input = page.getByRole('textbox');
    await input.fill('Arial').then(() => userEvent.keyboard('{Enter}'));
    expect(changeHandler).toHaveBeenCalled();
  });

  it('renders error messages when errors are present', async () => {
    const component: WizardFontInput = document.querySelector(tag)!;
    component.errors = [createInvalidRefIssue()];
    component.requestUpdate();
    await component.updateComplete;

    const errorMessages = component.shadowRoot?.querySelectorAll('.utrecht-form-field-error-message');
    expect(errorMessages?.length).toBeGreaterThan(0);
  });

  it('marks the containing component as invalid when errors are present', async () => {
    const component: WizardFontInput = document.querySelector(tag)!;
    component.errors = [createInvalidRefIssue()];
    component.requestUpdate();
    await component.updateComplete;

    const shadowRoot = component.shadowRoot!;
    const input = shadowRoot.querySelector('clippy-combobox')!;

    expect(input.getAttribute('aria-invalid')).not.toBe(null);
  });

  it('marks the select as valid when errors are cleared', async () => {
    const component: WizardFontInput = document.querySelector(tag)!;
    component.errors = [createInvalidRefIssue()];
    component.requestUpdate();
    await component.updateComplete;

    component.errors = [];
    component.requestUpdate();
    await component.updateComplete;

    const shadowRoot = component.shadowRoot!;
    const input = shadowRoot.querySelector('clippy-combobox')!;

    expect(input.getAttribute('aria-invalid')).toBe(null);
  });
});
