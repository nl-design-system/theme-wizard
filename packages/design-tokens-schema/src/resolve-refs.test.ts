import { it, describe, expect, vi } from 'vitest';
import { EXTENSION_RESOLVED_AS, EXTENSION_RESOLVED_FROM, resolveRef, resolveRefs, validateRefs } from './resolve-refs';

describe('constants', () => {
  it('EXTENSION_RESOLVED_FROM', () => {
    expect(EXTENSION_RESOLVED_FROM).toBe('nl.nldesignsystem.value-resolved-from');
  });

  it('EXTENSION_RESOLVED_AS', () => {
    expect(EXTENSION_RESOLVED_AS).toBe('nl.nldesignsystem.value-resolved-as');
  });
});

describe('resolveRef', () => {
  it('resolves a token reference at top-level path', () => {
    const root = {
      color: { primary: { $type: 'color', $value: '#ff0000' } },
    };
    expect(resolveRef(root, '{color.primary}')).toEqual(root.color.primary);
  });

  it('falls back to brand. prefix when not found at top level', () => {
    const root = {
      brand: {
        color: { primary: { $type: 'color', $value: '#0000ff' } },
      },
    };
    expect(resolveRef(root, '{color.primary}')).toEqual(root.brand.color.primary);
  });

  it('recursively resolves when resolved token $value is itself a ref', () => {
    const root = {
      color: {
        alias: { $type: 'color', $value: '{color.base}' },
        base: { $type: 'color', $value: '#00ff00' },
      },
    };
    expect(resolveRef(root, '{color.alias}')).toEqual(root.color.base);
  });

  it('returns token as-is when its $value is a non-ref string', () => {
    const root = {
      color: { base: { $type: 'color', $value: '#aabbcc' } },
    };
    expect(resolveRef(root, '{color.base}')).toEqual(root.color.base);
  });

  it('returns undefined when resolved value is not a token', () => {
    const root = {
      color: { raw: 'not-a-token' },
    };
    expect(resolveRef(root, '{color.raw}')).toBeUndefined();
  });

  it('returns undefined when ref not found', () => {
    expect(resolveRef({}, '{nonexistent.token}')).toBeUndefined();
  });

  it('returns undefined on direct self-reference (circular)', () => {
    const root = {
      color: { a: { $type: 'color', $value: '{color.a}' } },
    };
    expect(resolveRef(root, '{color.a}')).toBeUndefined();
  });

  it('returns undefined on two-token cycle (a → b → a)', () => {
    const root = {
      color: {
        a: { $type: 'color', $value: '{color.b}' },
        b: { $type: 'color', $value: '{color.a}' },
      },
    };
    expect(resolveRef(root, '{color.a}')).toBeUndefined();
  });

  it('returns undefined on longer cycle (a → b → c → a)', () => {
    const root = {
      color: {
        a: { $type: 'color', $value: '{color.b}' },
        b: { $type: 'color', $value: '{color.c}' },
        c: { $type: 'color', $value: '{color.a}' },
      },
    };
    expect(resolveRef(root, '{color.a}')).toBeUndefined();
  });
});

describe('resolveRefs', () => {
  it('sets EXTENSION_RESOLVED_AS on token with valid ref', () => {
    const root = {
      color: { base: { $type: 'color', $value: '#ff0000' } },
    };
    const config = {
      primary: { $type: 'color', $value: '{color.base}' },
    };
    resolveRefs(config, root);
    expect((config.primary as Record<string, unknown>)['$extensions']).toEqual({
      [EXTENSION_RESOLVED_AS]: '#ff0000',
    });
  });

  it('resolves refs in deeply nested tokens', () => {
    const root = {
      color: { base: { $type: 'color', $value: '#aabbcc' } },
    };
    const config = {
      level1: {
        level2: { token: { $type: 'color', $value: '{color.base}' } },
      },
    };
    resolveRefs(config, root);
    expect((config.level1.level2.token as Record<string, unknown>)['$extensions']).toEqual({
      [EXTENSION_RESOLVED_AS]: '#aabbcc',
    });
  });

  it('does not set extension when ref is not found', () => {
    const config = {
      token: { $type: 'color', $value: '{nonexistent.token}' },
    };
    resolveRefs(config, {});
    expect((config.token as Record<string, unknown>)['$extensions']).toBeUndefined();
  });

  it('does not set extension when resolved value is not token-like', () => {
    const root = { color: { raw: 'not-a-token' } };
    const config = {
      token: { $type: 'color', $value: '{color.raw}' },
    };
    resolveRefs(config, root);
    expect((config.token as Record<string, unknown>)['$extensions']).toBeUndefined();
  });

  it('clears previous resolved value when called multiple times', () => {
    const config = {
      primary: { $type: 'color', $value: '{color.base}' },
    };
    resolveRefs(config, { color: { base: { $type: 'color', $value: '#ff0000' } } });
    resolveRefs(config, { color: { base: { $type: 'color', $value: '#0000ff' } } });
    expect((config.primary as Record<string, unknown>)['$extensions']).toEqual({
      [EXTENSION_RESOLVED_AS]: '#0000ff',
    });
  });
});

describe('validateRefs', () => {
  it('calls onError with ref_not_found when ref does not exist', () => {
    const config = { token: { $type: 'color', $value: '{nonexistent.color}' } };
    const onError = vi.fn();
    validateRefs(config, {}, onError);
    expect(onError).toHaveBeenCalledWith(expect.objectContaining({ code: 'ref_not_found' }));
  });

  it('calls onError with ref_not_a_token when target is not a token', () => {
    const root = { color: { primary: 'not-a-token' } };
    const config = { token: { $type: 'color', $value: '{color.primary}' } };
    const onError = vi.fn();
    validateRefs(config, root, onError);
    expect(onError).toHaveBeenCalledWith(expect.objectContaining({ code: 'ref_not_a_token' }));
  });

  it('calls onError with ref_type_mismatch when $type does not match', () => {
    const root = { color: { primary: { $type: 'dimension', $value: '16px' } } };
    const config = { token: { $type: 'color', $value: '{color.primary}' } };
    const onError = vi.fn();
    validateRefs(config, root, onError);
    expect(onError).toHaveBeenCalledWith(expect.objectContaining({ code: 'ref_type_mismatch' }));
  });

  it('does not call onError when ref is valid', () => {
    const root = { color: { base: { $type: 'color', $value: '#ff0000' } } };
    const config = { token: { $type: 'color', $value: '{color.base}' } };
    const onError = vi.fn();
    validateRefs(config, root, onError);
    expect(onError).not.toHaveBeenCalled();
  });

  it('works without providing onError (default no-op)', () => {
    const config = { token: { $type: 'color', $value: '{nonexistent.color}' } };
    expect(() => validateRefs(config, {})).not.toThrow();
  });
});
