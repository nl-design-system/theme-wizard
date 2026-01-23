import { beforeEach, describe, expect, it, vi } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import { ClippyCombobox } from './index';
import './index';

const tag = 'clippy-combobox';

const STRING_OPTIONS = ['Bert', 'Ernie'];

const OBJ_OPTIONS = [
  {
    label: 'Bert',
    value: 'bert',
  },
  {
    label: 'Ernie',
    value: 'ernie',
  },
];

describe(`<${tag}>`, () => {
  beforeEach(() => {
    document.body.innerHTML = `
    <form>
      <${tag} name="${tag}" options=${JSON.stringify(OBJ_OPTIONS)}></${tag}>
    </form>`;
  });

  it('shows an element with role combobox', async () => {
    const combobox = page.getByRole('combobox');
    await expect.element(combobox).toBeInTheDocument();
  });
  it('accepts an array of option objects as options', async () => {
    // Explicitly (re)-set the body so that the object options are used
    document.body.innerHTML = `
      <form>
        <${tag} name="${tag}" options=${JSON.stringify(OBJ_OPTIONS)}></${tag}>
      </form>`;
    const component: ClippyCombobox = document.querySelector(tag)!;
    expect(component.options).toHaveLength(OBJ_OPTIONS.length);
  });

  it('accepts an array of strings as options', async () => {
    // Explicitly set the body so that the string options are used
    document.body.innerHTML = `
      <form>
        <${tag} name="${tag}" options=${JSON.stringify(STRING_OPTIONS)}></${tag}>
      </form>`;

    // Wait for the custom element to be defined
    const component: ClippyCombobox = document.querySelector(tag)!;
    expect(component.options).toHaveLength(STRING_OPTIONS.length);
  });

  it('accepts a string of options separated by spaces', async () => {
    const separator = ' ';
    // Explicitly set the body so that the string options are used
    document.body.innerHTML = `
      <form>
        <${tag} name="${tag}" options="${STRING_OPTIONS.join(separator)}"></${tag}>
      </form>`;

    // Wait for the custom element to be defined
    const component: ClippyCombobox = document.querySelector(tag)!;
    expect(component.options).toHaveLength(STRING_OPTIONS.length);
  });

  it('shows list of options on focus', async () => {
    const input = page.getByRole('combobox');
    await input.click();
    const options = page.getByRole('option').elements();
    expect(options.length).toBe(OBJ_OPTIONS.length);
  });

  it('filters list of options based on text input', async () => {
    const query = OBJ_OPTIONS[0].label.slice(0, -1);
    const input = page.getByRole('combobox');
    await input.fill(query);
    const options = page.getByRole('option').elements();
    expect(options.length).toBe(1);
  });

  it('selects an option when clicking it', async () => {
    const component: ClippyCombobox = document.querySelector(tag)!;
    const input = page.getByRole('combobox');
    await input.click();
    const option = page.getByRole('option').last();
    await option.click();
    expect(component.value).toBe(OBJ_OPTIONS.at(-1)?.value);
  });

  it('shows up as a form element', async () => {
    const component: ClippyCombobox = document.querySelector(tag)!;
    const form: HTMLFormElement = document.querySelector('form')!;
    expect(form.elements).toContain(component);
  });

  it('holds a form value', async () => {
    const query = OBJ_OPTIONS[0].value;
    const input = page.getByRole('combobox');
    await input.fill(query).then(() => userEvent.keyboard('{Enter}'));
    const form: HTMLFormElement = document.querySelector('form')!;
    const formData = new FormData(form);
    expect(formData.get(tag)).toContain(query);
  });

  it.each([
    [['ArrowDown'], OBJ_OPTIONS[0]],
    [['ArrowDown', 'ArrowDown'], OBJ_OPTIONS[1]],
    [['ArrowDown', 'ArrowDown', 'ArrowDown'], OBJ_OPTIONS[0]],
    [['ArrowDown', 'ArrowDown', 'ArrowUp'], OBJ_OPTIONS[0]],
  ])('changes the selected option with arrow keys', async (sequence, selection) => {
    const component: ClippyCombobox = document.querySelector(tag)!;
    const input = page.getByRole('combobox');
    await input.fill('');
    await userEvent.keyboard([...sequence, 'Enter'].map((k) => `{${k}}`).join(''));
    expect(component.value).toBe(selection.value);
  });

  it.each([['focus'], ['blur'], ['change'], ['input']])('emits $0 event', async (event) => {
    const component: ClippyCombobox = document.querySelector(tag)!;
    const listener = vi.fn();
    component.addEventListener(event, listener);
    const input = page.getByRole('combobox');
    await input
      .click()
      .then(() => userEvent.keyboard('abc{Enter}'))
      .then(() => userEvent.keyboard('{Tab}'));
    expect(listener).toBeCalled();
  });

  it('allows other values than supplied options when `other` attribute is set', async () => {
    // Explicitly set the body so that the string options are used
    document.body.innerHTML = `
      <form>
        <${tag} name="${tag}" options="${STRING_OPTIONS}" other></${tag}>
      </form>`;

    const component: ClippyCombobox = document.querySelector(tag)!;
    const query = 'Elmo';
    const input = page.getByRole('combobox');
    await input.fill(query).then(() => userEvent.keyboard('{Enter}'));
    expect(component.value).toBe(query);
  });
});
