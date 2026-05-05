import assert from 'node:assert/strict';
import { describe, it } from 'vitest';
import type { TokenFile } from './types.js';
import { parseDimension, parseFontFamily, upgradeTokens } from './upgrade.js';

// ---------------------------------------------------------------------------
// parseDimension
// ---------------------------------------------------------------------------

describe('parseDimension', () => {
  it('parses rem', () => assert.deepEqual(parseDimension('1.5rem'), { unit: 'rem', value: 1.5 }));
  it('parses px', () => assert.deepEqual(parseDimension('16px'), { unit: 'px', value: 16 }));
  it('parses negative px', () => assert.deepEqual(parseDimension('-4px'), { unit: 'px', value: -4 }));
  it('parses em', () => assert.deepEqual(parseDimension('2em'), { unit: 'em', value: 2 }));
  it('parses percentage', () => assert.deepEqual(parseDimension('50%'), { unit: '%', value: 50 }));
  it('parses fractional rem', () => assert.deepEqual(parseDimension('1.25rem'), { unit: 'rem', value: 1.25 }));
  it('parses unitless number as empty-unit dimension', () =>
    assert.deepEqual(parseDimension('42'), { unit: '', value: 42 }));
  it('returns null for calc()', () => assert.equal(parseDimension('calc(100% - 8px)'), null));
  it('parses unitless zero as empty-unit dimension', () =>
    assert.deepEqual(parseDimension('0'), { unit: '', value: 0 }));
  it('parses empty string as zero with empty unit', () => assert.deepEqual(parseDimension(''), { unit: '', value: 0 }));
});

// ---------------------------------------------------------------------------
// parseFontFamily
// ---------------------------------------------------------------------------

describe('parseFontFamily', () => {
  it('splits comma-separated families', () =>
    assert.deepEqual(parseFontFamily('Inter, sans-serif'), ['Inter', 'sans-serif']));
  it('strips double quotes', () =>
    assert.deepEqual(parseFontFamily('"Helvetica Neue", Arial'), ['Helvetica Neue', 'Arial']));
  it('strips single quotes', () =>
    assert.deepEqual(parseFontFamily("'Times New Roman', serif"), ['Times New Roman', 'serif']));
  it('handles single family without comma', () => assert.deepEqual(parseFontFamily('Inter'), ['Inter']));
  it('trims surrounding whitespace', () =>
    assert.deepEqual(parseFontFamily('  Inter ,  sans-serif  '), ['Inter', 'sans-serif']));
});

// ---------------------------------------------------------------------------
// upgradeTokens — type upgrades
// ---------------------------------------------------------------------------

