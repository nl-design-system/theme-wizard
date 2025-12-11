import { beforeEach, describe, expect, it, vi } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import { ClippyCombobox } from './index';
import './index';

const tag = 'clippy-combobox';

const OPTIONS = [
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
      <${tag} name="${tag}" options=${JSON.stringify(OPTIONS)}></${tag}>
    </form>`;
  });

  it('shows an element with role combobox', async () => {
    const combobox = page.getByRole('combobox');
    await expect.element(combobox).toBeInTheDocument();
  });

  it('shows list of options on focus', async () => {
    const input = page.getByRole('textbox');
    await input.click();
    const options = page.getByRole('option').elements();
    expect(options.length).toBe(OPTIONS.length);
  });

  it('filters list of options based on text input', async () => {
    const query = OPTIONS[0].label.slice(0, -1);
    const input = page.getByRole('textbox');
    await input.fill(query);
    const options = page.getByRole('option').elements();
    expect(options.length).toBe(1);
  });

  it('selects an option when clicking it', async () => {
    const component: ClippyCombobox = document.querySelector(tag)!;
    const input = page.getByRole('textbox');
    await input.click();
    const option = page.getByRole('option').last();
    await option.click();
    expect(component.value).toBe(OPTIONS.at(-1)?.value);
  });

  it('uses query as value', async () => {
    const component: ClippyCombobox = document.querySelector(tag)!;
    const query = 'Elmo';
    const input = page.getByRole('textbox');
    await input.fill(query).then(() => userEvent.keyboard('{Enter}'));
    expect(component.value).toBe(query);
  });

  it('shows up as a form element', async () => {
    const component: ClippyCombobox = document.querySelector(tag)!;
    const form: HTMLFormElement = document.querySelector('form')!;
    expect(form.elements).toContain(component);
  });

  it('holds a form value', async () => {
    const query = 'Elmo';
    const input = page.getByRole('textbox');
    await input.fill(query).then(() => userEvent.keyboard('{Enter}'));
    const form: HTMLFormElement = document.querySelector('form')!;
    const formData = new FormData(form);
    expect(formData.get(tag)).toContain(query);
  });

  it.each([
    [['ArrowDown'], OPTIONS[0]],
    [['ArrowDown', 'ArrowDown'], OPTIONS[1]],
    [['ArrowDown', 'ArrowDown', 'ArrowDown'], OPTIONS[0]],
    [['ArrowDown', 'ArrowDown', 'ArrowUp'], OPTIONS[0]],
  ])('changes the selected option with arrow keys', async (sequence, selection) => {
    const component: ClippyCombobox = document.querySelector(tag)!;
    const input = page.getByRole('textbox');
    await input.fill('');
    await userEvent.keyboard([...sequence, 'Enter'].map((k) => `{${k}}`).join(''));
    expect(component.value).toBe(selection.value);
  });

  it.each([['focus'], ['blur'], ['change'], ['input']])('emits $0 event', async (event) => {
    const component: ClippyCombobox = document.querySelector(tag)!;
    const listener = vi.fn();
    component.addEventListener(event, listener);
    const input = page.getByRole('textbox')
    await input.click().then(() => userEvent.keyboard('abc{Enter}')).then(() => userEvent.keyboard('{Tab}'));
    expect(listener).toBeCalled();
  });
});
