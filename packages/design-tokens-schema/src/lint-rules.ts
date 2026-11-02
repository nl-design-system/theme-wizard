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

/** `true` ignores all rules, an object ignores only the rules set to `true` */
export type LintIgnoreExtension = boolean | Partial<Record<LintRule, boolean>>;

declare module './extensions' {
  interface ExtensionTypeMap {
    [EXTENSION_LINT_IGNORE]: LintIgnoreExtension;
  }
}

export const isLintRuleIgnored = (token: unknown, rule: LintRule): boolean => {
  if (!isValueObject(token)) {
    return false;
  }
  const ignore = getExtension(token, EXTENSION_LINT_IGNORE);
  if (ignore === true) {
    return true;
  }
  return isValueObject(ignore) && ignore[rule] === true;
};
