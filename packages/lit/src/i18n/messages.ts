import { ERROR_CODES } from '@nl-design-system-community/design-tokens-schema';
import { html, TemplateResult } from 'lit';
import i18n from './';
import { ErrorRenderContext, I18nMessages } from './types';

const formatNumber = (value: number | undefined, locale: string): string => {
  if (value === undefined) return '';
  return new Intl.NumberFormat(locale, { maximumSignificantDigits: 3 }).format(value);
};

const createInsufficientContrastRenderers = (strings: {
  and: string;
  contrastLabel: string;
  errorLabel: string;
  minimumRequired: string;
}) => {
  return {
    compact(ctx: ErrorRenderContext): TemplateResult {
      const { details, renderTokenLink } = ctx;
      const tokens = details['tokens'] as string[];
      const tokenB = tokens[1];

      if (!renderTokenLink) {
        return html``;
      }

      const locale = i18n.locale();
      return html`<div>
        <p>${strings.errorLabel} <strong>${renderTokenLink(tokenB)}</strong></p>
        <p>
          ${strings.contrastLabel}: <strong>${formatNumber(details['actual'] as number | undefined, locale)}</strong>
        </p>
        <p>
          ${strings.minimumRequired}: <strong>${formatNumber(details['minimum'] as number | undefined, locale)}</strong>
        </p>
      </div>`;
    },
    detailed(ctx: ErrorRenderContext): TemplateResult {
      const { details, renderTokenLink } = ctx;
      const tokens = details['tokens'] as string[];
      const [tokenA, tokenB] = tokens;

      if (!renderTokenLink) {
        return html`<p>${tokenA} ${strings.and} ${tokenB}</p>`;
      }

      const locale = i18n.locale();
      const andText = ` ${strings.and} `;
      const renderedTokens = html`<strong>${renderTokenLink(tokenA)}</strong>${andText}
        <strong>${renderTokenLink(tokenB)}</strong>`;
      const renderedContrast = html`${strings.contrastLabel}:
        <strong>${formatNumber(details['actual'] as number | undefined, locale)}</strong>`;
      const renderedMinimum = html`${strings.minimumRequired}:
        <strong>${formatNumber(details['minimum'] as number | undefined, locale)}</strong>`;

      return html`
        ${renderedTokens}
        <ul>
          <li>${renderedContrast}</li>
          <li>${renderedMinimum}</li>
        </ul>
      `;
    },
  };
};

const createInvalidRefRenderers = (strings: { invalidReference: string }) => {
  return {
    compact(ctx: ErrorRenderContext): TemplateResult {
      return html`<p>${strings.invalidReference}: ${ctx.details['path']}</p>`;
    },
    detailed(ctx: ErrorRenderContext): TemplateResult {
      return html`<p>${ctx.details['path']}</p>`;
    },
  };
};

export const nl = {
  unknown: 'Onbekende fout opgetreden',
  validation: {
    error: {
      [ERROR_CODES.INSUFFICIENT_CONTRAST]: {
        ...createInsufficientContrastRenderers({
          and: 'en',
          contrastLabel: 'Contrast',
          errorLabel: 'Onvoldoende contrast met',
          minimumRequired: 'Minimaal vereist',
        }),
        label: 'Onvoldoende contrast',
      },
      [ERROR_CODES.INVALID_REF]: {
        ...createInvalidRefRenderers({
          invalidReference: 'Ongeldige referentie',
        }),
        label: 'Ongeldige referentie',
      },
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
        ...createInsufficientContrastRenderers({
          and: 'and',
          contrastLabel: 'Contrast',
          errorLabel: 'Insufficient contrast with',
          minimumRequired: 'required minimum',
        }),
        label: 'Insufficient contrast',
      },
      [ERROR_CODES.INVALID_REF]: {
        ...createInvalidRefRenderers({
          invalidReference: 'Invalid reference',
        }),
        label: 'Invalid reference',
      },
    },
    title: 'Theme validation errors',
    token_link: {
      aria_label: 'Jump to {{token}}',
    },
  },
} as const satisfies I18nMessages;
