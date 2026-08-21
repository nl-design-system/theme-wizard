import { it, describe, expect } from 'vitest';
import { removeNonTokenProperties } from './remove-non-token-properties';

describe('removeNonTokenProperties', () => {
  it('strips non-standard keys from a token', () => {
    const tokens = {
      color: {
        red: {
          $type: 'color',
          $value: '#ff0000',
          comment: 'legacy metadata',
        },
      },
    };
    const result = removeNonTokenProperties(tokens);
    expect(result).toEqual({
      color: {
        red: {
          $type: 'color',
          $value: '#ff0000',
        },
      },
    });
  });

  it('keeps standard token keys', () => {
    const tokens = {
      color: {
        red: {
          $deprecated: true,
          $description: 'the red color',
          $extensions: { 'sub-type': 'brand' },
          $type: 'color',
          $value: '#ff0000',
        },
      },
    };
    const result = removeNonTokenProperties(tokens);
    expect(result).toEqual(tokens);
  });

  it('strips metadata from nested tokens', () => {
    const tokens = {
      color: {
        blue: { $type: 'color', $value: '#0000ff', junk: 1 },
        red: { $type: 'color', $value: '#ff0000', junk: 2 },
      },
    };
    const result = removeNonTokenProperties(tokens);
    expect(result).toEqual({
      color: {
        blue: { $type: 'color', $value: '#0000ff' },
        red: { $type: 'color', $value: '#ff0000' },
      },
    });
  });

  it('strips stray non-object keys from a token group', () => {
    const tokens = {
      basis: {
        color: {
          'accent-1': {
            50: { $type: 'color', $value: '#f0f4ff' },
            groupMetadata: 'strip-me',
          },
        },
      },
    };
    const result = removeNonTokenProperties(tokens);
    expect(result).toEqual({
      basis: {
        color: {
          'accent-1': {
            50: { $type: 'color', $value: '#f0f4ff' },
          },
        },
      },
    });
  });

  it('strips unknown $-prefixed keys from a token group', () => {
    const tokens = {
      basis: {
        $comment: 'strip-me',
        color: { $type: 'color', $value: '#ff0000' },
      },
    };
    const result = removeNonTokenProperties(tokens);
    expect(result).toEqual({
      basis: {
        color: { $type: 'color', $value: '#ff0000' },
      },
    });
  });

  it('keeps deeply nested groups intact', () => {
    const tokens = {
      basis: {
        color: {
          'accent-1': {
            50: { $type: 'color', $value: '#f0f4ff' },
          },
        },
      },
    };
    const result = removeNonTokenProperties(tokens);
    expect(result).toEqual(tokens);
  });

  it('keeps $extensions content untouched, including primitive values', () => {
    const tokens = {
      basis: {
        color: {
          'accent-1': {
            $extensions: { 'nl.nldesignsystem.theme-wizard.color-scale-seed-color': '#3366ff' },
            50: { $type: 'color', $value: '#f0f4ff' },
          },
        },
      },
    };
    const result = removeNonTokenProperties(tokens);
    expect(result).toEqual(tokens);
  });

  it('strips non-standard keys from token-like objects nested inside arrays', () => {
    const tokens = {
      group: {
        list: [{ $type: 'color', $value: '#fff', junkMeta: 'strip-me' }],
      },
    };
    const result = removeNonTokenProperties(tokens);
    expect(result).toEqual({
      group: {
        list: [{ $type: 'color', $value: '#fff' }],
      },
    });
  });

  it('recurses into arrays of primitives unchanged', () => {
    const tokens = {
      font: {
        stack: {
          $type: 'fontFamily',
          $value: ['Inter', 'sans-serif'],
        },
      },
    };
    const result = removeNonTokenProperties(tokens);
    expect(result).toEqual(tokens);
  });

  it('does nothing when there is no metadata', () => {
    const tokens = {
      color: {
        red: { $type: 'color', $value: '#ff0000' },
      },
    };
    const result = removeNonTokenProperties(tokens);
    expect(result).toEqual(tokens);
  });

  it('does not mutate the input', () => {
    const tokens = {
      color: {
        red: { $type: 'color', $value: '#ff0000', junk: 'metadata' },
      },
    };
    const result = removeNonTokenProperties(tokens);
    expect(result).not.toBe(tokens);
    expect(tokens.color.red).toHaveProperty('junk');
  });
});