describe('upgradeTokens – type upgrade', () => {
  it('upgrades legacy value → $value', () => {
    const legacy = { token: { type: 'spacing', value: '8px' } } as unknown as TokenFile;
    const token = upgradeTokens(legacy)['token'] as { $value: unknown; $type: string };
    assert.deepEqual(token.$value, { unit: 'px', value: 8 });
    assert.equal(token.$type, 'dimension');
  });

  it('remaps spacing → dimension', () => {
    const legacy = { token: { type: 'spacing', value: '8px' } } as unknown as TokenFile;
    assert.equal((upgradeTokens(legacy)['token'] as { $type: string }).$type, 'dimension');
  });

  it('remaps fontSize → dimension', () => {
    const legacy = { token: { type: 'fontSize', value: '1.5rem' } } as unknown as TokenFile;
    assert.equal((upgradeTokens(legacy)['token'] as { $type: string }).$type, 'dimension');
  });

  it('remaps fontWeights → fontWeight', () => {
    const legacy = { token: { type: 'fontWeights', value: '700' } } as unknown as TokenFile;
    assert.equal((upgradeTokens(legacy)['token'] as { $type: string }).$type, 'fontWeight');
  });

  it('remaps fontFamilies → fontFamily', () => {
    const legacy = { token: { type: 'fontFamilies', value: 'Inter' } } as unknown as TokenFile;
    assert.equal((upgradeTokens(legacy)['token'] as { $type: string }).$type, 'fontFamily');
  });

  it('maps comment → $description', () => {
    const legacy = { token: { comment: 'Brand red', type: 'color', value: '#f00' } } as unknown as TokenFile;
    assert.equal((upgradeTokens(legacy)['token'] as { $description: string }).$description, 'Brand red');
  });

  it('prefers description over comment', () => {
    const legacy = {
      token: { comment: 'old', description: 'new', type: 'color', value: '#f00' },
    } as unknown as TokenFile;
    assert.equal((upgradeTokens(legacy)['token'] as { $description: string }).$description, 'new');
  });

  it('maps $comment → $description on a token', () => {
    const legacy = { token: { $comment: 'Brand red', type: 'color', value: '#f00' } } as unknown as TokenFile;
    const token = upgradeTokens(legacy)['token'] as Record<string, unknown>;
    assert.equal(token['$description'], 'Brand red');
    assert.equal(token['$comment'], undefined);
  });

  it('prefers $description over $comment on a token', () => {
    const legacy = {
      token: { $comment: 'old', $description: 'new', type: 'color', value: '#f00' },
    } as unknown as TokenFile;
    assert.equal((upgradeTokens(legacy)['token'] as Record<string, unknown>)['$description'], 'new');
  });

  it('maps $comment → $description on a group', () => {
    const input = {
      colors: { $comment: 'Color group', token: { $type: 'color', $value: '#f00' } },
    } as unknown as TokenFile;
    const group = upgradeTokens(input)['colors'] as Record<string, unknown>;
    assert.equal(group['$description'], 'Color group');
    assert.equal(group['$comment'], undefined);
  });

  it('strips SD metadata keys', () => {
    const sd = {
      token: {
        name: 't',
        $type: 'color',
        $value: '#f00',
        attributes: {},
        filePath: 'tokens.json',
        isSource: true,
        original: {},
        path: ['t'],
      },
    } as unknown as TokenFile;
    const token = upgradeTokens(sd).token as Record<string, unknown>;
    for (const key of ['filePath', 'isSource', 'name', 'attributes', 'path', 'original']) {
      assert.equal(token[key], undefined, `${key} should be stripped`);
    }
  });

  it('preserves $extensions', () => {
    const input = {
      token: {
        name: 'n',
        $extensions: { 'studio.tokens': { originalType: 'color' } },
        $type: 'color',
        $value: '#f00',
        attributes: {},
        filePath: 'x',
        isSource: true,
        original: {},
        path: [],
      },
    } as unknown as TokenFile;
    assert.deepEqual((upgradeTokens(input)['token'] as { $extensions: unknown }).$extensions, {
      'nl.nldesignsystem.authored-as': '#f00',
      'studio.tokens': { originalType: 'color' },
    });
  });
});

// ---------------------------------------------------------------------------
// upgradeTokens — value upgrades
// ---------------------------------------------------------------------------

describe('upgradeTokens – value upgrade: dimension', () => {
  it('parses rem string into { value, unit } object', () => {
    const legacy = { token: { type: 'fontSize', value: '1.5rem' } } as unknown as TokenFile;
    assert.deepEqual((upgradeTokens(legacy)['token'] as { $value: unknown }).$value, { unit: 'rem', value: 1.5 });
  });

  it('parses px string', () => {
    const legacy = { token: { type: 'spacing', value: '8px' } } as unknown as TokenFile;
    assert.deepEqual((upgradeTokens(legacy)['token'] as { $value: unknown }).$value, { unit: 'px', value: 8 });
  });

  it('falls back to string for calc()', () => {
    const legacy = { token: { type: 'spacing', value: 'calc(100% - 8px)' } } as unknown as TokenFile;
    assert.equal((upgradeTokens(legacy)['token'] as { $value: unknown }).$value, 'calc(100% - 8px)');
  });

  it('keeps already-object $value unchanged', () => {
    const modern: TokenFile = { token: { $type: 'dimension', $value: { unit: 'px', value: 8 } } };
    assert.deepEqual((upgradeTokens(modern).token as { $value: unknown }).$value, { unit: 'px', value: 8 });
  });
});

describe('upgradeTokens – value upgrade: fontFamily', () => {
  it('splits comma string into array', () => {
    const legacy = { token: { type: 'fontFamily', value: 'Inter, sans-serif' } } as unknown as TokenFile;
    assert.deepEqual((upgradeTokens(legacy)['token'] as { $value: unknown }).$value, ['Inter', 'sans-serif']);
  });

  it('strips quotes from family names', () => {
    const legacy = { token: { type: 'fontFamilies', value: '"Helvetica Neue", Arial' } } as unknown as TokenFile;
    assert.deepEqual((upgradeTokens(legacy)['token'] as { $value: unknown }).$value, ['Helvetica Neue', 'Arial']);
  });

  it('keeps already-array $value unchanged', () => {
    const modern: TokenFile = { token: { $type: 'fontFamily', $value: ['Inter', 'sans-serif'] } };
    assert.deepEqual((upgradeTokens(modern).token as { $value: unknown }).$value, ['Inter', 'sans-serif']);
  });
});

