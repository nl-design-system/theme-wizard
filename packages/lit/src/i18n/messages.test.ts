import { ERROR_CODES } from '@nl-design-system-community/design-tokens-schema';
import { html } from 'lit';
import { describe, expect, it, vi } from 'vitest';
import type { TokenLinkRenderer } from './types';
import { createContrastIssue, createInvalidRefIssue } from '../../test/utils';

// Mock the t function BEFORE importing messages to avoid circular dependency
vi.mock('./index', () => ({
  default: {},
  t: vi.fn((key: string, params?: Record<string, unknown>) => {
    if (key === 'validation.issue.invalidContrastWith') {
      const token = (params as { token: string })?.token || '';
      const context = (params as { context?: TokenLinkRenderer })?.context;
      if (context) {
        return context(token);
      }
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
      const result = nl.validation.error[ERROR_CODES.INSUFFICIENT_CONTRAST].detailed(
        createContrastIssue({ actual: 2.456225586, minimum: 4.51235478 }),
      );
      expect(result).toBeDefined();
      expect(result.strings).toBeDefined();
      const textValues = result.values.filter((value) => typeof value === 'string') as string[];
      expect(textValues.some((value) => value.includes('2,46'))).toBe(true);
      expect(textValues.some((value) => value.includes('4,5'))).toBe(true);
    });

    it('returns empty string when value is undefined', () => {
      const result = nl.validation.error[ERROR_CODES.INSUFFICIENT_CONTRAST].detailed(
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
      title: 'Thema validatie fouten',
      unknownMsg: 'Onbekende fout opgetreden',
    },
    {
      contrastLabel: 'Insufficient contrast',
      invalidRefLabel: 'Invalid reference',
      locale: 'en',
      messages: en,
      title: 'Theme validation errors',
      unknownMsg: 'Unknown error',
    },
  ])('locale messages', ({ contrastLabel, invalidRefLabel, locale, messages, title, unknownMsg }) => {
    it('has correct unknown message', () => {
      expect(messages.unknown).toBe(unknownMsg);
    });

    it('has correct validation title', () => {
      expect(messages.validation.title).toBe(title);
    });

    describe('validation.error.INSUFFICIENT_CONTRAST', () => {
      it('has correct label', () => {
        expect(messages.validation.error[ERROR_CODES.INSUFFICIENT_CONTRAST].label).toBe(contrastLabel);
      });

      it('compact returns TemplateResult', () => {
        const result = messages.validation.error[ERROR_CODES.INSUFFICIENT_CONTRAST].compact(createContrastIssue());
        expect(result).toBeDefined();
        expect(result.strings).toBeDefined();
      });

      it('detailed returns TemplateResult', () => {
        const result = messages.validation.error[ERROR_CODES.INSUFFICIENT_CONTRAST].detailed(createContrastIssue());
        expect(result).toBeDefined();
        expect(result.strings).toBeDefined();
        expect(result.values.includes('test.path')).toBe(true);
      });
    });

    describe('validation.error.INVALID_REF', () => {
      it('has correct label', () => {
        expect(messages.validation.error[ERROR_CODES.INVALID_REF].label).toBe(invalidRefLabel);
      });

      it('compact returns TemplateResult with path in values', () => {
        const result = messages.validation.error[ERROR_CODES.INVALID_REF].compact(createInvalidRefIssue());
        expect(result).toBeDefined();
        expect(result.strings).toBeDefined();
        expect(result.values.includes('test.path')).toBe(true);
      });

      it('detailed returns TemplateResult with path in values', () => {
        const result = messages.validation.error[ERROR_CODES.INVALID_REF].detailed(createInvalidRefIssue());
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
        it('calls renderTokenLink with referred token', () => {
          const mockRenderTokenLink = vi.fn((token: string) => html`<button>${token}</button>`);
          const result = messages.validation.issue.invalidContrastWith({
            context: mockRenderTokenLink,
            token: 'basis.color.some.color.token',
          });
          expect(result).toBeDefined();
          expect(result.strings).toBeDefined();
          expect(mockRenderTokenLink).toHaveBeenCalledWith('basis.color.some.color.token');
        });

        it('returns TemplateResult with strong tag when renderTokenLink is not provided', () => {
          const result = messages.validation.issue.invalidContrastWith({
            context: undefined,
            token: 'basis.color.primary',
          });
          expect(result).toBeDefined();
          expect(result.strings).toBeDefined();
          const tokenLink = result.values[0] as { strings: string[]; values: unknown[] };
          expect(tokenLink.strings.join('')).toContain('<strong>');
          expect(tokenLink.values).toContain('basis.color.primary');
        });

        it('renders plain text and does not call renderTokenLink when token is empty', () => {
          const mockRenderTokenLink = vi.fn((token: string) => html`<button>${token}</button>`);
          const result = messages.validation.issue.invalidContrastWith({
            context: mockRenderTokenLink,
            token: '',
          });
          expect(result).toBeDefined();
          expect(result.strings).toBeDefined();
          expect(mockRenderTokenLink).not.toHaveBeenCalled();
          const fullText = result.strings.join('');
          expect(fullText).not.toContain('<strong>');
        });
      });

      it('minimalNeeded returns TemplateResult with value', () => {
        const result = messages.validation.issue.minimalNeeded({ value: '4.5' });
        expect(result).toBeDefined();
        expect(result.strings).toBeDefined();
        expect(result.values.includes('4.5')).toBe(true);
      });
    });

    it('token_link.aria_label has correct template', () => {
      const expected = locale === 'nl' ? 'Spring naar {{token}}' : 'Jump to {{token}}';
      expect(messages.validation.token_link.aria_label).toBe(expected);
    });
  });
});
