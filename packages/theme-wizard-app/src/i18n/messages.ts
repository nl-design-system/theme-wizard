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
  colorDescription: {
    gray: 'gray',
    hue: {
      blue: 'blue',
      cyan: 'cyan',
      green: 'green',
      indigo: 'indigo',
      limeGreen: 'lime green',
      magenta: 'magenta',
      orange: 'orange',
      pink: 'pink',
      purple: 'purple',
      red: 'red',
      violet: 'violet',
      yellow: 'yellow',
    },
    lightness: {
      almostBlack: 'almost-black ',
      almostWhite: 'almost-white ',
      dark: 'dark ',
      light: 'light ',
      medium: '',
      slightlyDarker: 'slightly darker ',
      veryDark: 'very dark ',
      veryLight: 'very light ',
    },
    namedColors: {
      black: 'black',
      maroon: 'maroon',
      navyBlue: 'navy blue',
      oliveGreen: 'olive green',
      red: 'red',
      salmon: 'salmon',
      white: 'white',
    },
    saturation: {
      almostGray: 'almost grayish ',
      dull: 'dull ',
      fairlyBright: 'fairly vivid ',
      fairlyDeep: 'fairly deep ',
      gray: 'grayish ',
      somewhatDull: 'somewhat dull ',
      somewhatWashedOut: 'somewhat washed-out ',
      veryBright: 'very vivid ',
      veryDeep: 'very deep ',
      veryDull: 'very dull ',
      veryWashedOut: 'very washed-out ',
      washedOut: 'washed-out ',
    },
  },
  colors: {
    blue: 'blue',
    brown: 'brown',
    cyan: 'cyan',
    gray: 'gray',
    green: 'green',
    magenta: 'magenta',
    orange: 'orange',
    pink: 'pink',
    red: 'red',
    violet: 'violet',
    yellow: 'yellow',
  },
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
    otherLinks: {
      minifyTokens: 'Minify tokens',
      reuseTokens: 'Reuse tokens',
      validateTokens: 'Validate tokens',
    },
  },
  loading: 'Loading...',
  moreInformation: 'More information about {{text}}',
  moreInformationCompact: 'More information',
  nav: {
    components: 'Components',
    configure: 'Edit branding',
    styleGuide: 'Style guide',
    wizard: 'Start',
  },
  save: 'Save',
  scraper: {
    errors: {
      connectionRefused: 'This website does not seem to exist.',
      error: 'Cannot analyze this website',
      forbidden: 'This website does not allow analysis.',
      notFound: 'This website or webpage cannot be found.',
      timeOut: 'It takes too long for this website to respond.',
    },
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
    proceedWithoutScrape: 'Continue without fetching brand elements',
    scrapeFailed: 'Failed to scrape "{{url}}"',
    submit: 'Analyze',
    success: 'Done! Found {{tokenCount}} tokens.',
    title: 'Make your own theme',
  },
  stagedTokens: {
    count: 'Count',
    deleteToken: 'Delete',
    nothingFound: 'No tokens found.',
    preview: 'Preview',
    staged: 'Staged',
    title: 'Selected design tokens',
    type: 'Type',
    value: 'Value',
  },
  styleGuide: {
    colorSystem: {
      background: 'Background',
      border: 'Borders and lines',
      foreground: 'Foreground',
    },
    details: 'Details',
    detailsDialog: {
      copyToClipboard: 'Copy to clipboard: ',
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
  themePresetForm: {
    submit: 'Use theme',
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
  tokenMinifyForm: {
    downloadTokens: 'Download theme (JSON)',
    excludeParentKeys: {
      label: 'This is a source file (not generated by Style Dictionary).',
    },
    fileInput: {
      label: 'Add theme',
    },
    submit: 'Minify theme',
  },
  tokenReuseForm: {
    applySuggestions: {
      submit: 'Apply suggestions',
    },
    submit: 'Find reusable tokens',
    suggestions: {
      label: 'Suggested token reuse',
      notFound: 'No suggestions found',
      table: {
        header: {
          suggestedTokenPath: 'Suggested token',
          tokenPath: 'Token',
          tokenValue: 'Value',
        },
      },
    },
  },
  tokens: {
    backToOverview: 'Back to overview',
    fieldLabels: {
      basis: {
        'border-radius': { label: 'Border radius' },
        'border-width': { label: 'Border width' },
        color: {
          'accent-1': {
            docs: 'https://nldesignsystem.nl/handboek/huisstijl/basis-tokens/#accent-1-accent-2-en-accent-3',
            label: 'Accent 1',
          },
          'accent-2': {
            docs: 'https://nldesignsystem.nl/handboek/huisstijl/basis-tokens/#accent-1-accent-2-en-accent-3',
            label: 'Accent 2',
          },
          'accent-3': {
            docs: 'https://nldesignsystem.nl/handboek/huisstijl/basis-tokens/#accent-1-accent-2-en-accent-3',
            label: 'Accent 3',
          },
          'action-1': {
            docs: 'https://nldesignsystem.nl/handboek/huisstijl/basis-tokens/#action-1-en-action-2',
            label: 'Action 1',
          },
          'action-2': {
            docs: 'https://nldesignsystem.nl/handboek/huisstijl/basis-tokens/#action-1-en-action-2',
            label: 'Action 2',
          },
          default: {
            docs: 'https://nldesignsystem.nl/handboek/huisstijl/basis-tokens/#default',
            label: 'Default',
          },
          disabled: {
            docs: 'https://nldesignsystem.nl/handboek/huisstijl/basis-tokens/#disabled',
            label: 'Disabled',
          },
          highlight: {
            docs: 'https://nldesignsystem.nl/handboek/huisstijl/basis-tokens/#highlight--selected',
            label: 'Highlight',
          },
          info: {
            docs: 'https://nldesignsystem.nl/handboek/huisstijl/basis-tokens/#info-negative-warning-positive',
            label: 'Info',
          },
          negative: {
            docs: 'https://nldesignsystem.nl/handboek/huisstijl/basis-tokens/#info-negative-warning-positive',
            label: 'Negative',
          },
          positive: {
            docs: 'https://nldesignsystem.nl/handboek/huisstijl/basis-tokens/#info-negative-warning-positive',
            label: 'Positive',
          },
          selected: {
            docs: 'https://nldesignsystem.nl/handboek/huisstijl/basis-tokens/#highlight--selected',
            label: 'Selected',
          },
          warning: {
            docs: 'https://nldesignsystem.nl/handboek/huisstijl/basis-tokens/#info-negative-warning-positive',
            label: 'Warning',
          },
        },
        colors: 'Colors',
        space: {
          block: { label: 'Block' },
          column: { label: 'Column' },
          inline: { label: 'Inline' },
          row: { label: 'Row' },
          text: { label: 'Text' },
        },
        spacing: 'Spacing',
        text: {
          'font-family': {
            default: { label: 'Default' },
            monospace: { label: 'Monospace' },
          },
          'font-size': { label: 'Font size' },
          'font-weight': {
            bold: { label: 'Bold' },
            default: { label: 'Default' },
          },
          'line-height': { label: 'Line height' },
        },
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
      typography: 'Typography',
    },
  },
  tokenValidationForm: {
    downloadTokens: 'Download theme (JSON)',
    excludeParentKeys: {
      label: 'This is a source file (not generated by Style Dictionary).',
    },
    fileInput: {
      label: 'Add theme',
    },
    result: {
      errors: ({ count }: { count: number }) =>
        count === 1 ? 'Bummer, 1 error found' : `Bummer, ${count} errors found`,
      label: 'Validation result',
      noErrors: 'Hurray, no errors found!',
    },
    submit: 'Validate theme',
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
      [ERROR_CODES.UNEXPECTED_UNIT]: {
        compact: (issue: ValidationIssue & { renderTokenLink?: TokenLinkRenderer }): TemplateResult =>
          html`${t('validation.issue.unexpectedUnit', {
            context: issue.renderTokenLink,
            token: issue.referredToken,
          })}.`,
        detailed: (issue: ValidationIssue & { renderTokenLink?: TokenLinkRenderer }): TemplateResult => {
          return html`${issue.path}:
          ${t('validation.issue.unexpectedUnit', {
            context: issue.renderTokenLink,
            token: issue.referredToken,
          })}.`;
        },
        label: 'Unexpected unit.',
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
      unexpectedUnit: 'Unexpected unit. Use a plain number instead.',
    },
    title: 'Theme validation errors',
    token_link: {
      aria_label: 'Jump to {{token}}',
    },
  },
  wizard: {
    starterPicker: {
      groupLabel: 'How do you want to start?',
      json: {
        name: 'Start with JSON',
        description: 'Upload an existing design tokens JSON file.',
      },
      startTheme: {
        name: 'Start Theme',
        description: 'Start from the default Start Theme.',
      },
      submit: 'Next step',
      url: {
        name: 'Start from a URL',
        description: 'Scrape an existing website for its design tokens.',
      },
    },
    stepForm: {
      errorNoToken: 'Error: no token at path {{path}}, make sure to use a correct token path.',
      foundScrapedValues: 'Found values on website',
      foundThemeValues: 'Suggested values',
      noRecommendations: 'No recommendations to show.',
      sample: {
        button: 'Example button',
        heading: 'Example of a heading.',
        paragraph: 'Example text. The quick brown fox jumps over the lazy dog.',
        preview: {
          alert: {
            error: {
              heading: 'Example: something went wrong',
            },
            info: {
              heading: 'Example: for your information',
            },
            paragraph:
              'This is example text a user might see. We could add more text here to take up more space if needed.',
            positive: {
              heading: 'Example: that worked',
            },
            warning: {
              heading: 'Example: watch out',
            },
          },
          button: 'Click me!',
          link: {
            linkText: 'a link',
            prefix: 'Example text with',
            suffix: 'you can click on.',
          },
        },
      },
      showFewerTokens: 'Show fewer options',
      showMoreTokens: 'Show all options ({{tokenCount}})',
    },
    taskNavigation: {
      done: 'Task completed',
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
  colorDescription: {
    gray: 'grijs',
    hue: {
      blue: 'blauw',
      cyan: 'cyaan',
      green: 'groen',
      indigo: 'indigo',
      limeGreen: 'limoengroen',
      magenta: 'magenta',
      orange: 'oranje',
      pink: 'roze',
      purple: 'paars',
      red: 'rood',
      violet: 'violet',
      yellow: 'geel',
    },
    lightness: {
      almostBlack: 'bijna zwarte ',
      almostWhite: 'bijna witte ',
      dark: 'donker',
      light: 'licht',
      medium: '',
      slightlyDarker: 'iets donkerder ',
      veryDark: 'heel donker ',
      veryLight: 'heel licht ',
    },
    namedColors: {
      black: 'zwart',
      maroon: 'kastanjebruin',
      navyBlue: 'marineblauw',
      oliveGreen: 'olijfgroen',
      red: 'rood',
      salmon: 'zalm',
      white: 'wit',
    },
    saturation: {
      almostGray: 'bijna grijze ',
      dull: 'doffe ',
      fairlyBright: 'tamelijk heldere ',
      fairlyDeep: 'tamelijk diepe ',
      gray: 'grijze ',
      somewhatDull: 'enigszins doffe ',
      somewhatWashedOut: 'enigszins fletse ',
      veryBright: 'erg heldere ',
      veryDeep: 'erg diepe ',
      veryDull: 'erg doffe ',
      veryWashedOut: 'erg fletse ',
      washedOut: 'fletse ',
    },
  },
  colors: {
    blue: 'blauw',
    brown: 'bruin',
    cyan: 'cyaan',
    gray: 'grijs',
    green: 'groen',
    magenta: 'magenta',
    orange: 'oranje',
    pink: 'roze',
    red: 'rood',
    violet: 'violet',
    yellow: 'geel',
  },
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
    otherLinks: {
      minifyTokens: 'Verklein tokens',
      reuseTokens: 'Hergebruik tokens',
      validateTokens: 'Valideer tokens',
    },
  },
  loading: 'Laden...',
  moreInformation: 'Meer informatie over {{text}}',
  moreInformationCompact: 'Meer informatie',
  nav: {
    components: 'Componenten',
    configure: 'Huisstijl bewerken',
    styleGuide: 'Stijlgids',
    wizard: 'Start',
  },
  save: 'Opslaan',
  scraper: {
    errors: {
      connectionRefused: 'Deze website lijkt niet te bestaan.',
      error: 'Kan deze website niet analyseren',
      forbidden: 'Deze website staat niet toe om geanalyseerd te worden.',
      notFound: 'Deze pagina kan niet worden gevonden.',
      timeOut: 'Deze website reageert te langzaam om te kunnen analyseren',
    },
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
    proceedWithoutScrape: 'Doorgaan zonder huisstijl ophalen',
    scrapeFailed: 'Kan "{{url}}" niet analyseren.',
    submit: 'Huisstijl ophalen',
    success: 'Gereed, {{tokenCount}} tokens gevonden',
    title: 'Maak je eigen thema',
  },
  stagedTokens: {
    count: 'Aantal',
    deleteToken: 'Verwijder',
    nothingFound: 'Geen ontwerpkeuzes gevonden.',
    preview: 'Voorvertoning',
    staged: 'Geselecteerd',
    title: 'Geselecteerde design tokens',
    type: 'Type',
    value: 'Waarde',
  },
  styleGuide: {
    colorSystem: {
      background: 'Achtergrond',
      border: 'Randen en lijnen',
      foreground: 'Voorgrond',
    },
    details: 'Details',
    detailsDialog: {
      copyToClipboard: 'Kopieer naar klembord: ',
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
  themePresetForm: {
    submit: 'Thema gebruiken',
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
  tokenMinifyForm: {
    downloadTokens: 'Thema downloaded (JSON)',
    excludeParentKeys: {
      label: 'Dit is een bronbestand (niet gegenereerd door Style Dictionary).',
    },
    fileInput: {
      label: 'Thema toevoegen',
    },
    submit: 'Verklein thema',
  },
  tokenReuseForm: {
    applySuggestions: {
      submit: 'Suggesties toepassen',
    },
    submit: 'Herbruikbare tokens zoeken',
    suggestions: {
      label: 'Suggesties voor hergebruik',
      notFound: 'Geen suggesties gevonden',
      table: {
        header: {
          suggestedTokenPath: 'Voorgestelde token',
          tokenPath: 'Token',
          tokenValue: 'Waarde',
        },
      },
    },
  },
  tokens: {
    backToOverview: 'Terug naar overzicht',
    fieldLabels: {
      basis: {
        'border-radius': { label: 'Afgeronde hoeken' },
        'border-width': { label: 'Kader- of lijndikte' },
        color: {
          'accent-1': {
            docs: 'https://nldesignsystem.nl/handboek/huisstijl/basis-tokens/#accent-1-accent-2-en-accent-3',
            label: 'Accent 1',
          },
          'accent-2': {
            docs: 'https://nldesignsystem.nl/handboek/huisstijl/basis-tokens/#accent-1-accent-2-en-accent-3',
            label: 'Accent 2',
          },
          'accent-3': {
            docs: 'https://nldesignsystem.nl/handboek/huisstijl/basis-tokens/#accent-1-accent-2-en-accent-3',
            label: 'Accent 3',
          },
          'action-1': {
            docs: 'https://nldesignsystem.nl/handboek/huisstijl/basis-tokens/#action-1-en-action-2',
            label: 'Actie 1',
          },
          'action-2': {
            docs: 'https://nldesignsystem.nl/handboek/huisstijl/basis-tokens/#action-1-en-action-2',
            label: 'Actie 2',
          },
          default: {
            docs: 'https://nldesignsystem.nl/handboek/huisstijl/basis-tokens/#default',
            label: 'Standaard',
          },
          disabled: {
            docs: 'https://nldesignsystem.nl/handboek/huisstijl/basis-tokens/#disabled',
            label: 'Uitgeschakeld',
          },
          highlight: {
            docs: 'https://nldesignsystem.nl/handboek/huisstijl/basis-tokens/#highlight--selected',
            label: 'Markering',
          },
          info: {
            docs: 'https://nldesignsystem.nl/handboek/huisstijl/basis-tokens/#info-negative-warning-positive',
            label: 'Info',
          },
          negative: {
            docs: 'https://nldesignsystem.nl/handboek/huisstijl/basis-tokens/#info-negative-warning-positive',
            label: 'Negatief',
          },
          positive: {
            docs: 'https://nldesignsystem.nl/handboek/huisstijl/basis-tokens/#info-negative-warning-positive',
            label: 'Positief',
          },
          selected: {
            docs: 'https://nldesignsystem.nl/handboek/huisstijl/basis-tokens/#highlight--selected',
            label: 'Geselecteerd',
          },
          warning: {
            docs: 'https://nldesignsystem.nl/handboek/huisstijl/basis-tokens/#info-negative-warning-positive',
            label: 'Waarschuwing',
          },
        },
        colors: 'Kleuren',
        space: {
          block: { label: 'Block' },
          column: { label: 'Column' },
          inline: { label: 'Inline' },
          row: { label: 'Row' },
          text: { label: 'Text' },
        },
        spacing: 'Witruimte',
        text: {
          'font-family': {
            default: { label: 'Standaard' },
            monospace: { label: 'Monospace' },
          },
          'font-size': { label: 'Lettergrootte' },
          'font-weight': {
            bold: { label: 'Vet' },
            default: { label: 'Standaard' },
          },
          'line-height': { label: 'Regelhoogte' },
        },
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
      typography: 'Typografie',
    },
  },
  tokenValidationForm: {
    downloadTokens: 'Download thema (JSON)',
    excludeParentKeys: {
      label: 'Dit is een bronbestand (niet gegenereerd door Style Dictionary).',
    },
    fileInput: {
      label: 'Thema toevoegen',
    },
    result: {
      errors: ({ count }: { count: number }) =>
        count === 1 ? 'Helaas, 1 fout gevonden' : `Helaas, ${count} fouten gevonden`,
      label: 'Validatieresultaat',
      noErrors: 'Hoera, geen fouten gevonden!',
    },
    submit: 'Valideer thema',
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
      [ERROR_CODES.UNEXPECTED_UNIT]: {
        compact: (issue: ValidationIssue & { renderTokenLink?: TokenLinkRenderer }): TemplateResult =>
          html`${t('validation.issue.unexpectedUnit', {
            context: issue.renderTokenLink,
            token: issue.referredToken,
          })}.`,
        detailed: (issue: ValidationIssue & { renderTokenLink?: TokenLinkRenderer }): TemplateResult => {
          return html`${issue.path}:
          ${t('validation.issue.unexpectedUnit', {
            context: issue.renderTokenLink,
            token: issue.referredToken,
          })}.`;
        },
        label: 'Onverwachte eenheid',
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
      unexpectedUnit: 'Onverwachte eenheid. Gebruik alleen nummers',
    },
    title: 'Thema validatie fouten',
    token_link: {
      aria_label: 'Spring naar {{token}}',
    },
  },
  wizard: {
    starterPicker: {
      groupLabel: 'Hoe wil je starten?',
      json: {
        name: 'Met een eigen thema',
        description: 'Upload je eigen JSON bestand.',
      },
      startTheme: {
        name: 'Met het Start Thema',
        description: 'Start met het Start Thema en pas aan waar nodig.',
      },
      submit: 'Volgende stap',
      url: {
        name: 'Met de huisstijl van een bestaande website',
        description: 'Vul een URL in.',
      },
    },
    stepForm: {
      errorNoToken: 'Error: geen token op pad {{path}}, zorg dat er een token bestaat op dit pad.',
      foundScrapedValues: 'Gevonden waardes op website',
      foundThemeValues: 'Voorgestelde waardes',
      noRecommendations: 'Geen aanbevelingen om te tonen.',
      sample: {
        button: 'Voorbeeld van knop',
        heading: 'Voorbeeld van een koptekst.',
        paragraph: 'Voorbeeld van een tekst. Op brute wijze ving de schooljuf de quasi-kalme lynx.',
        preview: {
          alert: {
            error: {
              heading: 'Voorbeeld: er ging iets fout',
            },
            info: {
              heading: 'Voorbeeld: ter informatie',
            },
            paragraph:
              'Dit is een voorbeeldtekst die een gebruiker zou kunnen zien. Eventueel zouden we deze tekst kunnen aanvullen om meer ruimte in te nemen.',
            positive: {
              heading: 'Voorbeeld: het is gelukt',
            },
            warning: {
              heading: 'Voorbeeld: let op',
            },
          },
          button: 'Klik mij!',
          link: {
            linkText: 'een link',
            prefix: 'Voorbeeldtekst met',
            suffix: 'die je kunt aanklikken.',
          },
        },
      },
      showFewerTokens: 'Toon minder opties',
      showMoreTokens: 'Toon meer opties ({{tokenCount}})',
    },
    taskNavigation: {
      done: 'Taak afgerond',
    },
  },
} satisfies typeof en;
