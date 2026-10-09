import { beforeEach, describe, expect, it } from 'vitest';
import { page } from 'vitest/browser';
import type { WizardUnstyledList } from '.';
import './index';

const tag = 'wizard-unstyled-list';

const mount = async (children = '<li>One</li><li>Two</li>'): Promise<WizardUnstyledList> => {
  document.body.innerHTML = `<${tag}>${children}</${tag}>`;
  const el = document.querySelector<WizardUnstyledList>(tag)!;
  await el.updateComplete;
  return el;
};

describe(`<${tag}>`, () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('exposes a list role that getByRole finds', async () => {
    await mount();
    await expect.element(page.getByRole('list')).toBeInTheDocument();
  });

  it('sets an explicit role="list" on the inner ul for Safari', async () => {
    const el = await mount();
    expect(el.shadowRoot?.querySelector('ul')?.getAttribute('role')).toBe('list');
  });

  it('finds slotted list items as listitems', async () => {
    const el = await mount();
    const items = page.getByRole('listitem');
    await expect.element(items.first()).toHaveTextContent('One');
    await expect.element(items.last()).toHaveTextContent('Two');
    expect(el.shadowRoot?.querySelector('slot')?.assignedElements()).toHaveLength(2);
  });

  it('renders an empty list when there are no children', async () => {
    await mount('');
    await expect.element(page.getByRole('list')).toBeInTheDocument();
    await expect.element(page.getByRole('listitem')).not.toBeInTheDocument();
  });
});
