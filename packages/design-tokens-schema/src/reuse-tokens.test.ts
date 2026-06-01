import { describe, expect, it } from 'vitest';
import { applyReusableCandidates, findReusableCandidates, reuseBasisTokens } from './reuse-tokens';
import { EXTENSION_TOKEN_SUBTYPE } from './upgrade-legacy-tokens';

const SUBTYPE = EXTENSION_TOKEN_SUBTYPE;

const createDimensionToken = (value: number, unit: string, subtype: string) => ({
  $extensions: { [SUBTYPE]: subtype },
  $type: 'dimension',
  $value: { unit, value },
});

const basisToken = (value: number, unit: string, subtype: string) => createDimensionToken(value, unit, subtype);

describe('findReusableCandidates', () => {
  it('returns empty when no basis tokens', () => {
    const theme = {
      utrecht: { button: { 'padding-block': createDimensionToken(4, 'px', 'space-block') } },
    };
    expect(findReusableCandidates(theme)).toEqual([]);
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
    expect(findReusableCandidates(theme)).toEqual([]);
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
    expect(findReusableCandidates(theme)).toEqual([]);
  });

  it('returns empty when value does not match any basis token', () => {
    const theme = {
      basis: { space: { block: { xs: basisToken(4, 'px', 'space-block') } } },
      utrecht: { button: { 'padding-block': createDimensionToken(8, 'px', 'space-block') } },
    };
    expect(findReusableCandidates(theme)).toEqual([]);
  });

  it('returns empty when subtype does not match', () => {
    const theme = {
      basis: { space: { block: { xs: basisToken(4, 'px', 'space-block') } } },
      utrecht: { button: { 'padding-inline': createDimensionToken(4, 'px', 'space-inline') } },
    };
    expect(findReusableCandidates(theme)).toEqual([]);
  });

  it('finds a matching component token', () => {
    const basisXs = basisToken(4, 'px', 'space-block');
    const componentToken = createDimensionToken(4, 'px', 'space-block');
    const theme = {
      basis: { space: { block: { xs: basisXs } } },
      utrecht: { button: { 'padding-block': componentToken } },
    };

    const candidates = findReusableCandidates(theme);

    expect(candidates).toHaveLength(1);
    expect(candidates[0]).toMatchObject({
      path: ['utrecht', 'button', 'padding-block'],
      suggestion: {
        path: ['basis', 'space', 'block', 'xs'],
      },
    });
    expect(candidates[0].suggestion.token).toBe(basisXs);
    expect(candidates[0].token).toBe(componentToken);
    expect(candidates[0].token.$value).toEqual(basisXs.$value);
  });

  it('finds multiple component tokens matching the same basis token', () => {
    const theme = {
      basis: { space: { block: { xs: basisToken(4, 'px', 'space-block') } } },
      utrecht: {
        button: { 'padding-block': createDimensionToken(4, 'px', 'space-block') },
        link: { 'padding-block': createDimensionToken(4, 'px', 'space-block') },
      },
    };

    const candidates = findReusableCandidates(theme);
    expect(candidates).toHaveLength(2);
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

    const candidates = findReusableCandidates(theme);
    expect(candidates).toHaveLength(1);
    expect(candidates[0].suggestion.path).toEqual(['basis', 'space', 'block', 'none']);
  });

  it('finds a matching color token', () => {
    const colorValue = { colorSpace: 'srgb', components: [0.2, 0.4, 0.6] };
    const basisColor = { $extensions: { [SUBTYPE]: 'background-color' }, $type: 'color', $value: colorValue };
    const componentColor = { $extensions: { [SUBTYPE]: 'background-color' }, $type: 'color', $value: colorValue };
    const theme = {
      basis: { color: { action: { basisColor } } },
      utrecht: { button: { color: componentColor } },
    };

    const candidates = findReusableCandidates(theme);

    expect(candidates).toHaveLength(1);
    expect(candidates[0].path).toEqual(['utrecht', 'button', 'color']);
    expect(candidates[0].suggestion.path).toEqual(['basis', 'color', 'action', 'basisColor']);
  });

  it('finds a matching font-family token', () => {
    const fontFamilyValue = ['Arial', 'sans-serif'];
    const basisFontFamily = { $type: 'fontFamily', $value: fontFamilyValue };
    const componentFontFamily = { $type: 'fontFamily', $value: fontFamilyValue };
    const theme = {
      basis: { 'font-family': { sans: basisFontFamily } },
      utrecht: { button: { 'font-family': componentFontFamily } },
    };

    const candidates = findReusableCandidates(theme);

    expect(candidates).toHaveLength(1);
    expect(candidates[0].path).toEqual(['utrecht', 'button', 'font-family']);
    expect(candidates[0].suggestion.path).toEqual(['basis', 'font-family', 'sans']);
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

    const candidates = findReusableCandidates(theme);

    expect(candidates).toHaveLength(1);
    expect(candidates[0].suggestion.path).toEqual(['basis', 'space', 'block', 'xs']);
  });

  it('does not return basis tokens themselves as candidates', () => {
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
    expect(findReusableCandidates(theme)).toEqual([]);
  });
});

describe('applyReusableCandidates', () => {
  it('replaces $value with a ref for each candidate', () => {
    const basisXs = basisToken(4, 'px', 'space-block');
    const componentToken = createDimensionToken(4, 'px', 'space-block');
    const theme = {
      basis: { space: { block: { xs: basisXs } } },
      utrecht: { button: { 'padding-block': componentToken } },
    };

    const candidates = findReusableCandidates(theme);
    const result = applyReusableCandidates(theme, candidates);

    expect(result['utrecht']).toMatchObject({
      button: { 'padding-block': { $value: '{basis.space.block.xs}' } },
    });
  });

  it('does not mutate the input', () => {
    const theme = {
      basis: { space: { block: { xs: basisToken(4, 'px', 'space-block') } } },
      utrecht: { button: { 'padding-block': createDimensionToken(4, 'px', 'space-block') } },
    };
    const candidates = findReusableCandidates(theme);
    applyReusableCandidates(theme, candidates);

    expect(theme.utrecht.button['padding-block'].$value).toEqual({ unit: 'px', value: 4 });
  });

  it('returns input unchanged when candidates is empty', () => {
    const theme = { utrecht: { button: { 'padding-block': createDimensionToken(4, 'px', 'space-block') } } };
    const result = applyReusableCandidates(theme, []);
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
