import {
  EXTENSION_RESOLVED_AS,
  EXTENSION_TOKEN_STAGED,
  EXTENSION_TOKEN_SUBTYPE,
} from '@nl-design-system-community/design-tokens-schema';
import { describe, expect, it } from 'vitest';
import { getOptionsFor, getReferenceOptions } from './reference-options';

const color = (value: string, extensions: Record<string, unknown> = {}) => ({
  $extensions: extensions,
  $type: 'color',
  $value: value,
});

const createTokens = () => ({
  basis: {
    color: {
      'bg-alias': color('{basis.color.bg-default}', {
        [EXTENSION_RESOLVED_AS]: '#fff',
        [EXTENSION_TOKEN_SUBTYPE]: 'background-color',
      }),
      'bg-default': color('#fff', { [EXTENSION_TOKEN_SUBTYPE]: 'background-color' }),
      'color-default': color('#000', { [EXTENSION_TOKEN_SUBTYPE]: 'color' }),
      unstaged: color('#f00', { [EXTENSION_TOKEN_STAGED]: false, [EXTENSION_TOKEN_SUBTYPE]: 'background-color' }),
    },
    size: {
      sm: { $type: 'dimension', $value: { unit: 'px', value: 4 } },
    },
  },
  nl: {
    button: {
      'background-color': color('{basis.color.bg-default}', { [EXTENSION_TOKEN_SUBTYPE]: 'background-color' }),
      color: color('{basis.color.color-default}'),
    },
  },
});

const labels = (options: { label: string }[]) => options.map(({ label }) => label);

describe('getReferenceOptions', () => {
  it('caches options per tokens object', () => {
    const tokens = createTokens();
    expect(getReferenceOptions(tokens)).toBe(getReferenceOptions(tokens));
    expect(getReferenceOptions(createTokens())).not.toBe(getReferenceOptions(tokens));
  });

  it('returns an empty list without basis tokens', () => {
    expect(getReferenceOptions({})).toEqual([]);
  });

  it('turns every basis token into a reference', () => {
    const [first] = getReferenceOptions(createTokens());
    expect(first.label).toBe('basis.color.bg-alias');
    expect(first.value.$value).toBe('{basis.color.bg-alias}');
    expect(first.value.$type).toBe('color');
  });

  it('uses the resolved value of references', () => {
    const options = getReferenceOptions(createTokens());
    const literal = options.find(({ label }) => label === 'basis.color.bg-default');
    const alias = options.find(({ label }) => label === 'basis.color.bg-alias');
    expect(literal?.value.$extensions?.[EXTENSION_RESOLVED_AS]).toBe('#fff');
    expect(alias?.value.$extensions?.[EXTENSION_RESOLVED_AS]).toBe('#fff');
  });
});

describe('getOptionsFor', () => {
  it('only returns options of the same type, excluding unstaged tokens', () => {
    const tokens = createTokens();
    const options = getOptionsFor(tokens, 'nl.button.color', tokens.nl.button.color);
    expect(labels(options)).toEqual(['basis.color.bg-alias', 'basis.color.bg-default', 'basis.color.color-default']);
  });

  it('only returns options of the same subtype, excluding unstaged tokens', () => {
    const tokens = createTokens();
    const options = getOptionsFor(tokens, 'nl.button.background-color', tokens.nl.button['background-color']);
    expect(labels(options)).toEqual(['basis.color.bg-alias', 'basis.color.bg-default']);
  });

  it('excludes the token itself and tokens after it', () => {
    const tokens = createTokens();
    const options = getOptionsFor(tokens, 'basis.color.bg-default', tokens.basis.color['bg-default']);
    expect(labels(options)).toEqual(['basis.color.bg-alias']);
  });
});
