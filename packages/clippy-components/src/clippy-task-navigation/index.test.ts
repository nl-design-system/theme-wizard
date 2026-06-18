import { beforeEach, describe, expect, it } from 'vitest';
import './index';

const tag = 'clippy-task-navigation';

describe(`<${tag}>`, () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('renders an anchor with Den Haag action classes', async () => {
    document.body.innerHTML = `<${tag}>Task</${tag}>`;
    const component = document.querySelector(tag) as unknown as {
      updateComplete: Promise<void>;
      shadowRoot?: ShadowRoot;
    };
    await component.updateComplete;

    const anchor = component.shadowRoot?.querySelector('a');
    expect(anchor).toBeTruthy();
    expect(anchor?.classList.contains('denhaag-action')).toBe(true);
    expect(anchor?.classList.contains('denhaag-action--single')).toBe(true);
    expect(anchor?.classList.contains('nl-link')).toBe(true);
  });

  it('sets the href attribute on the anchor', async () => {
    document.body.innerHTML = `<${tag} href="/tasks/1">Task</${tag}>`;
    const component = document.querySelector(tag) as unknown as {
      updateComplete: Promise<void>;
      shadowRoot?: ShadowRoot;
    };
    await component.updateComplete;

    const anchor = component.shadowRoot?.querySelector('a');
    expect(anchor?.getAttribute('href')).toBe('/tasks/1');
  });

  it('renders the default slot inside denhaag-action__content > strong', async () => {
    document.body.innerHTML = `<${tag}>My Task</${tag}>`;
    const component = document.querySelector(tag) as unknown as {
      updateComplete: Promise<void>;
      shadowRoot?: ShadowRoot;
    };
    await component.updateComplete;

    const strong = component.shadowRoot?.querySelector('.denhaag-action__content strong');
    expect(strong).toBeTruthy();

    const slot = strong?.querySelector('slot:not([name])');
    const slottedText =
      slot instanceof HTMLSlotElement
        ? slot
            .assignedNodes({ flatten: true })
            .map((n) => n.textContent ?? '')
            .join('')
        : '';
    expect(slottedText).toContain('My Task');
  });

  it('renders the details slot inside denhaag-action__details', async () => {
    document.body.innerHTML = `<${tag}><time slot="details">1 jan 2025</time>Task</${tag}>`;
    const component = document.querySelector(tag) as unknown as {
      updateComplete: Promise<void>;
      shadowRoot?: ShadowRoot;
    };
    await component.updateComplete;

    const detailsSlot = component.shadowRoot?.querySelector('.denhaag-action__details slot[name="details"]');
    expect(detailsSlot).toBeTruthy();
  });

  it('renders the actions slot inside denhaag-action__actions', async () => {
    document.body.innerHTML = `<${tag}><span slot="actions">→</span>Task</${tag}>`;
    const component = document.querySelector(tag) as unknown as {
      updateComplete: Promise<void>;
      shadowRoot?: ShadowRoot;
    };
    await component.updateComplete;

    const actionsSlot = component.shadowRoot?.querySelector('.denhaag-action__actions slot[name="actions"]');
    expect(actionsSlot).toBeTruthy();
  });

  it('the inner anchor is focusable', async () => {
    document.body.innerHTML = `<${tag} href="/tasks/1">Task</${tag}>`;
    const component = document.querySelector(tag) as unknown as {
      updateComplete: Promise<void>;
      shadowRoot?: ShadowRoot;
    };
    await component.updateComplete;

    const anchor = component.shadowRoot?.querySelector('a');
    anchor?.focus();
    expect(component.shadowRoot?.activeElement).toBe(anchor);
  });

  it('renders the iconStart slot before denhaag-action__content', async () => {
    document.body.innerHTML = `<${tag}><span slot="iconStart">★</span>Task</${tag}>`;
    const component = document.querySelector(tag) as unknown as {
      updateComplete: Promise<void>;
      shadowRoot?: ShadowRoot;
    };
    await component.updateComplete;

    const anchor = component.shadowRoot?.querySelector('a');
    const children = Array.from(anchor?.children ?? []);
    const slotIndex = children.findIndex((el) => el.matches('slot[name="iconStart"]'));
    const contentIndex = children.findIndex((el) => el.matches('.denhaag-action__content'));

    expect(slotIndex).toBeGreaterThanOrEqual(0);
    expect(slotIndex).toBeLessThan(contentIndex);
  });
});
