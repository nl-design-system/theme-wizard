import { it, expect } from 'vitest';
import { stripUnknown } from './strip-unknown';

it('Leaves token-only object intact', () => {
  const obj = {
    $type: 'color',
    $value: '#fff000',
  };
  expect(stripUnknown(obj)).toEqual(obj);
});

it('removes entire subtrees that have no token leaves', () => {
  const obj = {
    test: {
      nesting: {
        very: {
          deep: false,
        },
      },
    },
  };
  expect(stripUnknown(obj)).toEqual({});
});

it('removes properties from an object containing token information', () => {
  const obj = {
    $type: 'color',
    $value: '#fff000',
    original: 'not important',
  };
  const result = stripUnknown(obj);
  expect(result).not.toHaveProperty('original');
  expect(result).toEqual({
    $type: 'color',
    $value: '#fff000',
  });
});

it('does not mess with $extensions that contain nested objects', () => {
  const obj = {
    $extensions: {
      'test.1': {
        nested: {
          structure: 1,
        },
      },
    },
    $type: 'color',
    $value: '#fff000',
  };
  expect(stripUnknown(obj)?.['$extension']?.['test.1'].nested.structure).toBe(1);
  expect(stripUnknown(obj)).toEqual(obj);
});
