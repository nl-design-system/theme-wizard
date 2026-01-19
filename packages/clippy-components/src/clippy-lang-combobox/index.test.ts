import { beforeEach, describe, expect, it } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import { ClippyLangCombobox } from './index';
import './index';

const tag = 'clippy-lang-combobox';

const OPTIONS = [
  'bg',
  'cs',
  'da',
  'de',
  'el',
  'en',
  'es',
  'et',
  'fi',
  'fr',
  'ga',
  'hr',
  'hu',
  'it',
  'lt',
  'lv',
  'mt',
  'nl',
  'pl',
  'pt',
  'ro',
  'sk',
  'sl',
  'sv',
];

describe(`<${tag}>`, () => {
  beforeEach(() => {
    document.body.innerHTML = `
    <form>
      <${tag} name="${tag}" options='${OPTIONS}'></${tag}>
    </form>`;
  });

  it('shows an element with role combobox', async () => {
    const combobox = page.getByRole('combobox');
    await expect.element(combobox).toBeInTheDocument();
  });

  it('shows up as a form element', async () => {
    const component: ClippyLangCombobox = document.querySelector(tag)!;
    const form: HTMLFormElement = document.querySelector('form')!;
    expect(form.elements).toContain(component);
  });
});
