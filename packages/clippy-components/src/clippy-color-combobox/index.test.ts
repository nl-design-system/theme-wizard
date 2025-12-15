import { beforeEach, describe, expect, it } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import { ClippyColorCombobox } from './index';
import './index';

const tag = 'clippy-color-combobox';

const OPTIONS = [
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

describe(`<${tag}>`, () => {
  beforeEach(() => {
    document.body.innerHTML = `
    <form>
      <${tag} name="${tag}" options='${JSON.stringify(OPTIONS)}'></${tag}>
    </form>`;
  });

  it('shows an element with role combobox', async () => {
    const combobox = page.getByRole('combobox');
    await expect.element(combobox).toBeInTheDocument();
  });

  it('shows list of options on focus', async () => {
    const input = page.getByRole('combobox');
    await input.click();
    const options = page.getByRole('option').elements();
    expect(options.length).toBe(OPTIONS.length);
  });

  it('filters list of options based on text input', async () => {
    const query = OPTIONS[0].label.slice(0, -1);
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
    expect(component.value).toBe(OPTIONS.at(-1)?.value);
  });

  it('uses query as value', async () => {
    const component: ClippyColorCombobox = document.querySelector(tag)!;
    const query = 'Elmo';
    const input = page.getByRole('combobox');
    await input.fill(query).then(() => userEvent.keyboard('{Enter}'));
    expect(component.value).toBe(query);
  });

  it('shows up as a form element', async () => {
    const component: ClippyColorCombobox = document.querySelector(tag)!;
    const form: HTMLFormElement = document.querySelector('form')!;
    expect(form.elements).toContain(component);
  });

  it('holds a form value', async () => {
    const query = 'Elmo';
    const input = page.getByRole('combobox');
    await input.fill(query).then(() => userEvent.keyboard('{Enter}'));
    const form: HTMLFormElement = document.querySelector('form')!;
    const formData = new FormData(form);
    expect(formData.get(tag)).toContain(query);
  });

  it.each([
    [['ArrowDown'], OPTIONS[0]],
    [['ArrowDown', 'ArrowDown'], OPTIONS[1]],
    [['ArrowDown', 'ArrowDown', 'ArrowDown', 'ArrowDown'], OPTIONS[0]],
    [['ArrowDown', 'ArrowDown', 'ArrowDown', 'ArrowDown', 'ArrowDown', 'ArrowUp'], OPTIONS[0]],
  ])('changes the selected option with arrow keys', async (sequence, selection) => {
    const component: ClippyColorCombobox = document.querySelector(tag)!;
    const input = page.getByRole('combobox');
    await input.fill('');
    await userEvent.keyboard([...sequence, 'Enter'].map((k) => `{${k}}`).join(''));
    expect(component.value).toStrictEqual(selection.value);
  });
});
