import { describe, expect, it } from 'vitest';
import { EXTENSION_LINT_IGNORE, LINT_RULE_NAMES, LINT_RULES, isLintRuleIgnored } from './lint-rules';

const createToken = (lintIgnore?: unknown) => ({
  $extensions: { [EXTENSION_LINT_IGNORE]: lintIgnore },
  $type: 'dimension',
  $value: { unit: 'px', value: 12 },
});

describe('LINT_RULES', () => {
  it('exposes a finite list of rule names', () => {
    expect(LINT_RULE_NAMES).toEqual([
      'min-contrast',
      'min-font-size',
      'min-line-height',
      'unitless-line-height',
      'valid-token-subtype',
    ]);
  });
});

describe('isLintRuleIgnored', () => {
  it.each(LINT_RULE_NAMES)('ignores "%s" when the extension is `true`', (rule) => {
    expect(isLintRuleIgnored(createToken(true), rule)).toBe(true);
  });

  it.each(LINT_RULE_NAMES)('does not ignore "%s" when the extension is `false`', (rule) => {
    expect(isLintRuleIgnored(createToken(false), rule)).toBe(false);
  });

  it.each(LINT_RULE_NAMES)('ignores "%s" when the extension has that rule set to `true`', (rule) => {
    expect(isLintRuleIgnored(createToken({ [rule]: true }), rule)).toBe(true);
  });

  it.each(LINT_RULE_NAMES)('does not ignore "%s" when the extension has that rule set to `false`', (rule) => {
    expect(isLintRuleIgnored(createToken({ [rule]: false }), rule)).toBe(false);
  });

  it.each(LINT_RULE_NAMES)('does not ignore "%s" when only other rules are set to `true`', (rule) => {
    const otherRules = Object.fromEntries(
      LINT_RULE_NAMES.filter((otherRule) => otherRule !== rule).map((otherRule) => [otherRule, true]),
    );
    expect(isLintRuleIgnored(createToken(otherRules), rule)).toBe(false);
  });

  it('handles multiple rules in one extension', () => {
    const token = createToken({ [LINT_RULES.MIN_FONT_SIZE]: true, [LINT_RULES.MIN_LINE_HEIGHT]: false });
    expect(isLintRuleIgnored(token, LINT_RULES.MIN_FONT_SIZE)).toBe(true);
    expect(isLintRuleIgnored(token, LINT_RULES.MIN_LINE_HEIGHT)).toBe(false);
    expect(isLintRuleIgnored(token, LINT_RULES.MIN_CONTRAST)).toBe(false);
  });

  it('does not ignore anything for unknown rule names', () => {
    const token = createToken({ 'unknown-rule': true });
    for (const rule of LINT_RULE_NAMES) {
      expect(isLintRuleIgnored(token, rule)).toBe(false);
    }
  });

  it.each(LINT_RULE_NAMES)('ignores "%s" when the extension is a reason', (rule) => {
    expect(isLintRuleIgnored(createToken('this is a magic token'), rule)).toBe(true);
  });

  it.each(LINT_RULE_NAMES)('ignores "%s" when the extension has a reason for that rule', (rule) => {
    expect(isLintRuleIgnored(createToken({ [rule]: 'this is a magic token' }), rule)).toBe(true);
  });

  it.each(LINT_RULE_NAMES)('does not ignore "%s" when only other rules have a reason', (rule) => {
    const otherRules = Object.fromEntries(
      LINT_RULE_NAMES.filter((otherRule) => otherRule !== rule).map((otherRule) => [otherRule, 'reason']),
    );
    expect(isLintRuleIgnored(createToken(otherRules), rule)).toBe(false);
  });

  it.each([
    ['an empty string', ''],
    ['a number', 1],
    ['null', null],
    ['an array', ['min-font-size']],
    ['an empty object', {}],
  ])('does not ignore anything when the extension is %s', (_, value) => {
    for (const rule of LINT_RULE_NAMES) {
      expect(isLintRuleIgnored(createToken(value), rule)).toBe(false);
    }
  });

  it.each([
    ['an empty string', ''],
    ['a number', 1],
    ['null', null],
  ])('only accepts `true` or a reason as rule value, not %s', (_, value) => {
    expect(isLintRuleIgnored(createToken({ [LINT_RULES.MIN_FONT_SIZE]: value }), LINT_RULES.MIN_FONT_SIZE)).toBe(false);
  });

  it('does not ignore anything for a token without $extensions', () => {
    expect(isLintRuleIgnored({ $type: 'dimension', $value: '12px' }, LINT_RULES.MIN_FONT_SIZE)).toBe(false);
  });

  it('does not ignore anything for a token with other $extensions', () => {
    const token = { $extensions: { 'nl.nldesignsystem.other': true }, $type: 'dimension', $value: '12px' };
    expect(isLintRuleIgnored(token, LINT_RULES.MIN_FONT_SIZE)).toBe(false);
  });

  it.each([undefined, null, 'token', 42])('does not ignore anything for non-object token %j', (token) => {
    expect(isLintRuleIgnored(token, LINT_RULES.MIN_FONT_SIZE)).toBe(false);
  });
});
