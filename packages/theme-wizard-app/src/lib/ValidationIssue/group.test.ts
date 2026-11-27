import { ERROR_CODES, TokenGroup } from '@nl-design-system-community/design-tokens-schema';
import { describe, expect, it } from 'vitest';
import type ValidationIssue from './index';
import { groupValidationIssues } from './group';

const contrastIssue = (
  path: string,
  tokens: [string, string],
  overrides: Partial<ValidationIssue> = {},
): ValidationIssue =>
  ({
    id: `${path}-error-${ERROR_CODES.INSUFFICIENT_CONTRAST}`,
    code: ERROR_CODES.INSUFFICIENT_CONTRAST,
    message: 'Test message',
    path,
    // Mirrors the ValidationIssue constructor: the token of the pair that is not the issue's own path
    referredToken: tokens.find((token) => token !== path),
    tokens,
    ...overrides,
  }) as ValidationIssue;

const COLOR_DEFAULT = 'basis.color.default.color-default';
const BG_DEFAULT = 'basis.color.default.bg-default';
const COLOR_HOVER = 'basis.color.accent-1.color-hover';
const BG_HOVER = 'basis.color.accent-1.bg-hover';
const BUTTON_COLOR = 'ams.button.color';
const BUTTON_BG = 'ams.button.background-color';

const tokens: TokenGroup = {
  ams: {
    button: {
      'background-color': { $type: 'color', $value: `{${BG_DEFAULT}}` },
      color: { $type: 'color', $value: `{${COLOR_DEFAULT}}` },
    },
  },
  basis: {
    color: {
      'accent-1': {
        'bg-hover': { $type: 'color', $value: '#eeeeee' },
        'color-hover': { $type: 'color', $value: '#777777' },
      },
      default: {
        'bg-default': { $type: 'color', $value: '#ffffff' },
        'color-default': { $type: 'color', $value: '#111111' },
      },
    },
  },
};

