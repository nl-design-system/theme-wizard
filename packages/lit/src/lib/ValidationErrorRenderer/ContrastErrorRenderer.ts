import type { TemplateResult } from 'lit';
import { html } from 'lit';
import type ValidationIssue from '../ValidationIssue';
import i18n, { type ContrastMessageParts } from '../../i18n/messages';

interface RenderOptions {
  renderTokenLink?: (tokenPath: string) => TemplateResult;
  renderDetails?: (messageDetails: string) => TemplateResult;
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
  static render(error: ValidationIssue, options?: RenderOptions): TemplateResult | null {
    if (!this.canHandle(error)) {
      return null;
    }

    // Render only tokens (for main list item with clickable links)
    if (options?.renderTokenLink) {
      return html`${this.composeTokens(options.renderTokenLink, error)}`;
    }

    // Render only details (for sub list item with contrast values)
    if (options?.renderDetails) {
      return html`${this.getDetails(error)}`;
    }

    // Inline format (for input fields) - combines tokens and details as plain text
    const tokens = this.composeTokens((token: string) => token, error);
    const details = this.getDetails(error);
    return html`<p>${tokens}: ${details}</p>`;
  }
}
