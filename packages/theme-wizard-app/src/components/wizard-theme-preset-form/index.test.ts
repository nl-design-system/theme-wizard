import startTokens from '@nl-design-system-unstable/start-design-tokens/dist/tokens.json';
import '.';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import type { WizardThemePresetForm } from '.';
import type { WizardTokenUploadForm } from '../wizard-token-upload-form';
import { t } from '../../i18n';
import { SET_THEME_TOKENS_EVENT, type SetThemeTokensDetail } from '../../utils/events';

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

const uploadFile = async (el: WizardThemePresetForm, tokens: unknown) => {
  const uploadForm = el.shadowRoot?.querySelector('wizard-token-upload-form') as WizardTokenUploadForm;
  const fileInput = uploadForm.shadowRoot?.querySelector('input[type="file"]') as HTMLInputElement;

  await userEvent.upload(fileInput, toFile(tokens));
  await userEvent.click(page.getByRole('button', { name: label('themePresetForm.submit') }));

  return uploadForm;
};

describe(`<${tag}>`, () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('resets the invalid state when the file selection changes', async () => {
    const invalidTokens = {
      basis: { 'line-height': { md: { $value: '{basis.line-height.does-not-exist}' } } },
    };
    const el = await mount();
    const uploadForm = await uploadFile(el, invalidTokens);
    const fileInput = uploadForm.shadowRoot?.querySelector('input[type="file"]') as HTMLInputElement;

    // #handleUpload awaits parseThemePreset() (which itself awaits file.text()) before setting
    // state, so the result lands after userEvent.click() resolves — wait for it instead of
    // assuming a single updateComplete covers it.
    await vi.waitFor(() => expect(uploadForm.invalid).toBe(true));

    fileInput.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
    await vi.waitFor(() => expect(uploadForm.invalid).toBe(false));
  });

  it('accepts a valid Start-thema upload without marking the file input invalid', async () => {
    const el = await mount();
    const uploadForm = await uploadFile(el, startTokens);

    await vi.waitFor(() =>
      expect(page.getByRole('button', { name: label('themePresetForm.confirm') }).elements()).toHaveLength(1),
    );

    expect(uploadForm.invalid).toBe(false);
    expect(page.getByText(/aangevuld vanuit het Start-thema/).elements()).toHaveLength(0);
    expect(page.getByText(/kwaliteitswaarschuwing/).elements()).toHaveLength(0);
  });

  it('dispatches the tokens when confirming a valid upload', async () => {
    const el = await mount();
    await uploadFile(el, startTokens);

    const confirmButton = page.getByRole('button', { name: label('themePresetForm.confirm') });
    await vi.waitFor(() => expect(confirmButton.elements()).toHaveLength(1));

    let detail: SetThemeTokensDetail | undefined;
    el.addEventListener(SET_THEME_TOKENS_EVENT, (event) => {
      detail = (event as CustomEvent<SetThemeTokensDetail>).detail;
    });

    await userEvent.click(confirmButton);

    expect(detail?.tokens).toMatchObject({ basis: expect.any(Object) });
  });

  it('accepts a theme with only a soft issue (font-size below minimum), and shows the warning', async () => {
    const softIssueTokens = {
      basis: {
        text: {
          'font-size': {
            sm: { $type: 'fontSize', $value: '0.5rem' },
          },
        },
      },
    };
    const el = await mount();
    const uploadForm = await uploadFile(el, softIssueTokens);

    await vi.waitFor(() => expect(page.getByText(/kwaliteitswaarschuwing/).elements()).toHaveLength(1));

    expect(uploadForm.invalid).toBe(false);
    expect(page.getByRole('button', { name: label('themePresetForm.confirm') }).elements()).toHaveLength(1);
  });

  it('lists tokens filled in from the Start-thema for an incomplete upload', async () => {
    const el = await mount();
    await uploadFile(el, { basis: {} });

    await vi.waitFor(() => expect(page.getByText(/aangevuld vanuit het Start-thema/).elements()).toHaveLength(1));
  });
});
