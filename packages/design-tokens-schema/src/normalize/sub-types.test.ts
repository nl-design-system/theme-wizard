import assert from 'node:assert/strict';
import { describe, it } from 'vitest';
import { getTokenSubType } from './sub-types.js';

// ---------------------------------------------------------------------------
// dimension
// ---------------------------------------------------------------------------

describe('getTokenSubType – dimension', () => {
  it('font-size', () => assert.equal(getTokenSubType(['button', 'font-size'], 'dimension'), 'font-size'));
  it('font-size nested', () =>
    assert.equal(getTokenSubType(['component', 'label', 'font-size'], 'dimension'), 'font-size'));

  it('line-height', () => assert.equal(getTokenSubType(['button', 'line-height'], 'dimension'), 'line-height'));

  it('space-block via margin-block', () =>
    assert.equal(getTokenSubType(['button', 'margin-block'], 'dimension'), 'space-block'));
  it('space-block via padding-block', () =>
    assert.equal(getTokenSubType(['button', 'padding-block'], 'dimension'), 'space-block'));
  it('space-block via row-gap', () => assert.equal(getTokenSubType(['button', 'row-gap'], 'dimension'), 'space-block'));
  it('space-block via space.block group', () =>
    assert.equal(getTokenSubType(['space', 'block', 'md'], 'dimension'), 'space-block'));

  it('space-inline via margin-inline', () =>
    assert.equal(getTokenSubType(['button', 'margin-inline'], 'dimension'), 'space-inline'));
  it('space-inline via padding-inline', () =>
    assert.equal(getTokenSubType(['button', 'padding-inline'], 'dimension'), 'space-inline'));
  it('space-inline via column-gap', () =>
    assert.equal(getTokenSubType(['button', 'column-gap'], 'dimension'), 'space-inline'));
  it('space-inline via space.inline group', () =>
    assert.equal(getTokenSubType(['space', 'inline', 'md'], 'dimension'), 'space-inline'));

  it('border-radius', () => assert.equal(getTokenSubType(['button', 'border-radius'], 'dimension'), 'border-radius'));
  it('border-radius via group', () =>
    assert.equal(getTokenSubType(['basis', 'border-radius', 'sm'], 'dimension'), 'border-radius'));

  it('border-width', () => assert.equal(getTokenSubType(['button', 'border-top-width'], 'dimension'), 'border-width'));
  it('border-width generic', () =>
    assert.equal(getTokenSubType(['button', 'border-width'], 'dimension'), 'border-width'));

  it('size', () => assert.equal(getTokenSubType(['icon', 'size'], 'dimension'), 'size'));
  it('min-size', () => assert.equal(getTokenSubType(['button', 'min-size'], 'dimension'), 'size'));

  it('font-size takes priority over size', () =>
    assert.equal(getTokenSubType(['text', 'font-size'], 'dimension'), 'font-size'));

  it('returns null for unrecognised name', () =>
    assert.equal(getTokenSubType(['button', 'opacity'], 'dimension'), null));
});

// ---------------------------------------------------------------------------
// color
// ---------------------------------------------------------------------------

describe('getTokenSubType – color', () => {
  it('background-color via bg- prefix', () =>
    assert.equal(getTokenSubType(['button', 'bg-default'], 'color'), 'background-color'));
  it('background-color via exact name', () =>
    assert.equal(getTokenSubType(['button', 'background-color'], 'color'), 'background-color'));

  it('border-color via border- prefix', () =>
    assert.equal(getTokenSubType(['button', 'border-color'], 'color'), 'border-color'));
  it('border-color with variant', () =>
    assert.equal(getTokenSubType(['input', 'border-focus-color'], 'color'), 'border-color'));

  it('color via color- prefix', () => assert.equal(getTokenSubType(['button', 'color-default'], 'color'), 'color'));
  it('color via exact name', () => assert.equal(getTokenSubType(['button', 'color'], 'color'), 'color'));

  it('returns null for unrecognised name', () => assert.equal(getTokenSubType(['button', 'fill'], 'color'), null));
});

// ---------------------------------------------------------------------------
// number
// ---------------------------------------------------------------------------

describe('getTokenSubType – number', () => {
  it('line-height', () => assert.equal(getTokenSubType(['button', 'line-height'], 'number'), 'line-height'));
  it('font-weight', () => assert.equal(getTokenSubType(['button', 'font-weight'], 'number'), 'font-weight'));
  it('returns null for unrecognised name', () => assert.equal(getTokenSubType(['button', 'opacity'], 'number'), null));
});

// ---------------------------------------------------------------------------
// unknown type
// ---------------------------------------------------------------------------

describe('getTokenSubType – unknown type', () => {
  it('returns null', () => assert.equal(getTokenSubType(['button', 'font-size'], 'font-family'), null));
});
