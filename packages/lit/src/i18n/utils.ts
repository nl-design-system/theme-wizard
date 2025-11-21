import i18n from './i18n';
import { I18nMessagePaths, ErrorRenderContext } from './types';
import { TemplateResult, nothing } from 'lit';
import ValidationIssue, { RenderOptions } from '../lib/ValidationIssue';

export const t = (key: I18nMessagePaths, params?: Record<string, unknown>): string => {
  const result = i18n.t(key, params);

  return typeof result === 'string' ? result : key;
};

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
