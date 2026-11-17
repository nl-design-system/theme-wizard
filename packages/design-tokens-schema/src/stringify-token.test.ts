import { describe, expect, it } from 'vitest';
import { stringifyToken } from './stringify-token';

describe('color token', () => {
  it('returns hex string for sRGB color', () => {
    const token = {
      $type: 'color',
      $value: { colorSpace: 'srgb', components: [1, 0, 0] as [number, number, number] },
    };
    expect(stringifyToken(token)).toBe('#ff0000');
  });

  it('returns hex string for color with alpha', () => {
    const token = {
      $type: 'color',
      $value: { alpha: 0.5, colorSpace: 'srgb', components: [0, 0, 1] as [number, number, number] },
    };
    const result = stringifyToken(token);
    expect(result).toMatch(/^#[0-9a-f]{6,8}$/i);
  });
});

describe('dimension token', () => {
  it('returns value with px unit', () => {
    const token = {
      $type: 'dimension',
      $value: { unit: 'px', value: 16 },
    };
    expect(stringifyToken(token)).toBe('16px');
  });

  it('returns value with rem unit', () => {
    const token = {
      $type: 'dimension',
      $value: { unit: 'rem', value: 1.5 },
    };
    expect(stringifyToken(token)).toBe('1.5rem');
  });

  it('falls back to JSON.stringify for invalid dimension value', () => {
    const token = {
      $type: 'dimension',
      $value: 'invalid-dimension',
    };
    expect(stringifyToken(token)).toBe('"invalid-dimension"');
  });
});

describe('fontFamily token', () => {
  it('returns single font name as-is', () => {
    const token = {
      $type: 'fontFamily',
      $value: ['Roboto'],
    };
    expect(stringifyToken(token)).toBe('"Roboto"');
  });

  it('returns generic font name without quotes', () => {
    const token = {
      $type: 'fontFamily',
      $value: ['sans-serif'],
    };
    expect(stringifyToken(token)).toBe('sans-serif');
  });

  it('returns named font quoted and generic unquoted in multi-font array', () => {
    const token = {
      $type: 'fontFamily',
      $value: ['Roboto', 'sans-serif'],
    };
    expect(stringifyToken(token)).toBe('"Roboto",sans-serif');
  });

  it('falls back to JSON.stringify for invalid fontFamily value', () => {
    const token = {
      $type: 'fontFamily',
      $value: 'bad,value',
    };
    expect(stringifyToken(token)).toBe('"bad,value"');
  });
});

describe('number token', () => {
  it('stringifies integer', () => {
    const token = { $type: 'number', $value: 42 };
    expect(stringifyToken(token)).toBe('42');
  });

  it('stringifies float', () => {
    const token = { $type: 'number', $value: 1.5 };
    expect(stringifyToken(token)).toBe('1.5');
  });

  it('falls back to JSON.stringify for non-finite number', () => {
    const token = { $type: 'number', $value: Infinity };
    expect(stringifyToken(token)).toBe('null');
  });
});

describe('unknown / fallback', () => {
  it('JSON.stringifies string value', () => {
    const token = { $type: 'unknown', $value: 'some-value' };
    expect(stringifyToken(token)).toBe('"some-value"');
  });

  it('JSON.stringifies object value', () => {
    const token = { $type: 'unknown', $value: { foo: 'bar' } };
    expect(stringifyToken(token)).toBe('{"foo":"bar"}');
  });
});

describe('duration token', () => {
  it('returns value with ms unit', () => {
    const token = { $type: 'duration', $value: { unit: 'ms', value: 200 } };
    expect(stringifyToken(token)).toBe('200ms');
  });

  it('returns value with s unit', () => {
    const token = { $type: 'duration', $value: { unit: 's', value: 1.5 } };
    expect(stringifyToken(token)).toBe('1.5s');
  });

  it('falls back to JSON.stringify for invalid duration value', () => {
    const token = { $type: 'duration', $value: '200ms' };
    expect(stringifyToken(token)).toBe('"200ms"');
  });
});

describe('shadow token', () => {
  const shadow = {
    blur: { unit: 'px', value: 4 },
    color: { colorSpace: 'srgb', components: [0, 0, 0] as [number, number, number] },
    offsetX: { unit: 'px', value: 0 },
    offsetY: { unit: 'px', value: 2 },
    spread: { unit: 'px', value: 0 },
  };

  it('returns box-shadow for a single shadow', () => {
    const token = { $type: 'shadow', $value: shadow };
    expect(stringifyToken(token)).toBe('0px 2px 4px 0px #000000');
  });

  it('returns comma-separated box-shadow for multiple shadows', () => {
    const token = { $type: 'shadow', $value: [shadow, { ...shadow, inset: true }] };
    expect(stringifyToken(token)).toBe('0px 2px 4px 0px #000000, inset 0px 2px 4px 0px #000000');
  });

  it('falls back to JSON.stringify for shadow containing a reference', () => {
    const token = { $type: 'shadow', $value: { ...shadow, blur: '{basis.size.sm}' } };
    expect(stringifyToken(token)).toBe(JSON.stringify(token.$value));
  });
});
