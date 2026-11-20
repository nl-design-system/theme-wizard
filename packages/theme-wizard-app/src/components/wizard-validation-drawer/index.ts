import { consume } from '@lit/context';
import { type ClippyDrawer } from '@nl-design-system-community/clippy-components/clippy-drawer';
import { safeCustomElement } from '@nl-design-system-community/clippy-components/lib/decorators';
import AccessibleIcon from '@tabler/icons/outline/accessible.svg?raw';
import { html, LitElement, nothing } from 'lit';
import '@nl-design-system-community/clippy-components/clippy-button';
import '@nl-design-system-community/clippy-components/clippy-drawer';
import { query, state } from 'lit/decorators.js';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import { themeContext } from '../../contexts/theme';
import { t } from '../../i18n';
import Theme from '../../lib/Theme';
import styles from './styles';

const tag = 'wizard-validation-drawer';

declare global {
  interface HTMLElementTagNameMap {
    [tag]: WizardValidationDrawer;
  }
}

/**
 * @element wizard-validation-drawer
 */
@safeCustomElement(tag)
export class WizardValidationDrawer extends LitElement {
  static override readonly styles = [styles];

  @consume({ context: themeContext, subscribe: true })
  @state()
  private readonly theme!: Theme;

  @query('clippy-drawer')
  readonly drawerElement!: ClippyDrawer;

  @state() private isDrawerOpen: boolean = false;

  #openDrawer = () => {
    this.drawerElement?.open();
    this.isDrawerOpen = true;
  };

  #onDrawerClose = () => {
    this.isDrawerOpen = false;
  };

  override firstUpdated() {
    this.drawerElement.addEventListener('close', this.#onDrawerClose);
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.drawerElement.removeEventListener('close', this.#onDrawerClose);
  }

  override render() {
    console.log('this.theme.groupedIssues', this.theme.groupedIssues);
    if (!this.theme.errorCount) {
      return nothing;
    }
    return html`
      <clippy-button
        icon-only
        purpose="subtle-inverse"
        .expanded=${this.isDrawerOpen}
        slot="end"
        controls="clippy-mobile-menu-drawer"
        @click=${() => {
          this.#openDrawer();
        }}
      >
        <clippy-icon slot="iconStart">${unsafeSVG(AccessibleIcon)}</clippy-icon>
        Toon toegankelijkheidsmeldingen
      </clippy-button>

      <clippy-drawer actions="none" side="inline-end" id="wizard-validation-drawer">
        <span slot="title">Fouten, waarschuwingen of tips</span>
        ${Object.entries(this.theme.groupedIssues).map(([errorCode, errors]) => {
          if (!errors || errors.length === 0) return nothing;

          return html`
            <details>
              <summary>${t(`validation.error.${errorCode}.label`)} (${errors.length})</summary>
              <ul>
                ${errors.map(
                  (error) => html`
                    <li>
                      <b><a href=${`/design-tokens/${error.path.replaceAll('.', '/')}`}>${error.path}</a></b
                      >:
                      <br />
                      ${t(`validation.error.${error.code}.message`, {
                        ...error,
                      })}
                    </li>
                  `,
                )}
              </ul>
            </details>
          `;
        })}
      </clippy-drawer>
    `;
  }
}
