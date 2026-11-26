import { consume } from '@lit/context';
import linkCss from '@nl-design-system-candidate/link-css/link.css?inline';
import paragraphCss from '@nl-design-system-candidate/paragraph-css/paragraph.css?inline';
import { safeCustomElement } from '@nl-design-system-community/clippy-components/lib/decorators';
import '@nl-design-system-community/clippy-components/clippy-button';
import '@nl-design-system-community/clippy-components/clippy-drawer';
import { html, LitElement, nothing, PropertyValues, unsafeCSS } from 'lit';
import { property, state } from 'lit/decorators.js';
import { themeContext } from '../../contexts/theme';
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

  @property({ converter: String })
  path: string = '';

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

  override render() {
    if (!this.#issue) {
      return nothing;
    }

    return html`
      <p class="nl-paragraph">
        <b><a href=${`/design-tokens/${this.#issue.path.replaceAll('.', '/')}`}>${this.#issue.path}</a></b
        >:
        <br />
        ${t(`validation.error.${this.#issue.code}.message`, this.#issue)}
      </p>
    `;
  }
}
