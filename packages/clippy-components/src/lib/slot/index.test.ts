import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { isSlotEmpty } from './index';

describe('isSlotEmpty', () => {
  let host: HTMLElement;
  let shadow: ShadowRoot;

  beforeEach(() => {
    host = document.createElement('div');
    shadow = host.attachShadow({ mode: 'open' });
    document.body.appendChild(host);
  });

  afterEach(() => {
    document.body.removeChild(host);
  });

  it('returns true for an empty slot with no assigned elements', () => {
    const slot = document.createElement('slot');
    shadow.appendChild(slot);

    expect(isSlotEmpty(slot)).toBe(true);
  });

  it('returns false for a slot with a regular element assigned', () => {
    host.innerHTML = '<div>content</div>';
    const slot = document.createElement('slot');
    shadow.appendChild(slot);

    expect(isSlotEmpty(slot)).toBe(false);
  });

  it('returns false for a slot with text element assigned', () => {
    host.innerHTML = '<span>text</span>';
    const slot = document.createElement('slot');
    shadow.appendChild(slot);

    expect(isSlotEmpty(slot)).toBe(false);
  });

  it('returns false for a slot with multiple elements assigned', () => {
    host.innerHTML = '<div>first</div><span>second</span>';
    const slot = document.createElement('slot');
    shadow.appendChild(slot);

    expect(isSlotEmpty(slot)).toBe(false);
  });

  it('returns true for a slot assigned an empty slot from light DOM', () => {
    host.innerHTML = '<slot></slot>';
    const slot = document.createElement('slot');
    shadow.appendChild(slot);

    expect(isSlotEmpty(slot)).toBe(true);
  });

  it('returns true for a slot with multiple empty slots assigned from light DOM', () => {
    host.innerHTML = '<slot></slot><slot></slot>';
    const slot = document.createElement('slot');
    shadow.appendChild(slot);

    expect(isSlotEmpty(slot)).toBe(true);
  });

  it('returns false for a slot with mixed empty slots and content', () => {
    host.innerHTML = '<slot></slot><div>content</div>';
    const slot = document.createElement('slot');
    shadow.appendChild(slot);

    expect(isSlotEmpty(slot)).toBe(false);
  });

  it('returns true for a slot with deeply nested empty slots in light DOM', () => {
    host.innerHTML = '<slot><slot><slot></slot></slot></slot>';
    const slot = document.createElement('slot');
    shadow.appendChild(slot);

    expect(isSlotEmpty(slot)).toBe(true);
  });

  it('handles slot with name attribute and assigned elements', () => {
    host.innerHTML = '<div slot="test">content</div>';
    const slot = document.createElement('slot');
    slot.name = 'test';
    shadow.appendChild(slot);

    expect(isSlotEmpty(slot)).toBe(false);
  });

  it('handles slot with name attribute and no matching assigned elements', () => {
    host.innerHTML = '<div>content</div>';
    const slot = document.createElement('slot');
    slot.name = 'non-existent';
    shadow.appendChild(slot);

    expect(isSlotEmpty(slot)).toBe(true);
  });
});
