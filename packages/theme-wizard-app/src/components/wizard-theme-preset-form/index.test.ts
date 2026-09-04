import '.';
import { beforeEach, describe, expect, it } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import type { WizardThemePresetForm } from '.';
import type { WizardTokenUploadForm } from '../wizard-token-upload-form';
import { t } from '../../i18n';

const tag = 'wizard-theme-preset-form';

const label = (key: string) => String(t(key));

const mount = async () => {
  document.body.innerHTML = `<${tag}></${tag}>`;
  const el = document.querySelector(tag) as WizardThemePresetForm;
  await el.updateComplete;
  return el;
};

const toFile = (tokens: unknown, name = 'tokens.json') =>
  new File([JSON.stringify(tokens)], name, { type: 'application/json' });

const invalidTokens = {
  basis: { 'border-radius': { md: { $value: '{basis.border-radius.does-not-exist}' } } },
};

describe(`<${tag}>`, () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('resets the invalid state when the file selection changes', async () => {
    const el = await mount();
    const uploadForm = el.shadowRoot?.querySelector('wizard-token-upload-form') as WizardTokenUploadForm;
    const fileInput = uploadForm.shadowRoot?.querySelector('input[type="file"]') as HTMLInputElement;

    await userEvent.upload(fileInput, toFile(invalidTokens));
    await userEvent.click(page.getByRole('button', { name: label('themePresetForm.submit') }));
    await el.updateComplete;

    expect(uploadForm.invalid).toBe(true);

    fileInput.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
    await el.updateComplete;

    expect(uploadForm.invalid).toBe(false);
  });
});
