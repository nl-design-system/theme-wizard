import { it, expect } from 'vitest';
import { TokenReferenceSchema } from './token-reference';

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

it('disallows non-ref-like items', () => {
  expect.soft(TokenReferenceSchema.safeParse('{}').success).toBeFalsy();
  expect.soft(TokenReferenceSchema.safeParse('{.}').success).toBeFalsy();
  expect.soft(TokenReferenceSchema.safeParse('ma.color').success).toBeFalsy();
});
