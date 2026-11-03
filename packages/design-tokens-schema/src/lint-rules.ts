import { getExtension } from './extensions';
import { isValueObject } from './tokens/token-reference';

export const EXTENSION_LINT_IGNORE = 'nl.nldesignsystem.lint-ignore';

/** Lint rules that can be disabled per token via the `EXTENSION_LINT_IGNORE` extension */
export const LINT_RULES = {
  MIN_CONTRAST: 'min-contrast',
  MIN_FONT_SIZE: 'min-font-size',
  MIN_LINE_HEIGHT: 'min-line-height',
  UNITLESS_LINE_HEIGHT: 'unitless-line-height',
  VALID_TOKEN_SUBTYPE: 'valid-token-subtype',
} as const;

export type LintRule = (typeof LINT_RULES)[keyof typeof LINT_RULES];

export const LINT_RULE_NAMES: LintRule[] = Object.values(LINT_RULES);

/** A reason (non-empty string) documents why a rule is ignored, like `$deprecated` */
type LintIgnoreValue = boolean | string;

/** `true` or a reason ignores all rules, an object ignores only the rules set to `true` or a reason */
export type LintIgnoreExtension = LintIgnoreValue | Partial<Record<LintRule, LintIgnoreValue>>;

declare module './extensions' {
  interface ExtensionTypeMap {
    [EXTENSION_LINT_IGNORE]: LintIgnoreExtension;
  }
}

const isIgnoreValue = (value: unknown): boolean => {
  return value === true || (typeof value === 'string' && value.length > 0);
};

export const isLintRuleIgnored = (token: unknown, rule: LintRule): boolean => {
  if (!isValueObject(token)) {
    return false;
  }
  const ignore = getExtension(token, EXTENSION_LINT_IGNORE);
  if (isIgnoreValue(ignore)) {
    return true;
  }
  return isValueObject(ignore) && isIgnoreValue(ignore[rule]);
};
