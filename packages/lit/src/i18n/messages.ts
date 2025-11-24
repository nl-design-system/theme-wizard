import { ERROR_CODES } from '@nl-design-system-community/design-tokens-schema';
import { TemplateResult, html } from 'lit';
import ValidationIssue from '../lib/ValidationIssue';
import { t } from './';
import { I18nMessages } from './types';

const formatNumber = (value: number | undefined, locale: string): string => {
  if (value === undefined) return '';
  return new Intl.NumberFormat(locale, { maximumSignificantDigits: 3 }).format(value);
};

export const nl = {
  unknown: 'Onbekende fout opgetreden',
  validation: {
    error: {
      [ERROR_CODES.INSUFFICIENT_CONTRAST]: {
        compact: (issue: ValidationIssue): TemplateResult =>
          html`${t('validation.issue.invalidContrastWith', { token: issue.referredToken })}.`,
        detailed(issue: ValidationIssue): TemplateResult {
          return html`${t('validation.issue.invalidContrastWith', { token: issue.referredToken })}.
          ${t('validation.issue.contrastValue', { value: formatNumber(issue.actual, 'nl') })}.
          ${t('validation.issue.minimalNeeded', { value: formatNumber(issue.minimum, 'nl') })}.`;
        },
        label: 'Onvoldoende contrast',
      },
      [ERROR_CODES.INVALID_REF]: {
        compact(issue): TemplateResult {
          return html`<p>Ongeldige referentie: ${issue.path}</p>`;
        },
        detailed(issue): TemplateResult {
          return html`<p>${issue.path}</p>`;
        },
        label: 'Ongeldige referentie',
      },
    },
    issue: {
      contrastValue: 'Contrast: {{value}}',
      invalidContrastWith: ({ token }) => html`Onvoldoende contrast met <strong>${token}</strong>`,
      minimalNeeded: ({ value }) => html`Minimaal vereist: <strong>${value}</strong>`,
    },

    title: 'Thema validatie fouten',
    token_link: {
      aria_label: 'Spring naar {{token}}',
    },
  },
} as const satisfies I18nMessages;

export const en = {
  unknown: 'Unknown error',
  validation: {
    error: {
      [ERROR_CODES.INSUFFICIENT_CONTRAST]: {
        compact: (issue: ValidationIssue): TemplateResult =>
          html`${t('validation.issue.invalidContrastWith', { token: issue.referredToken })}.
          ${t('validation.issue.contrastValue', { value: formatNumber(issue.actual, 'en') })}.
          ${t('validation.issue.minimalNeeded', { value: formatNumber(issue.minimum, 'en') })}`,
        detailed(issue: ValidationIssue): TemplateResult {
          return html`${t('validation.issue.invalidContrastWith', { token: issue.referredToken })}.
          ${t('validation.issue.contrastValue', { value: formatNumber(issue.actual, 'en') })}.
          ${t('validation.issue.minimalNeeded', { value: formatNumber(issue.minimum, 'en') })}.`;
        },
        label: 'Insufficient contrast',
      },
      [ERROR_CODES.INVALID_REF]: {
        compact(issue: ValidationIssue): TemplateResult {
          return html`<p>Invalid reference: ${issue.path}</p>`;
        },
        detailed(issue: ValidationIssue): TemplateResult {
          return html`<p>${issue.path}</p>`;
        },
        label: 'Invalid reference',
      },
    },
    issue: {
      contrastValue: 'Contrast: {{value}}',
      invalidContrastWith: ({ token }) => html`Insufficient contrast with <strong>${token}</strong>`,
      minimalNeeded: ({ value }) => html`Required minimum: <strong>${value}</strong>`,
    },
    title: 'Theme validation errors',
    token_link: {
      aria_label: 'Jump to {{token}}',
    },
  },
} as const satisfies I18nMessages;
