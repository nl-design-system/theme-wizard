import { describe, it, expect } from 'vitest';
import { TokenReferenceSchema, extractRef } from './token-reference';

describe('TokenReferenceSchema', () => {
  it('allows valid ref with a single path', () => {
    const result = TokenReferenceSchema.safeParse('{ma}');
    expect.soft(result.success).toBeTruthy();
    expect.soft(result.data).toEqual('{ma}');
  });

  it('allows valid ref with nested paths', () => {
    const result = TokenReferenceSchema.safeParse('{ma.color.white}');
    expect.soft(result.success).toBeTruthy();
    expect.soft(result.data).toEqual('{ma.color.white}');
  });

  it('allows valid ref with dashes', () => {
    const result = TokenReferenceSchema.safeParse('{ma.color.white.bg-color}');
    expect.soft(result.success).toBeTruthy();
    expect.soft(result.data).toEqual('{ma.color.white.bg-color}');
  });

  it('disallows non-ref-like items', () => {
    expect.soft(TokenReferenceSchema.safeParse('{}').success).toBeFalsy();
    expect.soft(TokenReferenceSchema.safeParse('{.}').success).toBeFalsy();
    expect.soft(TokenReferenceSchema.safeParse('ma.color').success).toBeFalsy();
    expect.soft(TokenReferenceSchema.safeParse('{ma.color.}').success).toBeFalsy();
  });
});

describe('extractRef', () => {
  it('strips the curly braces from a reference', () => {
    expect(extractRef('{basis.color.accent-1.bg-document}')).toBe('basis.color.accent-1.bg-document');
  });

  it('works for single-segment references', () => {
    expect(extractRef('{brand}')).toBe('brand');
  });
});
