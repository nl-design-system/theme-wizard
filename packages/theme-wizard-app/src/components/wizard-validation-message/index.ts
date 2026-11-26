import { consume } from '@lit/context';
import linkCss from '@nl-design-system-candidate/link-css/link.css?inline';
import paragraphCss from '@nl-design-system-candidate/paragraph-css/paragraph.css?inline';
import { safeCustomElement } from '@nl-design-system-community/clippy-components/lib/decorators';
import '@nl-design-system-community/clippy-components/clippy-button';
import '@nl-design-system-community/clippy-components/clippy-drawer';
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

  #issue: ValidationIssue | undefined = undefined;

  protected override willUpdate(changedProperties: PropertyValues) {
    if (!hasChangedProperty(changedProperties, ['theme', 'path'])) {
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

    // Only link when the host provided a resolver and a page exists for this token path
    const href = this.tokenUrlResolver?.(this.#issue.path);

    return html`
      <p class="nl-paragraph">
        ${href ? html`<b><a href=${href}>${this.#issue.path}</a></b>` : html`<b>${this.#issue.path}</b>`}:
        <br />
        ${t(`validation.error.${this.#issue.code}.message`, this.#issue)}
      </p>
    `;
  }
}
