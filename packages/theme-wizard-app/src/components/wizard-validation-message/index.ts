import { consume } from '@lit/context';
import linkCss from '@nl-design-system-candidate/link-css/link.css?inline';
import paragraphCss from '@nl-design-system-candidate/paragraph-css/paragraph.css?inline';
import { safeCustomElement } from '@nl-design-system-community/clippy-components/lib/decorators';
import { html, LitElement, nothing, PropertyValues, unsafeCSS } from 'lit';
import { property, state } from 'lit/decorators.js';
import { themeContext } from '../../contexts/theme';
import { tokenUrlContext, type TokenUrlResolver } from '../../contexts/token-url';
import { t } from '../../i18n';
import Theme from '../../lib/Theme';
import ValidationIssue from '../../lib/ValidationIssue';
import { hasChangedProperty } from '../../utils/lit';
import styles from './styles';

const tag = 'wizard-validation-message';

declare global {
  interface HTMLElementTagNameMap {
    [tag]: WizardValidationMessage;
  }
}

/**
 * @element wizard-validation-message
 */
@safeCustomElement(tag)
export class WizardValidationMessage extends LitElement {
  static override readonly styles = [styles, unsafeCSS(linkCss), unsafeCSS(paragraphCss)];

  @consume({ context: themeContext, subscribe: true })
  @state()
  private readonly theme!: Theme;

  @consume({ context: tokenUrlContext, subscribe: true })
  @state()
  private tokenUrlResolver?: TokenUrlResolver;

  @property({ converter: String })
  path: string = '';

  @property({ attribute: 'message-only', type: Boolean })
  messageOnly: boolean = false;

  /**
   * Pass the issue directly when it is already known (e.g. from a ValidationIssueGroup).
   * Takes precedence over the `path` lookup, which is ambiguous when one path has multiple issues.
   */
  @property({ attribute: false })
  issue: ValidationIssue | undefined = undefined;

  #issue: ValidationIssue | undefined = undefined;

  protected override willUpdate(changedProperties: PropertyValues) {
    if (!hasChangedProperty(changedProperties, ['theme', 'path', 'issue'])) {
      return;
    }
    if (this.issue) {
      this.#issue = this.issue;
      return;
    }

    if (this.path) {
      this.#issue = this.theme.issues.find((issue) => issue.path === this.path);
    }
  }

  #renderMessage = (issue: ValidationIssue) => {
    return t(`validation.error.${issue.code}.message`, issue);
  };

  override render() {
    if (!this.#issue) {
      return nothing;
    }

    // Only link when the host provided a resolver and a page exists for this token path
    const href = this.tokenUrlResolver?.(this.#issue.path);

    if (this.messageOnly) {
      return html`<span>${this.#renderMessage(this.#issue)}</span>`;
    }

    return html`
      <p class="nl-paragraph">
        <strong>${href ? html`<a class="nl-link" href=${href}>${this.#issue.path}</a>` : this.#issue.path}</strong>:
        <br />
        ${this.#renderMessage(this.#issue)}
      </p>
    `;
  }
}
