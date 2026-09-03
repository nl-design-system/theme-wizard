import '.';
import { beforeEach, describe, expect, it } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import { WIZARD_STARTER_PICKER_SUBMIT_EVENT, type WizardStarterPicker } from '.';
import { t } from '../../i18n';

const tag = 'wizard-starter-picker';

const label = (key: string) => String(t(key));

const mount = async () => {
  document.body.innerHTML = `<${tag}></${tag}>`;
  const el = document.querySelector(tag) as WizardStarterPicker;
  await el.updateComplete;
  return el;
};

describe(`<${tag}>`, () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    localStorage.clear();
  });

  it('exposes an accessible group with 3 radio options, "url" preselected', async () => {
    const el = await mount();

    expect(page.getByRole('group', { name: label('wizard.starterPicker.groupLabel') }).element()).toBeTruthy();

    // clippy-card-radio-group sets internals_.role = 'radiogroup' via ElementInternals,
    // but that isn't surfacing in this browser test environment's a11y tree (getByRole
    // can't find it), so we fall back to a plain DOM query for the group itself.
    expect(el.shadowRoot?.querySelector('clippy-card-radio-group')).toBeTruthy();

    expect(page.getByRole('radio').elements()).toHaveLength(3);
    expect(page.getByRole('radio', { name: label('wizard.starterPicker.url.name') }).elements()).toHaveLength(1);
    expect(page.getByRole('radio', { name: label('wizard.starterPicker.json.name') }).elements()).toHaveLength(1);
    expect(page.getByRole('radio', { name: label('wizard.starterPicker.startTheme.name') }).elements()).toHaveLength(1);

    expect(
      page.getByRole('radio', { name: label('wizard.starterPicker.url.name'), checked: true }).element(),
    ).toBeTruthy();
  });

  it('submits the preselected value by default', async () => {
    const el = await mount();

    let submitDetail: { value: string } | undefined;
    el.addEventListener(WIZARD_STARTER_PICKER_SUBMIT_EVENT, (event) => {
      submitDetail = (event as CustomEvent<{ value: string }>).detail;
    });

    await userEvent.click(page.getByRole('button', { name: label('wizard.starterPicker.submit') }));

    expect(submitDetail).toEqual({ value: 'url' });
  });

  it('submits the chosen value and prevents default submit event', async () => {
    const el = await mount();
    (
      page.getByRole('radio', { name: label('wizard.starterPicker.startTheme.name') }).element() as HTMLInputElement
    ).click();

    let submitDetail: { value: string } | undefined;
    el.addEventListener(WIZARD_STARTER_PICKER_SUBMIT_EVENT, (event) => {
      submitDetail = (event as CustomEvent<{ value: string }>).detail;
    });

    const form = el.shadowRoot?.querySelector('form');
    let defaultPrevented = false;
    form?.addEventListener('submit', (event) => {
      defaultPrevented = event.defaultPrevented;
    });

    await userEvent.click(page.getByRole('button', { name: label('wizard.starterPicker.submit') }));

    expect(submitDetail).toEqual({ value: 'start' });
    expect(defaultPrevented).toBe(true);
  });
});