describe('groupValidationIssues', () => {
  it('collapses the two issues of a single failing contrast pair into one group', () => {
    const issues = [
      contrastIssue(COLOR_DEFAULT, [COLOR_DEFAULT, BG_DEFAULT]),
      contrastIssue(BG_DEFAULT, [BG_DEFAULT, COLOR_DEFAULT]),
    ];

    const groups = groupValidationIssues(issues, tokens);

    expect(groups).toHaveLength(1);
    expect(groups[0].code).toBe(ERROR_CODES.INSUFFICIENT_CONTRAST);
    expect(groups[0].issues).toHaveLength(1);
    expect(groups[0].id).toBe(`${ERROR_CODES.INSUFFICIENT_CONTRAST}:${BG_DEFAULT}|${COLOR_DEFAULT}`);
  });

  it("removes the second issue when two issues are each other's opposite", () => {
    const issues = [
      contrastIssue(COLOR_DEFAULT, [COLOR_DEFAULT, BG_DEFAULT]),
      contrastIssue(BG_DEFAULT, [BG_DEFAULT, COLOR_DEFAULT]),
    ];

    const [group] = groupValidationIssues(issues, tokens);

    expect(group.issues.map((issue) => issue.path)).toEqual([COLOR_DEFAULT]);
    expect(group.representative.path).toBe(COLOR_DEFAULT);
  });

  it('keeps the first issue when an opposite pair is listed in reverse order', () => {
    const issues = [
      contrastIssue(BG_DEFAULT, [BG_DEFAULT, COLOR_DEFAULT]),
      contrastIssue(COLOR_DEFAULT, [COLOR_DEFAULT, BG_DEFAULT]),
    ];

    const [group] = groupValidationIssues(issues, tokens);

    expect(group.issues.map((issue) => issue.path)).toEqual([BG_DEFAULT]);
  });

  it('keeps an issue whose referredToken has an issue that is not its opposite', () => {
    const issues = [
      contrastIssue(COLOR_DEFAULT, [COLOR_DEFAULT, BG_DEFAULT]),
      contrastIssue(BG_DEFAULT, [BG_DEFAULT, COLOR_DEFAULT]),
      contrastIssue(BUTTON_COLOR, [BUTTON_COLOR, BG_DEFAULT]),
    ];

    const groups = groupValidationIssues(issues, tokens);

    // ams.button.color references basis.color.default.color-default, so all issues land in one
    // group. BG_DEFAULT's issue is the opposite of COLOR_DEFAULT's issue and is removed, but
    // BUTTON_COLOR's referredToken (BG_DEFAULT) has no opposite issue, so it is kept.
    expect(groups).toHaveLength(1);
    expect(groups[0].issues.map((issue) => issue.path)).toEqual([COLOR_DEFAULT, BUTTON_COLOR]);
  });

  it('merges issues on tokens that reference the failing pair into the same group', () => {
    const issues = [
      contrastIssue(COLOR_DEFAULT, [COLOR_DEFAULT, BG_DEFAULT]),
      contrastIssue(BG_DEFAULT, [BG_DEFAULT, COLOR_DEFAULT]),
      contrastIssue(BUTTON_COLOR, [BUTTON_COLOR, BUTTON_BG]),
      contrastIssue(BUTTON_BG, [BUTTON_BG, BUTTON_COLOR]),
    ];

    const groups = groupValidationIssues(issues, tokens);

    expect(groups).toHaveLength(1);
    // The second half of each opposite path/referredToken pair is removed
    expect(groups[0].issues.map((issue) => issue.path).sort()).toEqual([BUTTON_COLOR, COLOR_DEFAULT].sort());
  });

  it('keeps unrelated contrast pairs in separate groups', () => {
    const issues = [
      contrastIssue(COLOR_DEFAULT, [COLOR_DEFAULT, BG_DEFAULT]),
      contrastIssue(BG_DEFAULT, [BG_DEFAULT, COLOR_DEFAULT]),
      contrastIssue(COLOR_HOVER, [COLOR_HOVER, BG_HOVER]),
      contrastIssue(BG_HOVER, [BG_HOVER, COLOR_HOVER]),
    ];

    const groups = groupValidationIssues(issues, tokens);

    expect(groups).toHaveLength(2);
    expect(groups.map((group) => group.issues)).toEqual([
      expect.arrayContaining([expect.objectContaining({ path: COLOR_HOVER })]),
      expect.arrayContaining([expect.objectContaining({ path: COLOR_DEFAULT })]),
    ]);
  });

  it('keeps issues on the same path but with different partners in separate groups', () => {
    const issues = [
      contrastIssue(COLOR_DEFAULT, [COLOR_DEFAULT, BG_DEFAULT]),
      contrastIssue(COLOR_DEFAULT, [COLOR_DEFAULT, BG_HOVER]),
    ];

    const groups = groupValidationIssues(issues, tokens);

    expect(groups).toHaveLength(2);
  });

  it('follows reference chains when linking issues', () => {
    const chainedTokens: TokenGroup = {
      ...tokens,
      ams: {
        ...(tokens['ams'] as object),
        link: {
          color: { $type: 'color', $value: `{${BUTTON_COLOR}}` },
        },
      },
    };
    const issues = [
      contrastIssue(COLOR_DEFAULT, [COLOR_DEFAULT, BG_DEFAULT]),
      contrastIssue(BG_DEFAULT, [BG_DEFAULT, COLOR_DEFAULT]),
      contrastIssue('ams.link.color', ['ams.link.color', BUTTON_BG]),
    ];

    const groups = groupValidationIssues(issues, chainedTokens);

    expect(groups).toHaveLength(1);
    // BG_DEFAULT's issue is the opposite of COLOR_DEFAULT's issue and is removed; ams.link.color's
    // referredToken (BUTTON_BG) has no issue of its own, so it is kept
    expect(groups[0].issues.map((issue) => issue.path)).toEqual([COLOR_DEFAULT, 'ams.link.color']);
  });

  it('prefers a non-reference token as the representative issue', () => {
    const issues = [
      contrastIssue(BUTTON_COLOR, [BUTTON_COLOR, BUTTON_BG]),
      contrastIssue(BUTTON_BG, [BUTTON_BG, BUTTON_COLOR]),
      contrastIssue(COLOR_DEFAULT, [COLOR_DEFAULT, BG_DEFAULT]),
      contrastIssue(BG_DEFAULT, [BG_DEFAULT, COLOR_DEFAULT]),
    ];

    const [group] = groupValidationIssues(issues, tokens);

    expect([COLOR_DEFAULT, BG_DEFAULT]).toContain(group.representative.path);
  });

  it('groups non-contrast issues per error code, as before', () => {
    const issues = [
      { id: 'a-error-invalid_ref', code: ERROR_CODES.INVALID_REF, message: '', path: 'a' },
      { id: 'b-error-invalid_ref', code: ERROR_CODES.INVALID_REF, message: '', path: 'b' },
      { id: 'c-error-font_size_too_small', code: ERROR_CODES.FONT_SIZE_TOO_SMALL, message: '', path: 'c' },
    ] as ValidationIssue[];

    const groups = groupValidationIssues(issues, tokens);

    expect(groups).toHaveLength(2);
    const invalidRef = groups.find((group) => group.code === ERROR_CODES.INVALID_REF);
    expect(invalidRef?.issues).toHaveLength(2);
    expect(invalidRef?.representative.path).toBe('a');
    const fontSize = groups.find((group) => group.code === ERROR_CODES.FONT_SIZE_TOO_SMALL);
    expect(fontSize?.issues).toHaveLength(1);
  });

  it('returns an empty array when there are no issues', () => {
    expect(groupValidationIssues([], tokens)).toEqual([]);
  });
});
