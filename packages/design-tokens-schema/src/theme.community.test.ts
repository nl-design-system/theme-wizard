// So we can use Object.groupBy()
/// <reference lib="es2024" />

import purmerendTokens from '@nl-design-system-community/purmerend-design-tokens/dist/tokens.json';
import purmerendSourceTokens from '@nl-design-system-community/purmerend-design-tokens/figma/figma.tokens.json';
import leidenTokens from '@nl-design-system-unstable/leiden-design-tokens/dist/tokens.json';
import leidenSourceTokens from '@nl-design-system-unstable/leiden-design-tokens/figma/leiden.tokens.json';
import { describe, it, expect } from 'vitest';
import { excludeParentKeys, StrictThemeSchema } from './theme';

// NOTE!
//
// These tests exist to verify validation behaviour against these pinned versions of community files
// Our intent is not to upgrade these for the time being, because they deliver relevant information
// about how themes are created and which patterns are relevant to check.
describe('source files', () => {
  describe('Purmerend', () => {
    const purmerendTokens = excludeParentKeys(purmerendSourceTokens);

    it('errors', () => {
      const result = StrictThemeSchema.safeParse(purmerendTokens);
      expect(result.success).toEqual(false);
      // Purmerend is missing many required color groups (invalid_type),
      // has outdated color keys (unrecognized_keys), and legacy color formats (invalid_union)
      const issuesByCode = Object.groupBy(result.error?.issues ?? [], (i) => i.code);
      expect(issuesByCode['invalid_type']).toHaveLength(25);
      expect(issuesByCode['invalid_union']).toHaveLength(122);
      expect(issuesByCode['unrecognized_keys']).toHaveLength(9);
    });

    it('has outdated color names', () => {
      const result = StrictThemeSchema.safeParse(purmerendTokens);
      const expectedErroneousKeys = [
        'bg-1',
        'bg-2',
        'interactive-1',
        'interactive-2',
        'interactive-3',
        'border-1',
        'border-2',
        'border-3',
        'fill-1',
        'fill-2',
        'text-1',
        'text-2',
      ];
      const expectedErrorPaths = [
        ['basis', 'color', 'disabled'],
        ['basis', 'color', 'disabled-inverse'],
        ['basis', 'color', 'highlight'],
        ['basis', 'color', 'info'],
        ['basis', 'color', 'info-inverse'],
        ['basis', 'color', 'selected'],
        ['basis', 'color', 'warning'],
        ['basis', 'color', 'warning-inverse'],
      ];

      // Filter to unrecognized_keys at color group level (path length 3)
      const colorGroupIssues = result.error?.issues.filter(
        (i) => i.code === 'unrecognized_keys' && i.path[0] === 'basis' && i.path[1] === 'color' && i.path.length === 3,
      );

      for (let index = 0; index < expectedErrorPaths.length; index++) {
        expect(colorGroupIssues?.[index]).toMatchObject({
          code: 'unrecognized_keys',
          keys: expectedErroneousKeys,
          message: `Unrecognized keys: ${expectedErroneousKeys.map((key) => '"' + key + '"').join(', ')}`,
          path: expectedErrorPaths[index],
        });
      }
    });

    it('has outdated color group names', () => {
      // Purmerend uses .text, .error for color names, instead of .default and .negative
      const result = StrictThemeSchema.safeParse(purmerendTokens);
      // Find the unrecognized_keys issue at ['basis', 'color'] (wrong color group names)
      const colorGroupNamesIssue = result.error?.issues.find(
        (i) => i.code === 'unrecognized_keys' && i.path.length === 2 && i.path[0] === 'basis' && i.path[1] === 'color',
      );
      expect(colorGroupNamesIssue).toEqual({
        code: 'unrecognized_keys',
        keys: [
          'text',
          'primary',
          'secondary',
          'error',
          'success',
          'mark',
          'text-inverse',
          'primary-inverse',
          'secondary-inverse',
          'error-inverse',
          'success-inverse',
        ],
        message:
          'Unrecognized keys: "text", "primary", "secondary", "error", "success", "mark", "text-inverse", "primary-inverse", "secondary-inverse", "error-inverse", "success-inverse"',
        path: ['basis', 'color'],
      });
    });
  });

  describe('Leiden', () => {
    it('errors', () => {
      const result = StrictThemeSchema.safeParse(excludeParentKeys(leidenSourceTokens));
      expect(result.success).toBe(false);

      expect(result.error?.issues).toHaveLength(2);
      expect(result.error?.issues[0]).toEqual({
        code: 'unrecognized_keys',
        keys: ['box-shadow'],
        message: 'Unrecognized key: "box-shadow"',
        path: ['basis', 'color'],
      });
      // Leiden defines a 'more-space' line-height variant not in the schema
      expect(result.error?.issues[1]).toEqual({
        code: 'unrecognized_keys',
        keys: ['more-space'],
        message: 'Unrecognized key: "more-space"',
        path: ['basis', 'text', 'line-height'],
      });
    });
  });
});

describe('dist files', () => {
  it('Leiden theme', () => {
    const result = StrictThemeSchema.safeParse(leidenTokens);
    expect(result.success).toEqual(false);
    expect(result.error?.issues).toHaveLength(2);
    expect(result.error?.issues.every((issue) => issue.code === 'unrecognized_keys')).toBeTruthy();
  });

  it('Purmerend theme', () => {
    const result = StrictThemeSchema.safeParse(purmerendTokens);
    expect(result.success).toEqual(false);
    // Purmerend is missing required color groups (invalid_type),
    // has legacy color formats (invalid_union), and outdated color keys (unrecognized_keys)
    const issuesByCode = Object.groupBy(result.error?.issues ?? [], (i) => i.code);
    expect(issuesByCode['invalid_type']).toHaveLength(25);
    expect(issuesByCode['invalid_union']).toHaveLength(122);
    expect(issuesByCode['unrecognized_keys']).toHaveLength(9);
  });
});
