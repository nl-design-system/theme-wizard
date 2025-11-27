import { TemplateResult } from 'lit';
import type { ObjectPath } from '../utils/types';
import ValidationIssue from '../lib/ValidationIssue';

export type TokenLinkRenderer = (tokenPath: string, displayText?: string) => TemplateResult;

/**
 * Define the structure of i18n messages
 */
export type I18nMessages = {
  unknown: string;
  validation: {
    title: string;
    error: {
      [key: string]: {
        compact: (issue: ValidationIssue & { renderTokenLink?: TokenLinkRenderer }) => TemplateResult;
        detailed: (issue: ValidationIssue & { renderTokenLink?: TokenLinkRenderer }) => TemplateResult;
        label: string;
      };
    };
    issue: {
      contrastValue: string;
      invalidContrastWith: (params: { context?: TokenLinkRenderer; token: string }) => TemplateResult;
      minimalNeeded: (params: { value: string }) => TemplateResult;
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
