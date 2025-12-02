import type { TemplateResult } from 'lit';
import type { en } from './messages';

export type TokenLinkRenderer = (tokenPath: string, displayText?: string) => TemplateResult;

type LocalizedMessageOutput = TemplateResult | string;
type LocalizedMessagesOf<T> = T extends object
  ? { [K in keyof T]: LocalizedMessagesOf<T[K]> }
  : (LocalizedMessageOutput | ((...args: unknown[]) => (LocalizedMessageOutput)));


export type LocalizedMessages = LocalizedMessagesOf<typeof en>;