describe('upgradeTokens – value upgrade: color', () => {
  it('converts hex string to color object with hex fallback', () => {
    const legacy = { token: { type: 'color', value: '#ff0000' } } as unknown as TokenFile;
    const result = (upgradeTokens(legacy)['token'] as { $value: unknown }).$value as Record<string, unknown>;
    assert.equal(result['colorSpace'], 'srgb');
    assert.deepEqual(result['components'], [1, 0, 0]);
    assert.equal(result['alpha'], 1);
    assert.equal(typeof result['hex'], 'string');
  });

  it('converts rgba string to color object with hex fallback', () => {
    const legacy = { token: { type: 'color', value: 'rgba(0, 0, 0, 0)' } } as unknown as TokenFile;
    const result = (upgradeTokens(legacy)['token'] as { $value: unknown }).$value as Record<string, unknown>;
    assert.equal(result['colorSpace'], 'srgb');
    assert.equal(result['alpha'], 0);
    assert.equal(typeof result['hex'], 'string');
  });

  it('leaves unparseable color values as-is', () => {
    const legacy = { token: { type: 'color', value: 'not-a-color' } } as unknown as TokenFile;
    const result = (upgradeTokens(legacy)['token'] as { $value: unknown }).$value;
    assert.equal(result, 'not-a-color');
  });

  it('leaves alias references unchanged', () => {
    const legacy = { token: { $type: 'color', $value: '{color.brand.primary}' } } as unknown as TokenFile;
    const result = (upgradeTokens(legacy)['token'] as { $value: unknown }).$value;
    assert.equal(result, '{color.brand.primary}');
  });
});

describe('upgradeTokens – value upgrade: lineHeight', () => {
  it('converts bare number string to number type + float value', () => {
    const legacy = { token: { type: 'lineHeight', value: '1.5' } } as unknown as TokenFile;
    const token = upgradeTokens(legacy)['token'] as { $type: string; $value: unknown };
    assert.equal(token.$type, 'number');
    assert.equal(token.$value, 1.5);
  });

  it('keeps already-number value as number type', () => {
    const legacy = { token: { type: 'lineHeight', value: 1.25 } } as unknown as TokenFile;
    const token = upgradeTokens(legacy)['token'] as { $type: string; $value: unknown };
    assert.equal(token.$type, 'number');
    assert.equal(token.$value, 1.25);
  });

  it('converts percentage string to number type + ratio', () => {
    const legacy = { token: { type: 'lineHeight', value: '150%' } } as unknown as TokenFile;
    const token = upgradeTokens(legacy)['token'] as { $type: string; $value: unknown };
    assert.equal(token.$type, 'number');
    assert.equal(token.$value, 1.5);
  });

  it('converts CSS unit string to dimension type + object', () => {
    const legacy = { token: { type: 'lineHeight', value: '24px' } } as unknown as TokenFile;
    const token = upgradeTokens(legacy)['token'] as { $type: string; $value: unknown };
    assert.equal(token.$type, 'dimension');
    assert.deepEqual(token.$value, { unit: 'px', value: 24 });
  });

  it('handles lineHeights alias', () => {
    const legacy = { token: { type: 'lineHeights', value: '1.5' } } as unknown as TokenFile;
    const token = upgradeTokens(legacy)['token'] as { $type: string; $value: unknown };
    assert.equal(token.$type, 'number');
    assert.equal(token.$value, 1.5);
  });
});

