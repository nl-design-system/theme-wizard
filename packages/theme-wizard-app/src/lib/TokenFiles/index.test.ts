import { ERROR_CODES } from '@nl-design-system-community/design-tokens-schema';
import dlv from 'dlv';
import { describe, expect, it } from 'vitest';
import { parseThemePreset } from './index';

const toFile = (tokens: unknown) => new File([JSON.stringify(tokens)], 'tokens.json', { type: 'application/json' });

describe('parseThemePreset', () => {
  it('fills in tokens missing from an incomplete upload using the Start-thema defaults', async () => {
    const result = await parseThemePreset([toFile({ basis: {} })], false);

    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(dlv(result.data, 'basis.color.accent-1.bg-default')).toBeDefined();
    expect(result.uploadedTokenCount).toBe(0);
    expect(result.filledFromDefaultsPaths.length).toBeGreaterThan(0);
    expect(result.filledFromDefaultsPaths).toContain('basis.color.accent-1.bg-default');
  });

  it('allows a theme with only a soft issue (font-size below minimum)', async () => {
    const upload = {
      basis: {
        text: {
          'font-size': {
            sm: { $type: 'fontSize', $value: '0.5rem' },
          },
        },
      },
    };

    const result = await parseThemePreset([toFile(upload)], false);

    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.uploadedTokenCount).toBe(1);
    expect(result.softIssues.length).toBeGreaterThan(0);
    expect(result.filledFromDefaultsPaths).not.toContain('basis.text.font-size.sm');
  });

  it('rejects a theme with a structural issue (invalid token reference)', async () => {
    const upload = {
      basis: {
        'border-radius': {
          md: { $value: '{basis.border-radius.does-not-exist}' },
        },
      },
    };

    const result = await parseThemePreset([toFile(upload)], false);

    expect(result.success).toBe(false);
    if (result.success) return;
    expect(result.error.some((issue) => 'ERROR_CODE' in issue && issue.ERROR_CODE === ERROR_CODES.INVALID_REF)).toBe(
      true,
    );
  });
});
