import { ERROR_CODES } from '@nl-design-system-community/design-tokens-schema';
import { html, TemplateResult, nothing } from 'lit';
import rosetta from 'rosetta';
import ValidationIssue, { type RenderOptions } from '../lib/ValidationIssue';

export interface ErrorRenderContext {
  details: Record<string, unknown>;
  renderTokenLink?: (tokenPath: string) => TemplateResult;
}

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

      return html`<div>
        <p>${strings.errorLabel} <strong>${renderTokenLink(tokenB)}</strong></p>
        <p>${strings.contrastLabel}: <strong>${details['current']}</strong></p>
        <p>${strings.minimumRequired}: <strong>${details['minimum']}</strong></p>
      </div>`;
    },
    detailed(ctx: ErrorRenderContext): TemplateResult {
      const { details, renderTokenLink } = ctx;
      const tokens = details['tokens'] as string[];
      const [tokenA, tokenB] = tokens;

      if (!renderTokenLink) {
        return html`<p>${tokenA} ${strings.and} ${tokenB}</p>`;
      }

      const andText = ` ${strings.and} `;
      const renderedTokens = html`<strong>${renderTokenLink(tokenA)}</strong>${andText}
        <strong>${renderTokenLink(tokenB)}</strong>`;
      const renderedContrast = html`${strings.contrastLabel}: <strong>${details['current']}</strong>`;
      const renderedMinimum = html`${strings.minimumRequired}: <strong>${details['minimum']}</strong>`;

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

const i18n = rosetta();
i18n.locale('nl');

i18n.set('nl', {
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
});

i18n.set('en', {
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
});

export const renderError = (issue: ValidationIssue, options?: RenderOptions): TemplateResult | typeof nothing => {
  const mode = options?.mode || 'compact';

  const context: ErrorRenderContext = {
    details: { ...issue.details, path: issue.path },
    renderTokenLink: options?.renderTokenLink,
  };

  const key = `validation.error.${issue.code}.${mode}`;
  const result = i18n.t(key, context) as unknown as TemplateResult;

  return result ?? nothing;
};

export const errorLabel = (errorCode: string): string => {
  const key = `validation.error.${errorCode}.label`;
  const label = i18n.t(key);
  return label === key ? errorCode : label;
};

export default i18n;
