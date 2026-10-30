import { beforeEach, describe, expect, it, vi } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import { ClippyTokenCombobox } from './index';
import './index';

const tag = 'clippy-token-combobox';

const TOKEN = {
  $extensions: { 'nl.nldesignsystem.token-path': ['basis', 'size', 'md'] },
  $type: 'dimension',
  $value: { unit: 'px', value: 16 },
};

describe(`<${tag}>`, () => {
  beforeEach(() => {
    // Set value before connecting, like Lit does when rendering `.value=${token}`
    document.body.innerHTML = '';
    const component = document.createElement(tag);
    component.name = tag;
    component.type = 'dimension';
    component.value = structuredClone(TOKEN) as ClippyTokenCombobox['value'];
    document.body.append(component);
  });

  it('does not emit change on blur when the value is unchanged', async () => {
    const component: ClippyTokenCombobox = document.querySelector(tag)!;
    const listener = vi.fn();
    component.addEventListener('change', listener);
    await page
      .getByRole('combobox')
      .click()
      .then(() => userEvent.keyboard('{Tab}'));
    expect(listener).not.toHaveBeenCalled();
  });

  it('emits change on blur when the value is changed', async () => {
    const component: ClippyTokenCombobox = document.querySelector(tag)!;
    const listener = vi.fn();
    component.addEventListener('change', listener);
    await page
      .getByRole('combobox')
      .fill('24px')
      .then(() => userEvent.keyboard('{Tab}'));
    expect(listener).toHaveBeenCalled();
  });
});
