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
  app: {
    title: 'Theme Wizard',
  },
  back: 'Back',
  cancel: 'Cancel',
  close: 'Close',
  continue: 'Continue',
  loading: 'Loading...',
  nav: {
    configure: 'Edit branding',
    styleGuide: 'Style guide',
  },
  scraper: {
    input: {
      label: 'Website URL',
    },
    invalidUrl: 'Please fill in a valid URL',
    scrapeFailed: `Failed to scrape "{{url}}"`,
    submit: 'Analyze',
    success: 'Done! Found {{tokenCount}} tokens.',
  },
  styleGuide: {
    sections: {
      colors: {
        table: {
          header: {
            name: 'Name',
            hexCode: 'Hex code',
            sample: 'Sample',
          },
        },
        title: 'Colors',
      },
      space: {
        block: {
          sample: 'Example element shown in complementary size',
          title: 'Block',
        },
        column: {
          sample: 'Example element shown in complementary size',
          title: 'Column',
        },
        inline: {
          sample: 'Example element shown in complementary size',
          title: 'Inline',
        },
        row: {
          sample: 'Example element shown in complementary size',
          title: 'Row',
        },
        table: {
          header: {
            name: 'Name',
            sample: 'Sample',
            value: 'Value',
          },
        },
        text: {
          sample: 'Voorbeeldelement getoond in de bijbehorende afmeting',
          title: 'Text',
        },
        title: 'Spacing',
      },
      typography: {
        headings: {
          sample: 'Example heading to show size, line height and weight',
          table: {
            header: {
              name: 'Name',
              sample: 'Sample',
            },
          },
          title: 'Headings',
        },
        sizes: {
          sample: 'Example text shown in one font size to demonstrate size',
          table: {
            header: {
              name: 'Name',
              sample: 'Sample',
              value: 'Value',
            },
          },
          title: 'Font sizes',
        },
        title: 'Typography',
      },
    },
    title: 'Style guide',
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
          'accent-1': {
            docs: 'https://nldesignsystem.nl/handboek/huisstijl/themas/start-thema/#accent-1-accent-2-en-accent-3',
            label: 'Accent 1',
          },
          'accent-2': {
            docs: 'https://nldesignsystem.nl/handboek/huisstijl/themas/start-thema/#accent-1-accent-2-en-accent-3',
            label: 'Accent 2',
          },
          'accent-3': {
            docs: 'https://nldesignsystem.nl/handboek/huisstijl/themas/start-thema/#accent-1-accent-2-en-accent-3',
            label: 'Accent 3',
          },
          'action-1': {
            docs: 'https://nldesignsystem.nl/handboek/huisstijl/themas/start-thema/#action-1-en-action-2',
            label: 'Action 1',
          },
          'action-2': {
            docs: 'https://nldesignsystem.nl/handboek/huisstijl/themas/start-thema/#action-1-en-action-2',
            label: 'Action 2',
          },
          default: {
            docs: 'https://nldesignsystem.nl/handboek/huisstijl/themas/start-thema/#default',
            label: 'Default',
          },
          disabled: {
            docs: 'https://nldesignsystem.nl/handboek/huisstijl/themas/start-thema/#disabled',
            label: 'Disabled',
          },
          highlight: {
            docs: 'https://nldesignsystem.nl/handboek/huisstijl/themas/start-thema/#highlight--selected',
            label: 'Highlight',
          },
          info: {
            docs: 'https://nldesignsystem.nl/handboek/huisstijl/themas/start-thema/#info-negative-warning-positive',
            label: 'Info',
          },
          negative: {
            docs: 'https://nldesignsystem.nl/handboek/huisstijl/themas/start-thema/#info-negative-warning-positive',
            label: 'Negative',
          },
          positive: {
            docs: 'https://nldesignsystem.nl/handboek/huisstijl/themas/start-thema/#info-negative-warning-positive',
            label: 'Positive',
          },
          selected: {
            docs: 'https://nldesignsystem.nl/handboek/huisstijl/themas/start-thema/#highlight--selected',
            label: 'Selected',
          },
          warning: {
            docs: 'https://nldesignsystem.nl/handboek/huisstijl/themas/start-thema/#info-negative-warning-positive',
            label: 'Warning',
          },
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
  app: {
    title: 'Theme Wizard',
  },
  back: 'Terug',
  cancel: 'Annuleren',
  close: 'Sluiten',
  continue: 'Doorgaan',
  loading: 'Laden...',
  nav: {
    configure: 'Huisstijl bewerken',
    styleGuide: 'Stijlgids',
  },
  scraper: {
    input: {
      label: 'Website URL',
    },
    invalidUrl: 'Vul een valide URL in',
    scrapeFailed: `Kan "{{url}}" niet analyseren`,
    submit: 'Analyseer',
    success: 'Gereed, {{tokenCount}} tokens gevonden',
  },
  styleGuide: {
    sections: {
      colors: {
        table: {
          header: {
            name: 'Naam',
            hexCode: 'Hex code',
            sample: 'Voorbeeld',
          },
        },
        title: 'Kleuren',
      },
      space: {
        block: {
          sample: 'Voorbeeldelement getoond in de bijbehorende afmeting',
          title: 'Block',
        },
        column: {
          sample: 'Voorbeeldelement getoond in de bijbehorende afmeting',
          title: 'Column',
        },
        inline: {
          sample: 'Voorbeeldelement getoond in de bijbehorende afmeting',
          title: 'Inline',
        },
        row: {
          sample: 'Voorbeeldelement getoond in de bijbehorende afmeting',
          title: 'Row',
        },
        table: {
          header: {
            name: 'Naam',
            sample: 'Voorbeeld',
            value: 'Waarde',
          },
        },
        text: {
          sample: 'Voorbeeldelement getoond in de bijbehorende afmeting',
          title: 'Text',
        },
        title: 'Witruimte',
      },
      typography: {
        headings: {
          sample: 'Voorbeeldtekst met juiste lettergrootte, regelafstand en spatiering',
          table: {
            header: {
              name: 'Naam',
              sample: 'Voorbeeld',
            },
          },
          title: 'Headings',
        },
        sizes: {
          sample: 'Voorbeeldtekst in een font-size ter demonstratie van de grootte',
          table: {
            header: {
              name: 'Naam',
              sample: 'Voorbeeld',
              value: 'Waarde',
            },
          },
          title: 'Lettergroottes',
        },
        title: 'Typografie',
      },
    },
    title: 'Stijlgids',
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
          'accent-1': {
            docs: 'https://nldesignsystem.nl/handboek/huisstijl/themas/start-thema/#accent-1-accent-2-en-accent-3',
            label: 'Accent 1',
          },
          'accent-2': {
            docs: 'https://nldesignsystem.nl/handboek/huisstijl/themas/start-thema/#accent-1-accent-2-en-accent-3',
            label: 'Accent 2',
          },
          'accent-3': {
            docs: 'https://nldesignsystem.nl/handboek/huisstijl/themas/start-thema/#accent-1-accent-2-en-accent-3',
            label: 'Accent 3',
          },
          'action-1': {
            docs: 'https://nldesignsystem.nl/handboek/huisstijl/themas/start-thema/#action-1-en-action-2',
            label: 'Actie 1',
          },
          'action-2': {
            docs: 'https://nldesignsystem.nl/handboek/huisstijl/themas/start-thema/#action-1-en-action-2',
            label: 'Actie 2',
          },
          default: {
            docs: 'https://nldesignsystem.nl/handboek/huisstijl/themas/start-thema/#default',
            label: 'Standaard',
          },
          disabled: {
            docs: 'https://nldesignsystem.nl/handboek/huisstijl/themas/start-thema/#disabled',
            label: 'Uitgeschakeld',
          },
          highlight: {
            docs: 'https://nldesignsystem.nl/handboek/huisstijl/themas/start-thema/#highlight--selected',
            label: 'Markering',
          },
          info: {
            docs: 'https://nldesignsystem.nl/handboek/huisstijl/themas/start-thema/#info-negative-warning-positive',
            label: 'Info',
          },
          negative: {
            docs: 'https://nldesignsystem.nl/handboek/huisstijl/themas/start-thema/#info-negative-warning-positive',
            label: 'Negatief',
          },
          positive: {
            docs: 'https://nldesignsystem.nl/handboek/huisstijl/themas/start-thema/#info-negative-warning-positive',
            label: 'Positief',
          },
          selected: {
            docs: 'https://nldesignsystem.nl/handboek/huisstijl/themas/start-thema/#highlight--selected',
            label: 'Geselecteerd',
          },
          warning: {
            docs: 'https://nldesignsystem.nl/handboek/huisstijl/themas/start-thema/#info-negative-warning-positive',
            label: 'Waarschuwing',
          },
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
