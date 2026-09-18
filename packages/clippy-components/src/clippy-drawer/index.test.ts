import { beforeEach, describe, expect, it } from 'vitest';
import { page } from 'vitest/browser';
import type { ClippyDrawer } from './index';
import './index';

const tag = 'clippy-drawer';

describe(`<${tag}>`, () => {
  let component: ClippyDrawer;

  beforeEach(() => {
    document.body.innerHTML = `<${tag}></${tag}>`;
    component = document.querySelector(tag) as ClippyDrawer;
  });

  it('renders', async () => {
    component.title = 'Test Modal Title';
    await component.updateComplete;
    component.open();

    const dialog = page.getByRole('dialog', { name: 'Test Modal Title' });
    await expect.element(dialog).toBeInTheDocument();
    await expect(component.getAttribute('side')).toBe('inline-start');
  });

  it('renders on the other side', async () => {
    component.title = 'Test Modal Title';
    component.side = 'inline-end';
    await component.updateComplete;
    component.open();

    await expect(component.getAttribute('side')).toBe('inline-end');
  });
});
