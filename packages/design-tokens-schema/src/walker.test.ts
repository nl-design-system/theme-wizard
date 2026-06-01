import { describe, it, expect, vi } from 'vitest';
import { EXTENSION_TOKEN_SUBTYPE } from './upgrade-legacy-tokens';
import { SKIP, walkObject, walkColors, walkDimensions, walkLineHeights, walkTokens, walkTokensWithRef } from './walker';

describe('walkObject', () => {
  it('calls callback when predicate matches', () => {
    const callback = vi.fn();
    const isString = (v: unknown): v is string => typeof v === 'string';
    walkObject({ a: 'hello' }, isString, callback);
    expect(callback).toHaveBeenCalledWith('hello', ['a']);
  });

  it('passes correct path for nested keys', () => {
    const paths: string[][] = [];
    const isString = (v: unknown): v is string => typeof v === 'string';
    walkObject({ a: { b: { c: 'deep' } } }, isString, (_, path) => {
      paths.push(path);
    });
    expect(paths).toContainEqual(['a', 'b', 'c']);
  });

  it('stops recursing into children when callback returns SKIP', () => {
    let calls = 0;
    const isObject = (v: unknown): v is object => typeof v === 'object' && v !== null;
    const root = { child: { grandchild: 'value' } };
    walkObject(root, isObject, () => {
      calls++;
      return SKIP;
    });
    expect(calls).toBe(1);
  });

  it('recurses into arrays with numeric string paths', () => {
    const found: unknown[] = [];
    const isNumber = (v: unknown): v is number => typeof v === 'number';
    walkObject([1, 2, 3], isNumber, (v) => {
      found.push(v);
    });
    expect(found).toEqual([1, 2, 3]);
  });

  it('does not revisit circular references', () => {
    const callback = vi.fn();
    const isObject = (v: unknown): v is object => typeof v === 'object' && v !== null;
    const obj: Record<string, unknown> = { a: 1 };
    obj['self'] = obj;
    expect(() => walkObject(obj, isObject, callback)).not.toThrow();
  });

  it('calls callback with empty path for root match', () => {
    const callback = vi.fn();
    const isNumber = (v: unknown): v is number => typeof v === 'number';
    walkObject(42, isNumber, callback);
    expect(callback).toHaveBeenCalledWith(42, []);
  });

  it('does nothing when predicate never matches', () => {
    const callback = vi.fn();
    const never = (v: unknown): v is RegExp => v instanceof RegExp;
    walkObject({ a: 1, b: { c: 2 } }, never, callback);
    expect(callback).not.toHaveBeenCalled();
  });

  it('works without a callback', () => {
    const isNumber = (v: unknown): v is number => typeof v === 'number';
    expect(() => walkObject({ a: 1 }, isNumber)).not.toThrow();
  });
});

describe('walkColors', () => {
  const colorToken = {
    $type: 'color',
    $value: { colorSpace: 'srgb', components: [1, 0, 0] },
  };

  it('finds color tokens with object $value', () => {
    const found: unknown[] = [];
    walkColors({ primary: colorToken }, (token) => {
      found.push(token);
    });
    expect(found).toHaveLength(1);
    expect(found[0]).toBe(colorToken);
  });

  it('finds color tokens with ref $value', () => {
    const refToken = { $type: 'color', $value: '{brand.primary}' };
    const found: unknown[] = [];
    walkColors({ primary: refToken }, (token) => {
      found.push(token);
    });
    expect(found).toHaveLength(1);
  });

  it('skips non-color tokens', () => {
    const callback = vi.fn();
    walkColors({ size: { $type: 'dimension', $value: { unit: 'px', value: 4 } } }, callback);
    expect(callback).not.toHaveBeenCalled();
  });

  it('skips tokens missing $type', () => {
    const callback = vi.fn();
    walkColors({ bad: { $value: { colorSpace: 'srgb', components: [1, 0, 0] } } }, callback);
    expect(callback).not.toHaveBeenCalled();
  });

  it('skips tokens with string $value that is not a ref', () => {
    const callback = vi.fn();
    walkColors({ bad: { $type: 'color', $value: '#ff0000' } }, callback);
    expect(callback).not.toHaveBeenCalled();
  });

  it('passes correct path to callback', () => {
    const paths: string[][] = [];
    walkColors({ theme: { primary: colorToken } }, (_, path) => {
      paths.push(path);
    });
    expect(paths).toContainEqual(['theme', 'primary']);
  });

  it('stops recursing when callback returns SKIP', () => {
    let calls = 0;
    walkColors({ primary: colorToken }, () => {
      calls++;
      return SKIP;
    });
    expect(calls).toBe(1);
  });
});

