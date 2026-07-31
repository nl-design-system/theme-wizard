import { describe, expect, it, afterEach } from 'vitest';
import './index';
import type { ClippyPopover } from './index';

const tag = 'clippy-popover';

describe(`<${tag}>`, () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('renders element', () => {
    document.body.innerHTML = `<${tag}></${tag}>`;
    const element = document.querySelector(tag);
    expect(element).toBeDefined();
  });

  it('has a trigger slot and a default panel slot', async () => {
    document.body.innerHTML = `<${tag}></${tag}>`;
    const component = document.querySelector(tag) as ClippyPopover;
    await component.updateComplete;

    const triggerSlot = component.shadowRoot?.querySelector('slot[name="trigger"]');
    const panelSlot = component.shadowRoot?.querySelector('slot:not([name])');
    expect(triggerSlot).not.toBeNull();
    expect(panelSlot).not.toBeNull();
  });

  it('sets aria-label from trigger-label', async () => {
    document.body.innerHTML = `<${tag} trigger-label="Show details"></${tag}>`;
    const component = document.querySelector(tag) as ClippyPopover;
    await component.updateComplete;

    const button = component.shadowRoot?.querySelector('button');
    expect(button?.getAttribute('aria-label')).toBe('Show details');
  });

  it('does not set aria-label when trigger-label is empty', async () => {
    document.body.innerHTML = `<${tag}></${tag}>`;
    const component = document.querySelector(tag) as ClippyPopover;
    await component.updateComplete;

    const button = component.shadowRoot?.querySelector('button');
    expect(button?.hasAttribute('aria-label')).toBe(false);
  });

  it('links the trigger button to the panel via popovertarget/id', async () => {
    document.body.innerHTML = `<${tag}></${tag}>`;
    const component = document.querySelector(tag) as ClippyPopover;
    await component.updateComplete;

    const button = component.shadowRoot?.querySelector('button');
    const panel = component.shadowRoot?.querySelector('[popover]');
    expect(button?.getAttribute('popovertarget')).toBe(panel?.id);
  });
});
