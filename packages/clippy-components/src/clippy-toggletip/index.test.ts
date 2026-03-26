import { beforeEach, describe, expect, it, vi } from 'vitest';
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

  it('renders tooltip content with role="tooltip"', async () => {
    const toggletip = document.querySelector(tag) as unknown as {
      shadowRoot: ShadowRoot;
      updateComplete: Promise<boolean>;
    };
    await toggletip.updateComplete;
    const tooltip = toggletip.shadowRoot.querySelector('[role="tooltip"]');

    expect(tooltip).toBeTruthy();
    expect(tooltip?.textContent?.trim()).toBe('copy value to clipboard');
  });

  it('uses default position when no position attribute is set', async () => {
    const toggletip = document.querySelector(tag) as unknown as {
      shadowRoot: ShadowRoot;
      updateComplete: Promise<boolean>;
    };
    await toggletip.updateComplete;
    const container = toggletip.shadowRoot.querySelector('.clippy-toggletip');

    expect(container?.classList.contains('clippy-toggletip--block-start')).toBe(true);
  });

  it('uses default position when position attribute is null', async () => {
    document.body.innerHTML = `
      <${tag} text="tooltip">
        <clippy-button>Copy</clippy-button>
      </${tag}>
    `;
    const toggletip = document.querySelector(tag) as unknown as {
      shadowRoot: ShadowRoot;
      updateComplete: Promise<boolean>;
      setAttribute: (name: string, value: string) => void;
      removeAttribute: (name: string) => void;
    };
    // Explicitly set position to null to trigger the null check
    toggletip.setAttribute('position', '');
    toggletip.removeAttribute('position');
    await toggletip.updateComplete;
    const container = toggletip.shadowRoot.querySelector('.clippy-toggletip');

    expect(container?.classList.contains('clippy-toggletip--block-start')).toBe(true);
  });

  it('applies valid position attribute', async () => {
    document.body.innerHTML = `
      <${tag} text="tooltip" position="inline-end">
        <clippy-button>Copy</clippy-button>
      </${tag}>
    `;
    const toggletip = document.querySelector(tag) as unknown as {
      shadowRoot: ShadowRoot;
      updateComplete: Promise<boolean>;
    };
    await toggletip.updateComplete;
    const container = toggletip.shadowRoot.querySelector('.clippy-toggletip');

    expect(container?.classList.contains('clippy-toggletip--inline-end')).toBe(true);
  });

  it('warns and uses default position for invalid position attribute', async () => {
    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    document.body.innerHTML = `
      <${tag} text="tooltip" position="invalid-position">
        <clippy-button>Copy</clippy-button>
      </${tag}>
    `;
    const toggletip = document.querySelector(tag) as unknown as {
      shadowRoot: ShadowRoot;
      updateComplete: Promise<boolean>;
    };
    await toggletip.updateComplete;
    const container = toggletip.shadowRoot.querySelector('.clippy-toggletip');

    expect(consoleWarnSpy).toHaveBeenCalledWith('Invalid position "invalid-position". Using default "block-start".');
    expect(container?.classList.contains('clippy-toggletip--block-start')).toBe(true);

    consoleWarnSpy.mockRestore();
  });

  it('renders nothing when text is empty', async () => {
    document.body.innerHTML = `
      <${tag}>
        <clippy-button>Copy</clippy-button>
      </${tag}>
    `;
    const toggletip = document.querySelector(tag) as unknown as {
      shadowRoot: ShadowRoot;
      updateComplete: Promise<boolean>;
    };
    await toggletip.updateComplete;
    const tooltip = toggletip.shadowRoot.querySelector('[role="tooltip"]');

    expect(tooltip?.textContent?.trim()).toBe('');
  });

  it.each(['block-start', 'inline-end', 'block-end', 'inline-start'])(
    'supports position value "%s"',
    async (position) => {
      document.body.innerHTML = `
        <${tag} text="tooltip" position="${position}">
          <clippy-button>Copy</clippy-button>
        </${tag}>
      `;
      const toggletip = document.querySelector(tag) as unknown as {
        shadowRoot: ShadowRoot;
        updateComplete: Promise<boolean>;
      };
      await toggletip.updateComplete;
      const container = toggletip.shadowRoot.querySelector('.clippy-toggletip');

      expect(container?.classList.contains(`clippy-toggletip--${position}`)).toBe(true);
    },
  );
});