describe('walkDimensions', () => {
  const dimensionToken = { $type: 'dimension', $value: { unit: 'px', value: 16 } };

  it('finds dimension tokens with px unit', () => {
    const found: unknown[] = [];
    walkDimensions({ size: dimensionToken }, (token) => {
      found.push(token);
    });
    expect(found).toHaveLength(1);
  });

  it('finds dimension tokens with rem unit', () => {
    const remToken = { $type: 'dimension', $value: { unit: 'rem', value: 1 } };
    const found: unknown[] = [];
    walkDimensions({ size: remToken }, (token) => {
      found.push(token);
    });
    expect(found).toHaveLength(1);
  });

  it('finds dimension tokens with ref $value', () => {
    const refToken = { $type: 'dimension', $value: '{base.size}' };
    const found: unknown[] = [];
    walkDimensions({ size: refToken }, (token) => {
      found.push(token);
    });
    expect(found).toHaveLength(1);
  });

  it('skips non-dimension tokens', () => {
    const callback = vi.fn();
    walkDimensions({ color: { $type: 'color', $value: { colorSpace: 'srgb', components: [1, 0, 0] } } }, callback);
    expect(callback).not.toHaveBeenCalled();
  });

  it('skips dimension tokens with invalid unit', () => {
    const callback = vi.fn();
    walkDimensions({ size: { $type: 'dimension', $value: { unit: 'em', value: 1 } } }, callback);
    expect(callback).not.toHaveBeenCalled();
  });

  it('passes parsed DimensionToken to callback', () => {
    const found: unknown[] = [];
    walkDimensions({ size: dimensionToken }, (token) => {
      found.push(token);
    });
    expect(found[0]).toMatchObject({ $type: 'dimension', $value: { unit: 'px', value: 16 } });
  });

  it('passes correct path to callback', () => {
    const paths: string[][] = [];
    walkDimensions({ spacing: { md: dimensionToken } }, (_, path) => {
      paths.push(path);
    });
    expect(paths).toContainEqual(['spacing', 'md']);
  });

  it('stops recursing when callback returns SKIP', () => {
    let calls = 0;
    walkDimensions({ size: dimensionToken }, () => {
      calls++;
      return SKIP;
    });
    expect(calls).toBe(1);
  });
});

describe('walkLineHeights', () => {
  const lineHeightToken = {
    $extensions: { [EXTENSION_TOKEN_SUBTYPE]: 'line-height' },
    $type: 'number',
    $value: 1.5,
  };

  it('finds tokens with line-height subtype extension', () => {
    const found: unknown[] = [];
    walkLineHeights({ lh: lineHeightToken }, (token) => {
      found.push(token);
    });
    expect(found).toHaveLength(1);
  });

  it('skips tokens without line-height extension', () => {
    const callback = vi.fn();
    walkLineHeights({ size: { $type: 'dimension', $value: { unit: 'px', value: 16 } } }, callback);
    expect(callback).not.toHaveBeenCalled();
  });

  it('skips tokens with different subtype extension', () => {
    const callback = vi.fn();
    const fontSizeToken = {
      $extensions: { [EXTENSION_TOKEN_SUBTYPE]: 'font-size' },
      $type: 'dimension',
      $value: { unit: 'px', value: 16 },
    };
    walkLineHeights({ fs: fontSizeToken }, callback);
    expect(callback).not.toHaveBeenCalled();
  });

  it('passes correct path to callback', () => {
    const paths: string[][] = [];
    walkLineHeights({ typography: { body: lineHeightToken } }, (_, path) => {
      paths.push(path);
    });
    expect(paths).toContainEqual(['typography', 'body']);
  });

  it('stops recursing when callback returns SKIP', () => {
    let calls = 0;
    walkLineHeights({ lh: lineHeightToken }, () => {
      calls++;
      return SKIP;
    });
    expect(calls).toBe(1);
  });
});

