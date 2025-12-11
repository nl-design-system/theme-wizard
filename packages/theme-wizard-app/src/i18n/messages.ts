import type { TemplateResult } from 'lit';
import { ERROR_CODES } from '@nl-design-system-community/design-tokens-schema';
import { html } from 'lit';
import type { TokenLinkRenderer } from './types';
import ValidationIssue from '../lib/ValidationIssue';
import { t } from './';

const formatNumber = (value: number | undefined, locale: string): string => {
  if (value === undefined) return '';
  return new Intl.NumberFormat(locale, { maximumSignificantDigits: 3 }).format(value);
};

export const en = {
  back: 'Back',
  cancel: 'Cancel',
  close: 'Close',
  continue: 'Continue',
  scraper: {
    input: {
      label: 'Website URL',
    },
    invalidUrl: 'Please fill in a valid URL',
    scrapeFailed: `Failed to scrape "{{url}}"`,
    submit: 'Analyze',
    success: 'Done! Found {{tokenCount}} tokens.',
  },
  tokenDownloadDialog: {
    body: 'There are still errors in your theme. This may lead to issues with readability, contrast, or consistency. Do you still want to download the tokens?',
    cancel: () => t('cancel'),
    downloadAnyway: 'Download anyway',
    title: 'Theme contains errors',
  },
  tokens: {
    fieldLabels: {
      basis: {
        color: {
          'accent-1': 'Accent 1',
          'accent-2': 'Accent 2',
          'accent-3': 'Accent 3',
          'action-1': 'Action 1',
          'action-2': 'Action 2',
          default: 'Default',
          disabled: 'Disabled',
          highlight: 'Highlight',
          info: 'Info',
          negative: 'Negative',
          positive: 'Positive',
          selected: 'Selected',
          warning: 'Warning',
        },
      },
      bodyFont: 'Running text',
      headingFont: 'Headings',
    },
  },
  unknown: 'Unknown error',
  validation: {
    error: {
      [ERROR_CODES.INSUFFICIENT_CONTRAST]: {
        compact: (issue: ValidationIssue & { renderTokenLink?: TokenLinkRenderer }): TemplateResult =>
          html`${t('validation.issue.invalidContrastWith', {
            context: issue.renderTokenLink,
            token: issue.referredToken,
          })}.
          ${t('validation.issue.contrastValue', { value: formatNumber(issue.actual, 'en') })}.
          ${t('validation.issue.minimalNeeded', { value: formatNumber(issue.minimum, 'en') })}`,
        detailed: (issue: ValidationIssue & { renderTokenLink?: TokenLinkRenderer }): TemplateResult => {
          return html`${issue.path}:
          ${t('validation.issue.invalidContrastWith', {
            context: issue.renderTokenLink,
            token: issue.referredToken,
          })}.
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
      invalidContrastWith: ({ context, token }: { context?: TokenLinkRenderer; token: string }) => {
        if (!token) return html`Insufficient contrast`;

        const tokenLink = context ? context(token) : html`<strong>${token}</strong>`;
        return html`Insufficient contrast with ${tokenLink}`;
      },
      minimalNeeded: ({ value }: { value: string }) => html`Required minimum: <strong>${value}</strong>`,
    },
    title: 'Theme validation errors',
    token_link: {
      aria_label: 'Jump to {{token}}',
    },
  },
};

export const nl = {
  back: 'Terug',
  cancel: 'Annuleren',
  close: 'Sluiten',
  continue: 'Doorgaan',
  scraper: {
    input: {
      label: 'Website URL',
    },
    invalidUrl: 'Vul een valide URL in',
    scrapeFailed: `Kan "{{url}}" niet analyseren`,
    submit: 'Analyseer',
    success: 'Gereed, {{tokenCount}} tokens gevonden',
  },
  tokenDownloadDialog: {
    body: 'Er zijn nog fouten gevonden in je thema. Dit kan leiden tot problemen met leesbaarheid, contrast of consistentie. Wil je de tokens toch downloaden?',
    cancel: () => t('cancel'),
    downloadAnyway: 'Toch downloaden',
    title: 'Thema bevat nog fouten',
  },

  tokens: {
    fieldLabels: {
      basis: {
        color: {
          'accent-1': 'Accent 1',
          'accent-2': 'Accent 2',
          'accent-3': 'Accent 3',
          'action-1': 'Actie 1',
          'action-2': 'Actie 2',
          default: 'Standaard',
          disabled: 'Uitgeschakeld',
          highlight: 'Markering',
          info: 'Info',
          negative: 'Negatief',
          positive: 'Positief',
          selected: 'Geselecteerd',
          warning: 'Waarschuwing',
        },
      },
      bodyFont: 'Lopende tekst',
      headingFont: 'Koppen',
    },
  },
  unknown: 'Onbekende fout opgetreden',
  validation: {
    error: {
      [ERROR_CODES.INSUFFICIENT_CONTRAST]: {
        compact: (issue: ValidationIssue & { renderTokenLink?: TokenLinkRenderer }): TemplateResult =>
          html`${t('validation.issue.invalidContrastWith', {
            context: issue.renderTokenLink,
            token: issue.referredToken,
          })}`,
        detailed: (issue: ValidationIssue & { renderTokenLink?: TokenLinkRenderer }): TemplateResult => {
          return html`${issue.path}:
          ${t('validation.issue.invalidContrastWith', {
            context: issue.renderTokenLink,
            token: issue.referredToken,
          })}.
          ${t('validation.issue.contrastValue', { value: formatNumber(issue.actual, 'nl') })}.
          ${t('validation.issue.minimalNeeded', { value: formatNumber(issue.minimum, 'nl') })}.`;
        },
        label: 'Onvoldoende contrast',
      },
      [ERROR_CODES.INVALID_REF]: {
        compact(issue: ValidationIssue): TemplateResult {
          return html`<p>Ongeldige referentie: ${issue.path}</p>`;
        },
        detailed(issue: ValidationIssue): TemplateResult {
          return html`<p>${issue.path}</p>`;
        },
        label: 'Ongeldige referentie',
      },
    },
    issue: {
      contrastValue: 'Contrast: {{value}}',
      invalidContrastWith: ({ context, token }: { context?: TokenLinkRenderer; token: string }) => {
        if (!token) return html`Onvoldoende contrast`;

        const tokenLink = context ? context(token) : html`<strong>${token}</strong>`;
        return html`Onvoldoende contrast met ${tokenLink}`;
      },
      minimalNeeded: ({ value }: { value: string }) => html`Minimaal vereist: <strong>${value}</strong>`,
    },

    title: 'Thema validatie fouten',
    token_link: {
      aria_label: 'Spring naar {{token}}',
    },
  },
} satisfies typeof en;
