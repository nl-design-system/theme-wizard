import { LitElement } from 'lit';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { getPopulatedSlots, isSlotEmpty } from './index';

class TestElement extends LitElement {}
customElements.define('test-element', TestElement);

describe('getPopulatedSlots', () => {
  let host: HTMLElement;

  beforeEach(() => {
    host = document.createElement('div');
    document.body.appendChild(host);
  });

  afterEach(() => {
    document.body.removeChild(host);
  });

  it('returns empty object for element with no children', () => {
    const element = document.createElement('test-element') as TestElement;
    host.appendChild(element);
    expect(getPopulatedSlots(element)).toEqual({});
  });

  it('returns object with empty string key for child without slot attribute', () => {
    const element = document.createElement('test-element') as TestElement;
    const child = document.createElement('div');
    element.appendChild(child);
    host.appendChild(element);

    const result = getPopulatedSlots(element);
    expect(result['']).toBe(child);
  });

  it('maps child with slot attribute to its slot name', () => {
    const element = document.createElement('test-element') as TestElement;
    const child = document.createElement('div');
    child.slot = 'test-slot';
    element.appendChild(child);
    host.appendChild(element);

    const result = getPopulatedSlots(element);
    expect(result['test-slot']).toBe(child);
    expect(Object.keys(result)).toEqual(['test-slot']);
  });

  it('handles multiple children with different slot names', () => {
    const element = document.createElement('test-element') as TestElement;
    const child1 = document.createElement('div');
    child1.slot = 'slot-1';
    const child2 = document.createElement('span');
    child2.slot = 'slot-2';
    element.appendChild(child1);
    element.appendChild(child2);
    host.appendChild(element);

    const result = getPopulatedSlots(element);
    expect(result['slot-1']).toBe(child1);
    expect(result['slot-2']).toBe(child2);
    expect(Object.keys(result).sort()).toEqual(['slot-1', 'slot-2']);
  });

  it('last child with same slot name overwrites previous one', () => {
    const element = document.createElement('test-element') as TestElement;
    const child1 = document.createElement('div');
    child1.slot = 'same-slot';
    const child2 = document.createElement('span');
    child2.slot = 'same-slot';
    element.appendChild(child1);
    element.appendChild(child2);
    host.appendChild(element);

    const result = getPopulatedSlots(element);
    expect(result['same-slot']).toBe(child2);
    expect(Object.keys(result)).toEqual(['same-slot']);
  });

  it('handles mixed children with and without slots', () => {
    const element = document.createElement('test-element') as TestElement;
    const child1 = document.createElement('div');
    child1.slot = 'named-slot';
    const child2 = document.createElement('span');
    const child3 = document.createElement('div');
    child3.slot = 'another-slot';
    element.appendChild(child1);
    element.appendChild(child2);
    element.appendChild(child3);
    host.appendChild(element);

    const result = getPopulatedSlots(element);
    expect(result['named-slot']).toBe(child1);
    expect(result['']).toBe(child2);
    expect(result['another-slot']).toBe(child3);
    expect(Object.keys(result).sort()).toEqual(['', 'another-slot', 'named-slot']);
  });

  it('handles child with empty string slot attribute', () => {
    const element = document.createElement('test-element') as TestElement;
    const child = document.createElement('div');
    child.slot = '';
    element.appendChild(child);
    host.appendChild(element);

    const result = getPopulatedSlots(element);
    expect(result['']).toBe(child);
    expect(Object.keys(result)).toEqual(['']);
  });
});

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