describe('walkTokens', () => {
  it('finds all token-like objects', () => {
    const found: unknown[] = [];
    const root = {
      color: { $type: 'color', $value: { colorSpace: 'srgb', components: [1, 0, 0] } },
      size: { $type: 'dimension', $value: { unit: 'px', value: 16 } },
    };
    walkTokens(root, (token) => {
      found.push(token);
    });
    expect(found).toHaveLength(2);
  });

  it('skips objects missing $type', () => {
    const callback = vi.fn();
    walkTokens({ bad: { $value: 'foo' } }, callback);
    expect(callback).not.toHaveBeenCalled();
  });

  it('skips objects missing $value', () => {
    const callback = vi.fn();
    walkTokens({ bad: { $type: 'color' } }, callback);
    expect(callback).not.toHaveBeenCalled();
  });

  it('skips non-string $type', () => {
    const callback = vi.fn();
    walkTokens({ bad: { $type: 42, $value: 'foo' } }, callback);
    expect(callback).not.toHaveBeenCalled();
  });

  it('passes correct path to callback', () => {
    const paths: string[][] = [];
    const token = { $type: 'number', $value: 1 };
    walkTokens({ a: { b: token } }, (_, path) => {
      paths.push(path);
    });
    expect(paths).toContainEqual(['a', 'b']);
  });

  it('stops recursing into token children when callback returns SKIP', () => {
    let calls = 0;
    const root = { token: { $type: 'number', $value: 1, nested: { $type: 'number', $value: 2 } } };
    walkTokens(root, () => {
      calls++;
      return SKIP;
    });
    expect(calls).toBe(1);
  });

  it("does not recurse into a token's $extensions", () => {
    let calls = 0;
    const root = {
      color: {
        black: {
          $extensions: {
            // Should not recurse into this one
            'link-to-some-other-token': {
              $type: 'color',
              $value: '#ffffff',
            },
          },
          $type: 'color',
          $value: '#000000',
        },
      },
    };
    walkTokens(root, () => {
      calls++;
    });
    expect(calls).toBe(1);
  });
});

describe('walkTokensWithRef', () => {
  const config = {
    brand: {
      primary: { $type: 'color', $value: { colorSpace: 'srgb', components: [1, 0, 0] } },
    },
  };

  const tokenWithRef = { $type: 'color', $value: '{brand.primary}' };

  it('finds tokens whose ref resolves correctly', () => {
    const found: unknown[] = [];
    walkTokensWithRef({ alias: tokenWithRef }, config, (token) => {
      found.push(token);
    });
    expect(found).toHaveLength(1);
  });

  it('skips tokens without ref $value', () => {
    const callback = vi.fn();
    const root = { color: { $type: 'color', $value: { colorSpace: 'srgb', components: [0, 0, 0] } } };
    walkTokensWithRef(root, config, callback);
    expect(callback).not.toHaveBeenCalled();
  });

  it('calls onError when referenced token not found', () => {
    const onError = vi.fn();
    const missing = { $type: 'color', $value: '{does.not.exist}' };
    walkTokensWithRef({ alias: missing }, config, vi.fn(), onError);
    expect(onError).toHaveBeenCalledWith(expect.objectContaining({ code: 'ref_not_found' }));
  });

  it('calls onError when ref points to non-token', () => {
    const onError = vi.fn();
    const badConfig = { group: 'not-a-token' };
    const token = { $type: 'color', $value: '{group}' };
    walkTokensWithRef({ alias: token }, badConfig, vi.fn(), onError);
    expect(onError).toHaveBeenCalledWith(expect.objectContaining({ code: 'ref_not_a_token' }));
  });

  it('calls onError when ref $type does not match', () => {
    const onError = vi.fn();
    const mismatchConfig = {
      base: { $type: 'dimension', $value: { unit: 'px', value: 4 } },
    };
    const token = { $type: 'color', $value: '{base}' };
    walkTokensWithRef({ alias: token }, mismatchConfig, vi.fn(), onError);
    expect(onError).toHaveBeenCalledWith(expect.objectContaining({ code: 'ref_type_mismatch' }));
  });

  it('defaults onError to noop (no throw)', () => {
    const missing = { $type: 'color', $value: '{does.not.exist}' };
    expect(() => walkTokensWithRef({ alias: missing }, config, vi.fn())).not.toThrow();
  });

  it('passes correct path to callback', () => {
    const paths: string[][] = [];
    walkTokensWithRef({ theme: { alias: tokenWithRef } }, config, (_, path) => {
      paths.push(path);
    });
    expect(paths).toContainEqual(['theme', 'alias']);
  });

  it('stops recursing when callback returns SKIP', () => {
    let calls = 0;
    walkTokensWithRef({ alias: tokenWithRef }, config, () => {
      calls++;
      return SKIP;
    });
    expect(calls).toBe(1);
  });
});
