import { beforeEach, describe, expect, it } from 'vitest';
import { page } from 'vitest/browser';
import { ClippyLangCombobox } from './index';
import languages from './languages';
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

const EXONYM_TEST_CASES = {
  de: 'German',
  el: 'Greek',
  es: 'Spanish',
  fr: 'French',
  nl: 'Dutch',
};

const renderTag = ({
  format = 'autonym',
  options = OPTIONS,
}: {
  options?: string[];
  format?: 'autonym' | 'exonym' | 'both';
} = {}) => {
  return `
    <form>
      <${tag} name="${tag}" options='${options.join(' ')}' format="${format}"></${tag}>
    </form>`;
};

describe(`<${tag}>`, () => {
  beforeEach(() => {
    document.body.innerHTML = renderTag();
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

  it('infers its language from context', async () => {
    const component: ClippyLangCombobox = document.querySelector(tag)!;
    const form: HTMLFormElement = document.querySelector('form')!;
    expect(form.elements).toContain(component);
  });

  it('allows options as a token list', async () => {
    const component: ClippyLangCombobox = document.querySelector(tag)!;
    expect(component.options.length).toBe(OPTIONS.length);
  });

  it('adds language autonyms', async () => {
    const component: ClippyLangCombobox = document.querySelector(tag)!;
    // Check if every key has the expected autonym
    expect(component.options.map(({ autonym }) => autonym)).toEqual(
      OPTIONS.map((key) => languages[key as keyof typeof languages]),
    );
  });

  it('translates language exonyms', async () => {
    // Try a subset of exonyms in English
    document.body.innerHTML = renderTag({ options: Object.keys(EXONYM_TEST_CASES) });
    const component: ClippyLangCombobox = document.querySelector(tag)!;
    expect(component.options.map(({ exonym }) => exonym)).toEqual(Object.values(EXONYM_TEST_CASES));
  });
});
