import { beforeEach, describe, expect, test, vi } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import './index';

const tag = 'wizard-token-input';

describe(`<${tag}>`, () => {
  beforeEach(() => {
    document.body.innerHTML = `<${tag}></${tag}><button>hoi</button>`;
  });

  test('shows a form control', () => {
    const formElement = page.getByRole('textbox');
    expect(formElement).toBeDefined();
  });

  test('emits a changeEvent a form control', async () => {
    const mockEventHandler = vi.fn();
    document.addEventListener('change', mockEventHandler);
    const textboxElement = page.getByRole('textbox');
    await textboxElement.fill('null');
    await userEvent.tab(); // move focus to commit change
    expect(mockEventHandler).toBeCalled();
  });
});
