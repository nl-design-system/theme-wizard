import type { TemplateResult } from 'lit';

export type TokenLinkRenderer = (tokenPath: string, displayText?: string) => TemplateResult;
