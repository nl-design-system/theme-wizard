import type { TemplateResult } from 'lit';
import { ERROR_CODES } from '@nl-design-system-community/design-tokens-schema';
import { html } from 'lit';
import type ValidationIssue from '../ValidationIssue';
import i18n from '../../i18n/messages';
import { ContrastErrorRenderer } from './ContrastErrorRenderer';
import { InvalidRefErrorRenderer } from './InvalidRefErrorRenderer';

/**
 * Delegates rendering to specialized renderer classes based on error code
 */
export class ValidationErrorRenderer {
  private static readonly renderers = new Map<
    string,
    (error: ValidationIssue, options?: RenderOptions) => TemplateResult | null
  >([
    [ERROR_CODES.INSUFFICIENT_CONTRAST, (error, options) => ContrastErrorRenderer.render(error, options)],
    [ERROR_CODES.INVALID_REF, (error) => InvalidRefErrorRenderer.render(error)],
  ]);

  static getLabel(errorCode: string): string {
    const key = `validation.error.${errorCode}.label`;
    const label = i18n.t(key);
    return label === key ? errorCode : label;
  }

  /**
   * Renders an error message based on the error code
   */
  static render(error: ValidationIssue, options?: RenderOptions): TemplateResult {
    const renderer = this.renderers.get(error.code);
    if (renderer) {
      const result = renderer(error, options);
      return result ?? this.#renderFallback(error);
    }

    return this.#renderFallback(error);
  }

  /**
   * Renders a generic fallback error for unknown or malformed errors
   */
  static #renderFallback(error: ValidationIssue): TemplateResult {
    const message = error.details?.message ?? i18n.t('unknown');
    return html`<p>${error.path}: ${message}</p>`;
  }
}

/**
 * Options for rendering error messages
 */
export interface RenderOptions {
  /**
   * Format of the error message
   * - 'inline': Simple text format for inline display
   * - 'rich': Rich format with clickable elements
   */
  format?: 'inline' | 'rich';

  /**
   * Optional function to render token paths as clickable navigation links
   * When provided, only renders the tokens part (e.g., "tokenA and tokenB") as links
   */
  renderTokenLink?: (tokenPath: string) => TemplateResult;

  /**
   * Optional function to render detailed error information
   * When provided, only renders the details part (e.g., "Contrast: 2.43, minimaal vereist: 4.5")
   */
  renderDetails?: (messageDetails: string) => TemplateResult;
}
