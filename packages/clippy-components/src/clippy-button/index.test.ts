import { describe, expect, it, vi } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import { ClippyButton } from './index';
import './index';

const tag = 'clippy-button';

describe(`<${tag}>`, () => {
  it('renders with default properties', async () => {
    document.body.innerHTML = `<${tag}>Click me</${tag}>`;
    const component: ClippyButton = document.querySelector(tag)!;
    expect(component.type).toBe('button');
    expect(component.size).toBe('medium');
    expect(component.toggle).toBe(false);
    expect(component.pressed).toBe(false);
    expect(component['icon-only']).toBe(false);
  });

  it('resets form when `type` is `reset`', async () => {
    document.body.innerHTML = `<form><${tag} type="reset"></${tag}></form>`;
    const form: HTMLFormElement = document.querySelector('form')!;
    const resetHandler = vi.fn();
    form.reset = resetHandler;
    await page.getByRole('button').click();
    expect.soft(resetHandler).toBeCalled();
  });

  it('does not reset form when `type` is not `reset`', async () => {
    document.body.innerHTML = `<form><${tag}></${tag}></form>`;
    const form: HTMLFormElement = document.querySelector('form')!;
    const resetHandler = vi.fn();
    form.reset = resetHandler;
    await page.getByRole('button').click();
    expect(resetHandler).not.toBeCalled();
  });

  it('dispatches submit event when `type` is `submit`', async () => {
    document.body.innerHTML = `<form><${tag} type="submit"></${tag}></form>`;
    const form: HTMLFormElement = document.querySelector('form')!;
    const submitHandler = vi.fn();
    form.addEventListener('submit', submitHandler);
    await page.getByRole('button').click();
    expect.soft(submitHandler).toBeCalled();
    expect.soft(submitHandler).toHaveBeenCalledWith(
      expect.objectContaining({
        submitter: expect.any(ClippyButton),
      }),
    );
  });

  it('does not dispatch submit event when `type` is not `submit`', async () => {
    document.body.innerHTML = `<form><${tag}></${tag}></form>`;
    const form: HTMLFormElement = document.querySelector('form')!;
    const submitHandler = vi.fn();
    form.addEventListener('submit', submitHandler);
    await page.getByRole('button').click();
    expect(submitHandler).not.toBeCalled();
  });
});
