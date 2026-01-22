
import { beforeEach, describe, expect, it } from 'vitest';
import './index';

const tag = 'clippy-heading';

describe(`<${tag}>`, () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('renders an h1 by default', async () => {
    document.body.innerHTML = `<${tag}>Hello</${tag}>`;
    const component = document.querySelector(tag) as unknown as {
      updateComplete: Promise<void>;
      shadowRoot?: ShadowRoot;
    };
    await component.updateComplete;

    const h1 = component.shadowRoot?.querySelector('h1');
    expect(h1).toBeTruthy();
    expect(h1?.classList.contains('nl-heading')).toBe(true);
    expect(h1?.classList.contains('nl-heading--level-1')).toBe(true);

    const slot = h1?.querySelector('slot');
    const slottedText =
      slot instanceof HTMLSlotElement
        ? slot
            .assignedNodes({ flatten: true })
            .map((n) => n.textContent ?? '')
            .join('')
        : '';
    expect(slottedText).toContain('Hello');
  });

  it('renders the requested heading level when setting the level property', async () => {
    document.body.innerHTML = `<${tag}>Hello</${tag}>`;
    const component = document.querySelector(tag) as unknown as {
      level: number;
      updateComplete: Promise<void>;
      shadowRoot?: ShadowRoot;
    };

    component.level = 2;
    await component.updateComplete;

    const h2 = component.shadowRoot?.querySelector('h2');
    expect(h2).toBeTruthy();
    expect(h2?.classList.contains('nl-heading')).toBe(true);
    expect(h2?.classList.contains('nl-heading--level-2')).toBe(true);
    expect(component.shadowRoot?.querySelector('h1')).toBeFalsy();
  });

  it('accepts the level attribute', async () => {
    document.body.innerHTML = `<${tag} level="3">Hello</${tag}>`;
    const component = document.querySelector(tag) as unknown as {
      updateComplete: Promise<void>;
      shadowRoot?: ShadowRoot;
    };
    await component.updateComplete;

    const h3 = component.shadowRoot?.querySelector('h3');
    expect(h3).toBeTruthy();
    expect(h3?.classList.contains('nl-heading--level-3')).toBe(true);
  });
});
