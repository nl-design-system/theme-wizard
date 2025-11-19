import { LitElement, html, nothing, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import i18n from '../../i18n/messages';
import { ShadowDOMNavigator } from '../../lib/ShadowDOMNavigator';
import { ValidationErrorRenderer } from '../../lib/ValidationErrorRenderer';
import ValidationIssue from '../../lib/ValidationIssue';
import styles from './styles';

const tag = 'wizard-validation-issues-alert';
const FOCUS_DELAY_MS = 300;
const TOKEN_FIELD_SELECTOR = 'wizard-token-field';

declare global {
  interface HTMLElementTagNameMap {
    [tag]: WizardValidationIssuesAlert;
  }
}

@customElement(tag)
export class WizardValidationIssuesAlert extends LitElement {
  @property({ type: Array })
  issues: ValidationIssue[] = [];

  static override readonly styles = [unsafeCSS(styles)];

  readonly #shadowDOMNavigator = new ShadowDOMNavigator();

  /**
   * Group issues by error code
   */
  private get issuesByErrorCode(): ReadonlyMap<string, ValidationIssue[]> {
    const grouped = new Map<string, ValidationIssue[]>();

    for (const issue of this.issues) {
      const existing = grouped.get(issue.code);
      if (existing) {
        existing.push(issue);
      } else {
        grouped.set(issue.code, [issue]);
      }
    }

    return grouped;
  }

  /**
   * 1. Finds the field (crossing shadow DOM boundaries)
   * 2. Expands any collapsed parent <details> elements
   * 3. Applies highlight animation
   * 4. Scrolls field into view
   * 5. Focuses the input element
   * @param tokenPath - Path to the token (e.g., "basis.color.primary")
   */
  #focusToken(tokenPath: string): void {
    const selector = `${TOKEN_FIELD_SELECTOR}[path="${tokenPath}"]`;
    const field = this.#shadowDOMNavigator.findElement(document, selector);

    if (!field) {
      console.warn(`[ValidationIssuesAlert] Token field not found: ${tokenPath}`);
      return;
    }

    this.#shadowDOMNavigator.expandParentDetails(field);
    this.#applyHighlightAnimation(field);
    this.#scrollToField(field);
    this.#focusFieldInput(field, tokenPath);
  }

  #applyHighlightAnimation(field: HTMLElement): void {
    field.classList.add('validation-highlight');

    const handleAnimationEnd = () => {
      field.classList.remove('validation-highlight');
      field.removeEventListener('animationend', handleAnimationEnd);
    };

    field.addEventListener('animationend', handleAnimationEnd);
  }

  #scrollToField(field: HTMLElement): void {
    field.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
  }

  /**
   * Uses setTimeout to allow scroll animation to complete first
   */
  #focusFieldInput(field: HTMLElement, tokenPath: string): void {
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
  #renderTokenLink(tokenPath: string, displayText?: string) {
    const text = displayText ?? tokenPath;
    const ariaLabel = i18n.t('validation.token_link.aria_label', { token: text });

    return html`<a
      href="#${tokenPath}"
      class="token-link"
      @click=${(e: Event) => {
        e.preventDefault();
        this.#focusToken(tokenPath);
      }}
      aria-label="${ariaLabel}"
    >
      ${text}
    </a>`;
  }

  #renderMessageDetails(messageDetails: string) {
    return html`<p>${messageDetails}</p>`;
  }

  override render() {
    if (this.issues.length === 0) {
      return nothing;
    }

    return html`
      <utrecht-alert type="error">
        <utrecht-heading-2>${i18n.t('validation.title')}</utrecht-heading-2>
        ${this.#renderIssueGroups()}
      </utrecht-alert>
    `;
  }

  /**
   * Renders grouped validation issues organized by error code
   */
  #renderIssueGroups() {
    return Array.from(this.issuesByErrorCode.entries()).map(([errorCode, issues]) => {
      const label = ValidationErrorRenderer.getLabel(errorCode);
      const count = issues.length;

      return html`
        <details>
          <summary>${label} (${count})</summary>
          <ul>
            ${issues.map(
              (issue) =>
                html`<li>
                  ${ValidationErrorRenderer.render(issue, {
                    renderTokenLink: this.#renderTokenLink.bind(this),
                  })}
                  <ul>
                    <li>
                      ${ValidationErrorRenderer.render(issue, {
                        renderDetails: this.#renderMessageDetails.bind(this),
                      })}
                    </li>
                  </ul>
                </li>`,
            )}
          </ul>
        </details>
      `;
    });
  }
}