describe('upgradeTokens – value upgrade: fontWeight', () => {
  it('converts named weight "bold" to 700', () => {
    const legacy = { token: { type: 'fontWeight', value: 'bold' } } as unknown as TokenFile;
    const token = upgradeTokens(legacy)['token'] as { $type: string; $value: unknown };
    assert.equal(token.$type, 'fontWeight');
    assert.equal(token.$value, 700);
  });

  it('converts named weight "regular" to 400', () => {
    const legacy = { token: { type: 'fontWeights', value: 'regular' } } as unknown as TokenFile;
    assert.equal((upgradeTokens(legacy)['token'] as { $value: unknown }).$value, 400);
  });

  it('keeps numeric value unchanged', () => {
    const legacy = { token: { type: 'fontWeight', value: 700 } } as unknown as TokenFile;
    assert.equal((upgradeTokens(legacy)['token'] as { $value: unknown }).$value, 700);
  });

  it('converts numeric string to number', () => {
    const legacy = { token: { type: 'fontWeights', value: '700' } } as unknown as TokenFile;
    assert.equal((upgradeTokens(legacy)['token'] as { $value: unknown }).$value, 700);
  });

  it('leaves unrecognized string as-is', () => {
    const legacy = { token: { type: 'fontWeight', value: 'unknown-weight' } } as unknown as TokenFile;
    assert.equal((upgradeTokens(legacy)['token'] as { $value: unknown }).$value, 'unknown-weight');
  });
});

// ---------------------------------------------------------------------------
// upgradeTokens — nl.nldesignsystem.authored-as extension
// ---------------------------------------------------------------------------

describe('upgradeTokens – authored-as extension', () => {
  it('records original string on a transformed dimension', () => {
    const legacy = { token: { type: 'spacing', value: '8px' } } as unknown as TokenFile;
    const ext = (upgradeTokens(legacy)['token'] as { $extensions: Record<string, unknown> }).$extensions;
    assert.equal(ext['nl.nldesignsystem.authored-as'], '8px');
  });

  it('records original string on a transformed color', () => {
    const legacy = { token: { type: 'color', value: '#ff0000' } } as unknown as TokenFile;
    const ext = (upgradeTokens(legacy)['token'] as { $extensions: Record<string, unknown> }).$extensions;
    assert.equal(ext['nl.nldesignsystem.authored-as'], '#ff0000');
  });

  it('records original string on a transformed fontFamily', () => {
    const legacy = { token: { type: 'fontFamily', value: 'Inter, sans-serif' } } as unknown as TokenFile;
    const ext = (upgradeTokens(legacy)['token'] as { $extensions: Record<string, unknown> }).$extensions;
    assert.equal(ext['nl.nldesignsystem.authored-as'], 'Inter, sans-serif');
  });

  it('records original string on a transformed lineHeight', () => {
    const legacy = { token: { type: 'lineHeight', value: '1.5' } } as unknown as TokenFile;
    const ext = (upgradeTokens(legacy)['token'] as { $extensions: Record<string, unknown> }).$extensions;
    assert.equal(ext['nl.nldesignsystem.authored-as'], '1.5');
  });

  it('records original string on a transformed fontWeight', () => {
    const legacy = { token: { type: 'fontWeight', value: 'bold' } } as unknown as TokenFile;
    const ext = (upgradeTokens(legacy)['token'] as { $extensions: Record<string, unknown> }).$extensions;
    assert.equal(ext['nl.nldesignsystem.authored-as'], 'bold');
  });

  it('does not add authored-as when value was already correct (object dimension)', () => {
    const modern: TokenFile = { token: { $type: 'dimension', $value: { unit: 'px', value: 8 } } };
    const token = upgradeTokens(modern)['token'] as { $extensions?: Record<string, unknown> };
    assert.equal(token.$extensions?.['nl.nldesignsystem.authored-as'], undefined);
  });

  it('does not add authored-as for alias references', () => {
    const modern: TokenFile = { token: { $type: 'color', $value: '{color.brand.primary}' } };
    const token = upgradeTokens(modern)['token'] as { $extensions?: Record<string, unknown> };
    assert.equal(token.$extensions?.['nl.nldesignsystem.authored-as'], undefined);
  });

  it('merges authored-as with existing $extensions', () => {
    const legacy = {
      token: { $extensions: { 'studio.tokens': { foo: 1 } }, type: 'spacing', value: '8px' },
    } as unknown as TokenFile;
    const ext = (upgradeTokens(legacy)['token'] as { $extensions: Record<string, unknown> }).$extensions;
    assert.equal(ext['nl.nldesignsystem.authored-as'], '8px');
    assert.deepEqual(ext['studio.tokens'], { foo: 1 });
  });

  it('does not add authored-as when calc() dimension falls back to string', () => {
    const legacy = { token: { type: 'spacing', value: 'calc(100% - 8px)' } } as unknown as TokenFile;
    const token = upgradeTokens(legacy)['token'] as { $extensions?: Record<string, unknown> };
    assert.equal(token.$extensions?.['nl.nldesignsystem.authored-as'], undefined);
  });
});
