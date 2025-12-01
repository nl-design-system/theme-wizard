import type { TemplateResult } from 'lit';
import type { en } from './messages';

export type TokenLinkRenderer = (tokenPath: string, displayText?: string) => TemplateResult;

type LocalizedMessagesOf<T> = T extends string
  ? string
  : T extends (...args: infer A) => infer R
    ? (...args: A) => R
    : T extends TemplateResult
      ? TemplateResult
      : T extends object
        ? { [K in keyof T]: LocalizedMessagesOf<T[K]> }
        : T;

export type LocalizedMessages = LocalizedMessagesOf<typeof en>;
