import { LitElement, html, TemplateResult } from 'lit';
import { t } from '../../i18n';
import { ShadowDOMNavigator } from './ShadowDOMNavigator';

const FOCUS_DELAY_MS = 300;
const TOKEN_FIELD_SELECTOR = 'wizard-token-field';

/**
 * Base class for components that need token navigation functionality
 * Provides token field navigation, focus management, and token link rendering
 */
export class WizardTokenNavigator extends LitElement {
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

    this.focusField(field, tokenPath);
  }

  /**
   * Focuses a specific field element (used when the field knows it's the target)
   * @param field - The field element to focus (can be this element or another)
   * @param tokenPath - Path to the token
   */
  protected focusField(field: HTMLElement, tokenPath: string): void {
    this.#shadowDOMNavigator.expandParentDetails(field);
    this.applyHighlightAnimation(field);
    this.scrollToField(field);
    this.focusFieldInput(field, tokenPath);
  }

  /**
   * Applies a highlight animation to the field
   */
  protected applyHighlightAnimation(field: HTMLElement): void {
    field.classList.add('theme-validation-highlight');

    const handleAnimationEnd = () => {
      field.classList.remove('theme-validation-highlight');
      field.removeEventListener('animationend', handleAnimationEnd);
    };

    field.addEventListener('animationend', handleAnimationEnd);
  }

  /**
   * Scrolls the field into view
   */
  protected scrollToField(field: HTMLElement): void {
    const prefersReducedMotion = globalThis.matchMedia('(prefers-reduced-motion: reduce)').matches;
    field.scrollIntoView({
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
      block: 'center',
    });
  }

  /**
   * Uses setTimeout to allow scroll animation to complete first
   */
  protected focusFieldInput(field: HTMLElement, tokenPath: string): void {
    const input = field.shadowRoot?.querySelector<HTMLInputElement>(`input[name="${tokenPath}"]`);
    if (input) setTimeout(() => input.focus(), FOCUS_DELAY_MS);
  }

  /**
   * Renders a clickable token label that navigates to the token
   * @param tokenPath - Path to the token
   * @param displayText - Optional display text (defaults to tokenPath)
   */
  protected renderTokenLink(tokenPath: string, displayText?: string): TemplateResult {
    const text = displayText ?? tokenPath;
    const ariaLabel = t('validation.token_link.aria_label', { token: text });

    return html`<button
      type="button"
      class="theme-token-link"
      @click=${() => {
        this.focusToken(tokenPath);
      }}
      aria-label="${ariaLabel}"
    >
      ${text}
    </button>`;
  }
}
