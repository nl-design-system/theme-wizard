import { LitElement, html, TemplateResult } from 'lit';
import i18n from '../../i18n/messages';
import { ShadowDOMNavigator } from '../../lib/ShadowDOMNavigator';

const FOCUS_DELAY_MS = 300;
const TOKEN_FIELD_SELECTOR = 'wizard-token-field';

/**
 * Base class for validation issue components
 * Provides common functionality for token navigation and focus management
 */
export abstract class BaseValidationIssues extends LitElement {
  readonly #shadowDOMNavigator = new ShadowDOMNavigator();

  /**
   * 1. Finds the field (crossing shadow DOM boundaries)
   * 2. Expands any collapsed parent <details> elements
   * 3. Applies highlight animation
   * 4. Scrolls field into view
   * 5. Focuses the input element
   * @param tokenPath - Path to the token (e.g., "basis.color.primary")
   */
  protected focusToken(tokenPath: string): void {
    const selector = `${TOKEN_FIELD_SELECTOR}[path="${tokenPath}"]`;
    const field = this.#shadowDOMNavigator.findElement(document, selector);

    if (!field) {
      console.warn(`[ValidationIssues] Token field not found: ${tokenPath}`);
      return;
    }

    this.#shadowDOMNavigator.expandParentDetails(field);
    this.applyHighlightAnimation(field);
    this.scrollToField(field);
    this.focusFieldInput(field, tokenPath);
  }

  /**
   * Applies a highlight animation to the field
   */
  protected applyHighlightAnimation(field: HTMLElement): void {
    field.classList.add('validation-highlight');

    const handleAnimationEnd = () => {
      field.classList.remove('validation-highlight');
      field.removeEventListener('animationend', handleAnimationEnd);
    };

    field.addEventListener('animationend', handleAnimationEnd);
  }

  /**
   * Scrolls the field into view
   */
  protected scrollToField(field: HTMLElement): void {
    field.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
  }

  /**
   * Uses setTimeout to allow scroll animation to complete first
   */
  protected focusFieldInput(field: HTMLElement, tokenPath: string): void {
    const inputId = `input-${tokenPath}`;
    const input = field.shadowRoot?.getElementById(`${inputId}`)?.shadowRoot?.querySelector('input');

    if (input instanceof HTMLElement) {
      setTimeout(() => input.focus(), FOCUS_DELAY_MS);
    }
  }

  /**
   * Renders a clickable token label that navigates to the token
   * @param tokenPath - Path to the token
   * @param displayText - Optional display text (defaults to tokenPath)
   */
  protected renderTokenLink(tokenPath: string, displayText?: string): TemplateResult {
    const text = displayText ?? tokenPath;
    const ariaLabel = i18n.t('validation.token_link.aria_label', { token: text });

    return html`<a
      href="#${tokenPath}"
      class="token-link"
      @click=${(e: Event) => {
        e.preventDefault();
        this.focusToken(tokenPath);
      }}
      aria-label="${ariaLabel}"
    >
      ${text}
    </a>`;
  }
}
