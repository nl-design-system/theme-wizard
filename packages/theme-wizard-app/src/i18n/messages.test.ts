import { ERROR_CODES } from '@nl-design-system-community/design-tokens-schema';
import { html } from 'lit';
import { describe, expect, it, vi } from 'vitest';
import { createContrastIssue, createInvalidRefIssue } from '../../test/utils';

// Mock the t function BEFORE importing messages to avoid circular dependency
vi.mock('./index', () => ({
  default: {},
  t: vi.fn((key: string, params?: Record<string, unknown>) => {
    if (key === 'validation.issue.invalidContrastWith') {
      const token = (params as { token: string })?.token || '';
      return html`<strong>${token}</strong>`;
    }
    if (key === 'validation.issue.contrastValue') {
      return `Contrast: ${(params as { value: string })?.value || ''}`;
    }
    if (key === 'validation.issue.minimalNeeded') {
      return `Minimaal vereist: ${(params as { value: string })?.value || ''}`;
    }
    return key;
  }),
}));

import { en, nl } from './messages';

describe('messages', () => {
  describe('formatNumber', () => {
    it('formats numbers correctly through message functions', () => {
      const result = nl.validation.error[ERROR_CODES.INSUFFICIENT_CONTRAST].message(
        createContrastIssue({ actual: 2.456225586, minimum: 4.51235478 }),
      );
      expect(result).toBeDefined();
      expect(result.strings).toBeDefined();
      const textValues = result.values.filter((value) => typeof value === 'string') as string[];
      expect(textValues.some((value) => value.includes('2,46'))).toBe(true);
      expect(textValues.some((value) => value.includes('4,5'))).toBe(true);
    });

    it('returns empty string when value is undefined', () => {
      const result = nl.validation.error[ERROR_CODES.INSUFFICIENT_CONTRAST].message(
        createContrastIssue({ actual: undefined, minimum: undefined }),
      );
      expect(result).toBeDefined();
      expect(result.strings).toBeDefined();
      const textValues = result.values.filter((value) => typeof value === 'string') as string[];
      expect(textValues.some((value) => value.includes('undefined'))).toBe(false);
    });
  });

  describe.each([
    {
      contrastLabel: 'Onvoldoende contrast',
      invalidRefLabel: 'Ongeldige referentie',
      locale: 'nl',
      messages: nl,
      unknownMsg: 'Onbekende fout opgetreden',
    },
    {
      contrastLabel: 'Insufficient contrast',
      invalidRefLabel: 'Invalid reference',
      locale: 'en',
      messages: en,
      unknownMsg: 'Unknown error',
    },
  ])('locale messages', ({ contrastLabel, invalidRefLabel, messages, unknownMsg }) => {
    it('has correct unknown message', () => {
      expect(messages.unknown).toBe(unknownMsg);
    });

    describe('validation.error.INSUFFICIENT_CONTRAST', () => {
      it('has correct label', () => {
        expect(messages.validation.error[ERROR_CODES.INSUFFICIENT_CONTRAST].label).toBe(contrastLabel);
      });

      it('message returns TemplateResult', () => {
        const result = messages.validation.error[ERROR_CODES.INSUFFICIENT_CONTRAST].message(createContrastIssue());
        expect(result).toBeDefined();
        expect(result.strings).toBeDefined();
        expect(result.values.includes('test.path')).not.toBe(true);
      });
    });

    describe('validation.error.INVALID_REF', () => {
      it('has correct label', () => {
        expect(messages.validation.error[ERROR_CODES.INVALID_REF].label).toBe(invalidRefLabel);
      });

      it('message returns TemplateResult with path in values', () => {
        const result = messages.validation.error[ERROR_CODES.INVALID_REF].message(createInvalidRefIssue());
        expect(result).toBeDefined();
        expect(result.strings).toBeDefined();
        expect(result.values.includes('test.path')).toBe(true);
      });
    });

    describe('validation.issue', () => {
      it('contrastValue has correct template', () => {
        expect(messages.validation.issue.contrastValue).toBe('Contrast: {{value}}');
      });

      describe('invalidContrastWith', () => {
        it('returns TemplateResult with the token in a strong tag', () => {
          const result = messages.validation.issue.invalidContrastWith({ token: 'basis.color.primary' });
          expect(result.strings.join('')).toContain('<strong>');
          expect(result.values).toContain('basis.color.primary');
        });

        it('renders plain text when token is empty', () => {
          const result = messages.validation.issue.invalidContrastWith({ token: '' });
          expect(result.strings.join('')).not.toContain('<strong>');
        });
      });

      it('minimalNeeded returns TemplateResult with value', () => {
        const result = messages.validation.issue.minimalNeeded({ value: '4.5' });
        expect(result).toBeDefined();
        expect(result.strings).toBeDefined();
        expect(result.values.includes('4.5')).toBe(true);
      });
    });
  });
});
