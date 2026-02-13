import { beforeEach, describe, expect, it } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import { ClippyColorCombobox } from './index';
import './index';

const tag = 'clippy-color-combobox';

const HEX_OPTIONS = [
  {
    label: '#ff6600',
    value: '#ff6600',
  },
  {
    label: '#00ff66',
    value: '#00ff66',
  },
  {
    label: '#6600ff',
    value: '#6600ff',
  },
];

const DESIGN_TOKEN_VALUE_OPTIONS = [
  {
    label: 'Red',
    value: {
      alpha: 1,
      colorSpace: 'srgb',
      components: [1, 0.2, 0.2],
    },
  },
  {
    label: 'Green',
    value: {
      alpha: 1,
      colorSpace: 'srgb',
      components: [0.2, 1, 0.2],
    },
  },
  {
    label: 'Blue',
    value: {
      alpha: 1,
      colorSpace: 'srgb',
      components: [0.2, 0.2, 1],
    },
  },
];

describe(`<${tag}>`, () => {
  beforeEach(() => {
    document.body.innerHTML = `
    <form>
      <${tag} name="${tag}" options='${JSON.stringify(HEX_OPTIONS)}'></${tag}>
    </form>`;
  });

  it('shows an element with role combobox', async () => {
    const combobox = page.getByRole('combobox');
    await expect.element(combobox).toBeInTheDocument();
  });

  it('allows a list of hex values', async () => {
    document.body.innerHTML = `
    <form>
      <${tag} name="${tag}" options='${JSON.stringify(HEX_OPTIONS)}'></${tag}>
    </form>`;
    const input = page.getByRole('combobox');
    await input.click();
    const options = page.getByRole('option').elements();
    expect(options.length).toBe(HEX_OPTIONS.length);
  });

  it('allows a list of design token $value objects', async () => {
    document.body.innerHTML = `
    <form>
      <${tag} name="${tag}" options='${JSON.stringify(DESIGN_TOKEN_VALUE_OPTIONS)}'></${tag}>
    </form>`;
    const input = page.getByRole('combobox');
    await input.click();
    const options = page.getByRole('option').elements();
    expect(options.length).toBe(DESIGN_TOKEN_VALUE_OPTIONS.length);
  });

  it('filters list of options based on text input', async () => {
    const query = HEX_OPTIONS[0].label.slice(0, -1);
    const input = page.getByRole('combobox');
    await input.fill(query);
    const options = page.getByRole('option').elements();
    expect(options.length).toBe(1);
  });

  it('selects an option when clicking it', async () => {
    const component: ClippyColorCombobox = document.querySelector(tag)!;
    const input = page.getByRole('combobox');
    await input.click();
    const option = page.getByRole('option').last();
    await option.click();
    expect(component.value).toBe(HEX_OPTIONS.at(-1)?.value);
  });

  it('shows up as a form element', async () => {
    const component: ClippyColorCombobox = document.querySelector(tag)!;
    const form: HTMLFormElement = document.querySelector('form')!;
    expect(form.elements).toContain(component);
  });

  it('holds a form value', async () => {
    const query = HEX_OPTIONS[0].value;
    const input = page.getByRole('combobox');
    await input.fill(query).then(() => userEvent.keyboard('{Enter}'));
    const form: HTMLFormElement = document.querySelector('form')!;
    const formData = new FormData(form);
    expect(formData.get(tag)).toContain(query);
  });

  it.each([
    [['ArrowDown'], HEX_OPTIONS[0]],
    [['ArrowDown', 'ArrowDown'], HEX_OPTIONS[1]],
    [['ArrowDown', 'ArrowDown', 'ArrowDown', 'ArrowDown'], HEX_OPTIONS[0]],
    [['ArrowDown', 'ArrowDown', 'ArrowDown', 'ArrowDown', 'ArrowDown', 'ArrowUp'], HEX_OPTIONS[0]],
  ])('changes the selected option with arrow keys', async (sequence, selection) => {
    const component: ClippyColorCombobox = document.querySelector(tag)!;
    const input = page.getByRole('combobox');
    await input.fill('');
    await userEvent.keyboard([...sequence, 'Enter'].map((k) => `{${k}}`).join(''));
    expect(component.value).toStrictEqual(selection.value);
  });

  it.each([
    ['Orange', HEX_OPTIONS[0]],
    ['green', HEX_OPTIONS[1]],
    ['purple', HEX_OPTIONS[2]],
  ])('filters on color name $0', async (query, selection) => {
    const component: ClippyColorCombobox = document.querySelector(tag)!;
    const input = page.getByRole('combobox');
    await input.fill(query);
    await userEvent.keyboard('{ArrowDown}{Enter}');
    expect(component.value).toStrictEqual(selection.value);
  });

  it.each([
    ['oranje', HEX_OPTIONS[0]],
    ['groen', HEX_OPTIONS[1]],
    ['paars', HEX_OPTIONS[2]],
  ])('filters on localized color name $0', async (query, selection) => {
    document.body.innerHTML = `
      <form>
        <${tag} name="${tag}" lang="nl" options='${JSON.stringify(HEX_OPTIONS)}'></${tag}>
      </form>`;
    const component: ClippyColorCombobox = document.querySelector(tag)!;
    const input = page.getByRole('combobox');
    await input.fill(query);
    await userEvent.keyboard('{ArrowDown}{Enter}');
    expect(component.value).toStrictEqual(selection.value);
  });
});
