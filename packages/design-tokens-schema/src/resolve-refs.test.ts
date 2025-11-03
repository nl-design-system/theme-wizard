import { describe, expect, it } from 'vitest';
import { resolveRefs } from './resolve-refs';

describe('resolve-refs', () => {
  it('resolveRefs: leaves literal $value strings unchanged when not a token reference', () => {
    const config = {
      a: { $type: 'color', $value: 'plain-string' },
    };

    const before = JSON.stringify(config);
    resolveRefs(config, { tokens: { any: { $type: 'color', $value: '#fff' } } });
    const after = JSON.stringify(config);

    expect(after).toBe(before);
  });

  it('resolveRefs: preserves original $value when reference resolves without a $value', () => {
    const config = {
      a: { $type: 'color', $value: '{root.token}' },
    };

    const root = {
      root: {
        token: { $type: 'color' }, // intentionally missing $value
      },
    };

    resolveRefs(config, root);
    expect(config.a.$value).toBe('{root.token}');
  });
});
