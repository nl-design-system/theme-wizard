import type { TemplateResult } from 'lit';
import { html, nothing } from 'lit';
import type ValidationIssue from '../ValidationIssue';
import i18n, { type ContrastMessageParts } from '../../i18n/messages';

interface RenderOptions {
  renderTokenLink?: (tokenPath: string) => TemplateResult;
  renderDetails?: (messageDetails: string) => TemplateResult;
  composeStructure?: (tokens: unknown, details: string) => TemplateResult;
}

export class ContrastErrorRenderer {
  static canHandle(error: ValidationIssue): boolean {
    const tokenPaths = error.details?.tokens;
    return !!(tokenPaths?.[0] && tokenPaths?.[1]);
  }

  private static composeTokens(renderToken: (path: string) => unknown, issue: ValidationIssue) {
    const parts = i18n.t(
      'validation.error.insufficient_contrast.parts',
      issue.details,
    ) as unknown as ContrastMessageParts;

    const tokens = issue.details?.tokens ?? [];
    const [tokenA, tokenB] = tokens;

    return [renderToken(String(tokenA)), parts.separator, renderToken(String(tokenB))];
  }

  /**
   * Gets the contrast details message (e.g., "Contrast: 2.43, minimaal vereist: 4.5")
   */
  private static getDetails(issue: ValidationIssue): string {
    const parts = i18n.t(
      'validation.error.insufficient_contrast.parts',
      issue.details,
    ) as unknown as ContrastMessageParts;

    return parts.details;
  }

  /**
   * Renders a contrast error
   * Supports three modes:
   * 1. Tokens only (with renderTokenLink callback)
   * 2. Details only (with renderDetails callback)
   * 3. Inline combined (default)
   * @returns Template result, or null if error cannot be handled
   */
  static render(error: ValidationIssue, options?: RenderOptions): TemplateResult | typeof nothing {
    if (!this.canHandle(error)) {
      console.error('ValidationIssue can not be handled.', error);
      return nothing;
    }

    if (options?.renderTokenLink && options?.renderDetails) {
      const tokens = this.composeTokens(options.renderTokenLink, error);
      const details = this.getDetails(error);

      if (options.composeStructure) {
        return options.composeStructure(tokens, details);
      }
    }

    return nothing;
  }
}
