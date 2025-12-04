import { ERROR_CODES } from '@nl-design-system-community/design-tokens-schema';
import type { TokenLinkRenderer } from '../../src/i18n/types';
import type ValidationIssue from '../../src/lib/ValidationIssue';

type ContrastIssue = ValidationIssue & { renderTokenLink?: TokenLinkRenderer };

export const createContrastIssue = (overrides: Partial<ContrastIssue> = {}): ContrastIssue => ({
  id: 'test.path-error-insufficient_contrast',
  actual: 2.5,
  code: ERROR_CODES.INSUFFICIENT_CONTRAST,
  message: 'Test message',
  minimum: 4.5,
  path: 'test.path',
  referredToken: 'basis.color.some.color.token',
  ...overrides,
});

export const createInvalidRefIssue = (overrides: Partial<ValidationIssue> = {}): ValidationIssue => ({
  id: 'test.path-error-invalid_ref',
  code: ERROR_CODES.INVALID_REF,
  message: 'Test message',
  path: 'test.path',
  ...overrides,
});
