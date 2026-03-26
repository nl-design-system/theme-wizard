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
  copyToClipboard: 'Copy to clipboard',
  copyValueToClipboard: ({ value }: { value: string }) => `Copy "${value}" to clipboard`,
  display: 'Display',
  footer: {
    colophon: {
      about: html`The Theme Wizard is developed by the Expert team Digital Accessibility as part of
        <a href="https://nldesignsystem.nl">NL Design System</a>.`,
      accessibilityStatement: 'Accessbility',
      contact: 'Contact',
      privacyStatement: 'Privacy statement',
    },
  },
  loading: 'Loading...',
  moreInformation: 'More information about {{text}}',
  moreInformationCompact: 'More information',
  nav: {
    components: 'Components',
    configure: 'Edit branding',
    styleGuide: 'Style guide',
  },
  save: 'Save',
  scraper: {
    directStart: html`Begin directly with <a href="/basis-tokens" class="nl-link">basic tokens</a>.`,
    input: {
      description: 'E.g. gemeentevoorbeeld.nl',
      label: 'Website URL',
    },
    intro: 'Use the Theme Wizard to easily make an NL Design System theme for your organisation.',
    invalidUrl: 'Please fill in a valid URL',
    loaders: {
      loader1: {
        heading: 'Typography',
        text: 'Fetching styles from {{url}}',
      },
      loader2: {
        heading: 'Colors',
        text: 'Fetching styles from {{url}}',
      },
    },
    scrapeFailed: `Failed to scrape "{{url}}"`,
    submit: 'Analyze',
    success: 'Done! Found {{tokenCount}} tokens.',
    title: 'Make your own theme',
  },
  stagedTokens: {
    count: 'Count',
    deleteToken: 'Delete',
    preview: 'Preview',
    staged: 'Staged',
    title: 'Selected design tokens',
    type: 'Type',
    value: 'Value',
  },
  styleGuide: {
    details: 'Details',
    detailsDialog: {
      tokenReferenceList: {
        empty: 'This token is unused',
        title: 'Where is this token used?',
      },
    },
    reference: 'Reference',
    sample: 'Sample',
    sections: {
      colors: {
        table: {
          header: {
            hexCode: 'Hex code',
          },
        },
        title: 'Colors',
      },
      components: {
        title: 'Components',
      },
      space: {
        block: {
          title: 'Block',
        },
        column: {
          title: 'Column',
        },
        inline: {
          title: 'Inline',
        },
        row: {
          title: 'Row',
        },
        sample: 'Example element shown in complementary size',
        text: {
          sample: 'Voorbeeldelement getoond in de bijbehorende afmeting',
          title: 'Text',
        },
        title: 'Spacing',
      },
      typography: {
        families: {
          sample: 'Example text rendered in corresponding font-family',
          title: 'Font families',
        },
        headings: {
          sample: 'Example heading to show size, line height and weight',
          title: 'Headings',
        },
        sizes: {
          sample: 'Example text shown in one font size to demonstrate size',
          title: 'Font sizes',
        },
        title: 'Typography',
      },
    },
    showDetails: 'Show details',
    title: 'Style guide',
    tokenName: 'Name',
    value: 'Value',
  },
  themeResetDialog: {
    body: 'Are you sure you want to reset all token values to their defaults? This cannot be undone.',
    cancel: () => t('cancel'),
    confirm: 'Reset theme',
    title: 'Reset theme',
    triggerText: 'Start over',
  },
  tokenDownloadCss: {
    triggerText: 'Download CSS',
  },
  tokenDownloadDialog: {
    body: 'There are still errors in your theme. This may lead to issues with readability, contrast, or consistency. Do you still want to download the tokens?',
    cancel: () => t('cancel'),
    downloadAnyway: 'Download anyway',
    title: 'Theme contains errors',
    triggerText: 'Download tokens as JSON',
  },
  tokens: {
    backToOverview: 'Back to overview',
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
        colors: 'Colors',
        spacing: 'Spacing',
        typography: 'Typography',
      },
      bodyFont: 'Running text',
      headingFont: 'Headings',
    },
    showOnGoogleFonts: 'Show on Google Fonts',
    types: {
      color: 'Color',
      colors: 'Colors',
      fontFamilies: 'Font families',
      fontFamily: 'Font family',
      fontSize: 'Font size',
      fontSizes: 'Font sizes',
    },
  },
  unknown: 'Unknown error',
  validation: {
    error: {
      [ERROR_CODES.FONT_SIZE_TOO_SMALL]: {
        compact: (issue: ValidationIssue & { renderTokenLink?: TokenLinkRenderer }): TemplateResult =>
          html`${t('validation.issue.fontSizeTooSmall', {
            context: issue.renderTokenLink,
            token: issue.referredToken,
          })}.
          ${t('validation.issue.fontSizeValue', { value: issue.actual })}.
          ${t('validation.issue.minimalNeeded', { value: issue.minimum })}`,
        detailed: (issue: ValidationIssue & { renderTokenLink?: TokenLinkRenderer }): TemplateResult => {
          return html`${issue.path}:
          ${t('validation.issue.fontSizeTooSmall', {
            context: issue.renderTokenLink,
            token: issue.referredToken,
          })}.
          ${t('validation.issue.fontSizeValue', { value: issue.actual })}.
          ${t('validation.issue.minimalNeeded', { value: issue.minimum })}.`;
        },
        label: 'Font size too small',
      },

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
      [ERROR_CODES.LINE_HEIGHT_TOO_SMALL]: {
        compact: (issue: ValidationIssue & { renderTokenLink?: TokenLinkRenderer }): TemplateResult =>
          html`${t('validation.issue.lineHeightTooSmall', {
            context: issue.renderTokenLink,
            token: issue.referredToken,
          })}.
          ${t('validation.issue.lineHeight', { value: issue.actual })}.
          ${t('validation.issue.minimalNeeded', { value: issue.minimum })}`,
        detailed: (issue: ValidationIssue & { renderTokenLink?: TokenLinkRenderer }): TemplateResult => {
          return html`${issue.path}:
          ${t('validation.issue.lineHeightTooSmall', {
            context: issue.renderTokenLink,
            token: issue.referredToken,
          })}.
          ${t('validation.issue.lineHeight', { value: issue.actual })}.
          ${t('validation.issue.minimalNeeded', { value: issue.minimum })}.`;
        },
        label: 'Lettergrootte te klein',
      },
    },
    issue: {
      contrastValue: 'Contrast: {{value}}',
      fontSizeTooSmall: ({ context, token }: { context?: TokenLinkRenderer; token: string }) => {
        const guidelinesLink = html`
          <a href="https://nldesignsystem.nl/richtlijnen/stijl/typografie/lettergrootte/" target="_blank">
            View guidelines
          </a>
        `;
        if (!token) return html`Font size is too small. ${guidelinesLink}`;

        const tokenLink = context ? context(token) : html`<strong>${token}</strong>`;
        return html`Font size is too small in ${tokenLink}. ${guidelinesLink}`;
      },
      fontSizeValue: 'Font size: {{value}}',
      invalidContrastWith: ({ context, token }: { context?: TokenLinkRenderer; token: string }) => {
        if (!token) return html`Insufficient contrast`;

        const tokenLink = context ? context(token) : html`<strong>${token}</strong>`;
        return html`Insufficient contrast with ${tokenLink}`;
      },
      lineHeight: 'Line height: {{value}}',
      lineHeightTooSmall: ({ context, token }: { context?: TokenLinkRenderer; token: string }) => {
        const guidelinesLink = html`
          <a
            href="https://nldesignsystem.nl/richtlijnen/stijl/typografie/regelafstand/#zorg-voor-een-comfortabele-regelafstand"
            target="_blank"
          >
            View guidelines
          </a>
        `;
        if (!token) return html`Line height too small. ${guidelinesLink}`;

        const tokenLink = context ? context(token) : html`<strong>${token}</strong>`;
        return html`Line height too small in ${tokenLink}. ${guidelinesLink}`;
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
  copyToClipboard: 'Kopieer naar klembord',
  copyValueToClipboard: ({ value }: { value: string }) => `Kopieer "${value}" naar klembord`,
  display: 'Weergave',
  footer: {
    colophon: {
      about: html`De Theme Wizard is ontwikkeld door het Expertteam Digitale Toegankelijkheid in opdracht van
        <a href="https://nldesignsystem.nl">NL Design System</a>.`,
      accessibilityStatement: 'Toegankelijkheid',
      contact: 'Contact',
      privacyStatement: 'Privacyverklaring',
    },
  },
  loading: 'Laden...',
  moreInformation: 'Meer informatie over {{text}}',
  moreInformationCompact: 'Meer informatie',
  nav: {
    components: 'Componenten',
    configure: 'Huisstijl bewerken',
    styleGuide: 'Stijlgids',
  },
  save: 'Opslaan',
  scraper: {
    directStart: html`Begin direct met <a href="/basis-tokens" class="nl-link">basis tokens</a>.`,
    input: {
      description: 'Bijvoorbeeld gemeentevoorbeeld.nl',
      label: 'Website URL',
    },
    intro: 'Met de Theme Wizard maak je gemakkelijk een NL Design System thema voor jouw organisatie.',
    invalidUrl: 'Vul een valide URL in',
    loaders: {
      loader1: {
        heading: 'Typografie',
        text: 'Huisstijl ophalen van {{url}}',
      },
      loader2: {
        heading: 'Kleuren',
        text: 'Huisstijl ophalen van {{url}}',
      },
    },
    scrapeFailed: `Kan "{{url}}" niet analyseren.`,
    submit: 'Huisstijl ophalen',
    success: 'Gereed, {{tokenCount}} tokens gevonden',
    title: 'Maak je eigen thema',
  },
  stagedTokens: {
    count: 'Aantal',
    deleteToken: 'Verwijder',
    preview: 'Voorvertoning',
    staged: 'Geselecteerd',
    title: 'Geselecteerde design tokens',
    type: 'Type',
    value: 'Waarde',
  },
  styleGuide: {
    details: 'Details',
    detailsDialog: {
      tokenReferenceList: {
        empty: 'Deze token wordt niet gebruikt',
        title: 'Waar wordt deze token gebruikt?',
      },
    },
    reference: 'Referentie',
    sample: 'Voorbeeld',
    sections: {
      colors: {
        table: {
          header: {
            hexCode: 'Hex code',
          },
        },
        title: 'Kleuren',
      },
      components: {
        title: 'Componenten',
      },
      space: {
        block: {
          title: 'Block',
        },
        column: {
          title: 'Column',
        },
        inline: {
          title: 'Inline',
        },
        row: {
          title: 'Row',
        },
        sample: 'Voorbeeldelement getoond in de bijbehorende afmeting',
        text: {
          sample: 'Voorbeeldelement getoond in de bijbehorende afmeting',
          title: 'Text',
        },
        title: 'Witruimte',
      },
      typography: {
        families: {
          sample: 'Voorbeeldtekst van de juiste font-family',
          title: 'Font families',
        },
        headings: {
          sample: 'Voorbeeldtekst met juiste lettergrootte, regelafstand en spatiering',
          title: 'Headings',
        },
        sizes: {
          sample: 'Voorbeeldtekst in een font-size ter demonstratie van de grootte',
          title: 'Lettergroottes',
        },
        title: 'Typografie',
      },
    },
    showDetails: 'Toon details',
    title: 'Stijlgids',
    tokenName: 'Naam',
    value: 'Waarde',
  },
  themeResetDialog: {
    body: 'Weet je zeker dat je alle tokenwaarden wilt terugzetten naar de standaardwaarden? Dit kan niet ongedaan worden gemaakt.',
    cancel: () => t('cancel'),
    confirm: 'Opnieuw beginnen',
    title: 'Opnieuw beginnen',
    triggerText: 'Begin opnieuw',
  },
  tokenDownloadCss: {
    triggerText: 'Thema downloaden (CSS)',
  },
  tokenDownloadDialog: {
    body: 'Er zijn nog fouten gevonden in je thema. Dit kan leiden tot problemen met leesbaarheid, contrast of consistentie. Wil je de tokens toch downloaden?',
    cancel: () => t('cancel'),
    downloadAnyway: 'Toch downloaden',
    title: 'Thema bevat nog fouten',
    triggerText: 'Thema downloaden (JSON)',
  },
  tokens: {
    backToOverview: 'Terug naar overzicht',
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
        colors: 'Kleuren',
        spacing: 'Witruimte',
        typography: 'Typografie',
      },
      bodyFont: 'Lopende tekst',
      headingFont: 'Koppen',
    },
    showOnGoogleFonts: 'Toon op Google Fonts',
    types: {
      color: 'Kleur',
      colors: 'Kleuren',
      fontFamilies: 'Lettertypes',
      fontFamily: 'Lettertype',
      fontSize: 'Lettergrootte',
      fontSizes: 'Lettergroottes',
    },
  },
  unknown: 'Onbekende fout opgetreden',
  validation: {
    error: {
      [ERROR_CODES.FONT_SIZE_TOO_SMALL]: {
        compact: (issue: ValidationIssue & { renderTokenLink?: TokenLinkRenderer }): TemplateResult =>
          html`${t('validation.issue.fontSizeTooSmall', {
            context: issue.renderTokenLink,
            token: issue.referredToken,
          })}.
          ${t('validation.issue.fontSizeValue', { value: issue.actual })}.
          ${t('validation.issue.minimalNeeded', { value: issue.minimum })}`,
        detailed: (issue: ValidationIssue & { renderTokenLink?: TokenLinkRenderer }): TemplateResult => {
          return html`${issue.path}:
          ${t('validation.issue.fontSizeTooSmall', {
            context: issue.renderTokenLink,
            token: issue.referredToken,
          })}.
          ${t('validation.issue.fontSizeValue', { value: issue.actual })}.
          ${t('validation.issue.minimalNeeded', { value: issue.minimum })}.`;
        },
        label: 'Lettergrootte te klein',
      },
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
      [ERROR_CODES.LINE_HEIGHT_TOO_SMALL]: {
        compact: (issue: ValidationIssue & { renderTokenLink?: TokenLinkRenderer }): TemplateResult =>
          html`${t('validation.issue.lineHeightTooSmall', {
            context: issue.renderTokenLink,
            token: issue.referredToken,
          })}.
          ${t('validation.issue.lineHeight', { value: issue.actual })}.
          ${t('validation.issue.minimalNeeded', { value: issue.minimum })}`,
        detailed: (issue: ValidationIssue & { renderTokenLink?: TokenLinkRenderer }): TemplateResult => {
          return html`${issue.path}:
          ${t('validation.issue.lineHeightTooSmall', {
            context: issue.renderTokenLink,
            token: issue.referredToken,
          })}.
          ${t('validation.issue.lineHeight', { value: issue.actual })}.
          ${t('validation.issue.minimalNeeded', { value: issue.minimum })}.`;
        },
        label: 'Lettergrootte te klein',
      },
    },
    issue: {
      contrastValue: 'Contrast: {{value}}',
      fontSizeTooSmall: ({ context, token }: { context?: TokenLinkRenderer; token: string }) => {
        const guidelinesLink = html`<a
          href="https://nldesignsystem.nl/richtlijnen/stijl/typografie/lettergrootte"
          target="_blank"
          >Bekijk richtlijnen</a
        >`;
        if (!token) return html`Lettergrootte is te klein. ${guidelinesLink}`;

        const tokenLink = context ? context(token) : html`<strong>${token}</strong>`;
        return html`Lettergrootte is te klein in ${tokenLink}. ${guidelinesLink}`;
      },
      fontSizeValue: 'Lettergrootte: {{value}}',
      invalidContrastWith: ({ context, token }: { context?: TokenLinkRenderer; token: string }) => {
        if (!token) return html`Onvoldoende contrast`;

        const tokenLink = context ? context(token) : html`<strong>${token}</strong>`;
        return html`Onvoldoende contrast met ${tokenLink}`;
      },
      lineHeight: 'Regelafstand: {{value}}',
      lineHeightTooSmall: ({ context, token }: { context?: TokenLinkRenderer; token: string }) => {
        const guidelinesLink = html`<a
          href="https://nldesignsystem.nl/richtlijnen/stijl/typografie/regelafstand/#zorg-voor-een-comfortabele-regelafstand"
          target="_blank"
          >Bekijk richtlijnen</a
        >`;
        if (!token) return html`Regelafstand is te klein. ${guidelinesLink}`;

        const tokenLink = context ? context(token) : html`<strong>${token}</strong>`;
        return html`Regelafstand is te klein in ${tokenLink}. ${guidelinesLink}`;
      },
      minimalNeeded: ({ value }: { value: string }) => html`Minimaal vereist: <strong>${value}</strong>`,
    },

    title: 'Thema validatie fouten',
    token_link: {
      aria_label: 'Spring naar {{token}}',
    },
  },
} satisfies typeof en;
