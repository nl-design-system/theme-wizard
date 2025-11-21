import { ERROR_CODES } from '@nl-design-system-community/design-tokens-schema';
import { html, TemplateResult } from 'lit';
import i18n from './';
import { ErrorRenderContext, I18nMessages } from './types';

const formatNumber = (value: number | undefined, locale: string): string => {
  if (value === undefined) return '';
  return new Intl.NumberFormat(locale, { maximumSignificantDigits: 3 }).format(value);
};

export const nl = {
  unknown: 'Onbekende fout opgetreden',
  validation: {
    error: {
      [ERROR_CODES.INSUFFICIENT_CONTRAST]: {
        compact(ctx: ErrorRenderContext): TemplateResult {
          const { details, renderTokenLink } = ctx;
          const tokens = details['tokens'] as string[];
          const tokenB = tokens[1];

          if (!renderTokenLink) {
            return html``;
          }

          const locale = i18n.locale();
          return html`<div>
            <p>Onvoldoende contrast met <strong>${renderTokenLink(tokenB)}</strong></p>
            <p>Contrast: <strong>${formatNumber(details['actual'] as number | undefined, locale)}</strong></p>
            <p>Minimaal vereist: <strong>${formatNumber(details['minimum'] as number | undefined, locale)}</strong></p>
          </div>`;
        },
        detailed(ctx: ErrorRenderContext): TemplateResult {
          const { details, renderTokenLink } = ctx;
          const tokens = details['tokens'] as string[];
          const [tokenA, tokenB] = tokens;

          if (!renderTokenLink) {
            return html`<p>${tokenA} en ${tokenB}</p>`;
          }

          const locale = i18n.locale();
          return html`
            <strong>${renderTokenLink(tokenA)}</strong> en <strong>${renderTokenLink(tokenB)}</strong>
            <ul>
              <li>Contrast: <strong>${formatNumber(details['actual'] as number | undefined, locale)}</strong></li>
              <li>
                Minimaal vereist: <strong>${formatNumber(details['minimum'] as number | undefined, locale)}</strong>
              </li>
            </ul>
          `;
        },
        label: 'Onvoldoende contrast',
      },
      [ERROR_CODES.INVALID_REF]: {
        compact(ctx: ErrorRenderContext): TemplateResult {
          return html`<p>Ongeldige referentie: ${ctx.details['path']}</p>`;
        },
        detailed(ctx: ErrorRenderContext): TemplateResult {
          return html`<p>${ctx.details['path']}</p>`;
        },
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
        compact(ctx: ErrorRenderContext): TemplateResult {
          const { details, renderTokenLink } = ctx;
          const tokens = details['tokens'] as string[];
          const tokenB = tokens[1];

          if (!renderTokenLink) {
            return html``;
          }

          const locale = i18n.locale();
          return html`<div>
            <p>Insufficient contrast with <strong>${renderTokenLink(tokenB)}</strong></p>
            <p>Contrast: <strong>${formatNumber(details['actual'] as number | undefined, locale)}</strong></p>
            <p>required minimum: <strong>${formatNumber(details['minimum'] as number | undefined, locale)}</strong></p>
          </div>`;
        },
        detailed(ctx: ErrorRenderContext): TemplateResult {
          const { details, renderTokenLink } = ctx;
          const tokens = details['tokens'] as string[];
          const [tokenA, tokenB] = tokens;

          if (!renderTokenLink) {
            return html`<p>${tokenA} and ${tokenB}</p>`;
          }

          const locale = i18n.locale();
          return html`
            <strong>${renderTokenLink(tokenA)}</strong> and <strong>${renderTokenLink(tokenB)}</strong>
            <ul>
              <li>Contrast: <strong>${formatNumber(details['actual'] as number | undefined, locale)}</strong></li>
              <li>
                required minimum: <strong>${formatNumber(details['minimum'] as number | undefined, locale)}</strong>
              </li>
            </ul>
          `;
        },
        label: 'Insufficient contrast',
      },
      [ERROR_CODES.INVALID_REF]: {
        compact(ctx: ErrorRenderContext): TemplateResult {
          return html`<p>Invalid reference: ${ctx.details['path']}</p>`;
        },
        detailed(ctx: ErrorRenderContext): TemplateResult {
          return html`<p>${ctx.details['path']}</p>`;
        },
        label: 'Invalid reference',
      },
    },
    title: 'Theme validation errors',
    token_link: {
      aria_label: 'Jump to {{token}}',
    },
  },
} as const satisfies I18nMessages;
