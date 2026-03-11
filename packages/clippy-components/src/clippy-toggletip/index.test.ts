import { beforeEach, describe, expect, it } from 'vitest';
import './index';

const tag = 'clippy-toggletip';

describe(`<${tag}>`, () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <${tag} text="copy value to clipboard">
        <clippy-button>Copy</clippy-button>
      </${tag}>
    `;
  });

  it('renders tooltip content with role="tooltip"', () => {
    const toggletip = document.querySelector(tag) as HTMLElement & { shadowRoot: ShadowRoot };
    const tooltip = toggletip.shadowRoot.querySelector('[role="tooltip"]');

    expect(tooltip).toBeTruthy();
    expect(tooltip?.textContent?.trim()).toBe('copy value to clipboard');
  });
});
