import { describe, expect, it } from 'vitest';
import { applyReusableTokens, findReusableTokens, reuseBasisTokens } from './reuse-tokens';
import { EXTENSION_TOKEN_SUBTYPE } from './upgrade-legacy-tokens';

const SUBTYPE = EXTENSION_TOKEN_SUBTYPE;

const createDimensionToken = (value: number, unit: string, subtype: string) => ({
  $extensions: { [SUBTYPE]: subtype },
  $type: 'dimension',
  $value: { unit, value },
});

const basisToken = (value: number, unit: string, subtype: string) => createDimensionToken(value, unit, subtype);

describe('findReusableTokens', () => {
  it('returns empty when no basis tokens', () => {
    const theme = {
      utrecht: { button: { 'padding-block': createDimensionToken(4, 'px', 'space-block') } },
    };
    expect(findReusableTokens(theme)).toEqual([]);
  });

  it('returns empty when component token is already a ref', () => {
    const theme = {
      basis: { space: { block: { xs: basisToken(4, 'px', 'space-block') } } },
      utrecht: {
        button: {
          'padding-block': {
            $extensions: { [SUBTYPE]: 'space-block' },
            $type: 'dimension',
            $value: '{basis.space.block.xs}',
          },
        },
      },
    };
    expect(findReusableTokens(theme)).toEqual([]);
  });

  it('returns empty when component token has no subtype', () => {
    const theme = {
      basis: { space: { block: { xs: basisToken(4, 'px', 'space-block') } } },
      utrecht: {
        button: {
          'padding-block': { $type: 'dimension', $value: { unit: 'px', value: 4 } },
        },
      },
    };
    expect(findReusableTokens(theme)).toEqual([]);
  });

  it('returns empty when value does not match any basis token', () => {
    const theme = {
      basis: { space: { block: { xs: basisToken(4, 'px', 'space-block') } } },
      utrecht: { button: { 'padding-block': createDimensionToken(8, 'px', 'space-block') } },
    };
    expect(findReusableTokens(theme)).toEqual([]);
  });

  it('returns empty when subtype does not match', () => {
    const theme = {
      basis: { space: { block: { xs: basisToken(4, 'px', 'space-block') } } },
      utrecht: { button: { 'padding-inline': createDimensionToken(4, 'px', 'space-inline') } },
    };
    expect(findReusableTokens(theme)).toEqual([]);
  });

  it('finds a matching component token', () => {
    const basisXs = basisToken(4, 'px', 'space-block');
    const componentToken = createDimensionToken(4, 'px', 'space-block');
    const theme = {
      basis: { space: { block: { xs: basisXs } } },
      utrecht: { button: { 'padding-block': componentToken } },
    };

    const Tokens = findReusableTokens(theme);

    expect(Tokens).toHaveLength(1);
    expect(Tokens[0]).toMatchObject({
      path: ['utrecht', 'button', 'padding-block'],
      suggestion: {
        path: ['basis', 'space', 'block', 'xs'],
      },
    });
    expect(Tokens[0].suggestion.token).toBe(basisXs);
    expect(Tokens[0].token).toBe(componentToken);
    expect(Tokens[0].token.$value).toEqual(basisXs.$value);
  });

  it('finds multiple component tokens matching the same basis token', () => {
    const theme = {
      basis: { space: { block: { xs: basisToken(4, 'px', 'space-block') } } },
      utrecht: {
        button: { 'padding-block': createDimensionToken(4, 'px', 'space-block') },
        link: { 'padding-block': createDimensionToken(4, 'px', 'space-block') },
      },
    };

    const Tokens = findReusableTokens(theme);
    expect(Tokens).toHaveLength(2);
  });

  it('returns first basis token when multiple basis tokens share same subtype+value', () => {
    const theme = {
      basis: {
        space: {
          block: {
            none: basisToken(0, 'px', 'border-radius'),
            xs: basisToken(0, 'px', 'border-radius'),
          },
        },
      },
      utrecht: { button: { 'border-radius': createDimensionToken(0, 'px', 'border-radius') } },
    };

    const Tokens = findReusableTokens(theme);
    expect(Tokens).toHaveLength(1);
    expect(Tokens[0].suggestion.path).toEqual(['basis', 'space', 'block', 'none']);
  });

  it('finds a matching color token', () => {
    const colorValue = { colorSpace: 'srgb', components: [0.2, 0.4, 0.6] };
    const basisColor = { $extensions: { [SUBTYPE]: 'background-color' }, $type: 'color', $value: colorValue };
    const componentColor = { $extensions: { [SUBTYPE]: 'background-color' }, $type: 'color', $value: colorValue };
    const theme = {
      basis: { color: { action: { basisColor } } },
      utrecht: { button: { color: componentColor } },
    };

    const Tokens = findReusableTokens(theme);

    expect(Tokens).toHaveLength(1);
    expect(Tokens[0].path).toEqual(['utrecht', 'button', 'color']);
    expect(Tokens[0].suggestion.path).toEqual(['basis', 'color', 'action', 'basisColor']);
  });

  it('finds a matching font-family token', () => {
    const fontFamilyValue = ['Arial', 'sans-serif'];
    const basisFontFamily = { $type: 'fontFamily', $value: fontFamilyValue };
    const componentFontFamily = { $type: 'fontFamily', $value: fontFamilyValue };
    const theme = {
      basis: { 'font-family': { sans: basisFontFamily } },
      utrecht: { button: { 'font-family': componentFontFamily } },
    };

    const Tokens = findReusableTokens(theme);

    expect(Tokens).toHaveLength(1);
    expect(Tokens[0].path).toEqual(['utrecht', 'button', 'font-family']);
    expect(Tokens[0].suggestion.path).toEqual(['basis', 'font-family', 'sans']);
  });

  it('ignores basis tokens whose $value is a ref', () => {
    const theme = {
      basis: {
        space: {
          block: {
            alias: { $extensions: { [SUBTYPE]: 'space-block' }, $type: 'dimension', $value: '{basis.space.block.xs}' },
            xs: basisToken(4, 'px', 'space-block'),
          },
        },
      },
      utrecht: { button: { 'padding-block': createDimensionToken(4, 'px', 'space-block') } },
    };

    const Tokens = findReusableTokens(theme);

    expect(Tokens).toHaveLength(1);
    expect(Tokens[0].suggestion.path).toEqual(['basis', 'space', 'block', 'xs']);
  });

  it('does not return basis tokens themselves as Tokens', () => {
    const theme = {
      basis: {
        space: {
          block: {
            sm: basisToken(4, 'px', 'space-block'),
            xs: basisToken(4, 'px', 'space-block'),
          },
        },
      },
    };
    expect(findReusableTokens(theme)).toEqual([]);
  });
});

