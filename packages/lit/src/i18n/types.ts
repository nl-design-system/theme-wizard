import { TemplateResult } from 'lit';
import type { ObjectPath } from '../utils/types';

export interface ErrorRenderContext {
  details: Record<string, unknown>;
  renderTokenLink?: (tokenPath: string) => TemplateResult;
}

/**
 * Define the structure of i18n messages
 */
export type I18nMessages = {
  unknown: string;
  validation: {
    title: string;
    error: {
      [key: string]: {
        compact: (ctx: ErrorRenderContext) => TemplateResult;
        detailed: (ctx: ErrorRenderContext) => TemplateResult;
        label: string;
      };
    };
    token_link: {
      aria_label: string;
    };
  };
};

/**
 * All possible message paths, automatically generated from I18nMessages
 */
export type I18nMessagePaths = ObjectPath<I18nMessages>;