describe('applyReusableTokens', () => {
  it('replaces $value with a ref for each candidate', () => {
    const basisXs = basisToken(4, 'px', 'space-block');
    const componentToken = createDimensionToken(4, 'px', 'space-block');
    const theme = {
      basis: { space: { block: { xs: basisXs } } },
      utrecht: { button: { 'padding-block': componentToken } },
    };

    const Tokens = findReusableTokens(theme);
    const result = applyReusableTokens(theme, Tokens);

    expect(result['utrecht']).toMatchObject({
      button: { 'padding-block': { $value: '{basis.space.block.xs}' } },
    });
  });

  it('does not mutate the input', () => {
    const theme = {
      basis: { space: { block: { xs: basisToken(4, 'px', 'space-block') } } },
      utrecht: { button: { 'padding-block': createDimensionToken(4, 'px', 'space-block') } },
    };
    const Tokens = findReusableTokens(theme);
    applyReusableTokens(theme, Tokens);

    expect(theme.utrecht.button['padding-block'].$value).toEqual({ unit: 'px', value: 4 });
  });

  it('returns input unchanged when Tokens is empty', () => {
    const theme = { utrecht: { button: { 'padding-block': createDimensionToken(4, 'px', 'space-block') } } };
    const result = applyReusableTokens(theme, []);
    expect(result).toEqual(theme);
  });

  it('skips candidates with __proto__ in path without partial mutation', () => {
    const basis = basisToken(4, 'px', 'space-block');
    const theme = { basis: { space: { xs: basis } } };
    // dset breaks on __proto__ but still creates the ancestor key before breaking;
    // our guard must prevent even that partial write.
    const result = applyReusableTokens(theme, [
      {
        path: ['newKey', '__proto__'] as string[],
        suggestion: { path: ['basis', 'space', 'xs'], token: basis },
        token: basisToken(4, 'px', 'space-block'),
      },
    ]);
    expect(result).toEqual(theme);
  });

  it('skips candidates with constructor in path without partial mutation', () => {
    const basis = basisToken(4, 'px', 'space-block');
    const theme = { basis: { space: { xs: basis } } };
    const result = applyReusableTokens(theme, [
      {
        path: ['newKey', 'constructor'] as string[],
        suggestion: { path: ['basis', 'space', 'xs'], token: basis },
        token: basisToken(4, 'px', 'space-block'),
      },
    ]);
    expect(result).toEqual(theme);
  });
});

describe('reuseBasisTokens', () => {
  it('returns input unchanged when no matches exist', () => {
    const theme = {
      basis: { space: { block: { xs: basisToken(4, 'px', 'space-block') } } },
      utrecht: { button: { 'padding-block': createDimensionToken(8, 'px', 'space-block') } },
    };

    expect(reuseBasisTokens(theme)).toEqual(theme);
  });

  it('replaces hardcoded values with basis refs end-to-end', () => {
    const theme = {
      basis: { space: { block: { xs: basisToken(4, 'px', 'space-block') } } },
      utrecht: { button: { 'padding-block': createDimensionToken(4, 'px', 'space-block') } },
    };

    const result = reuseBasisTokens(theme);

    expect(result['utrecht']).toMatchObject({
      button: { 'padding-block': { $value: '{basis.space.block.xs}' } },
    });
  });
});
