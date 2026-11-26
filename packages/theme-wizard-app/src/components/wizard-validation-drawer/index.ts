import { consume } from '@lit/context';
import linkCss from '@nl-design-system-candidate/link-css/link.css?inline';
import paragraphCss from '@nl-design-system-candidate/paragraph-css/paragraph.css?inline';
import { type ClippyDrawer } from '@nl-design-system-community/clippy-components/clippy-drawer';
import { safeCustomElement } from '@nl-design-system-community/clippy-components/lib/decorators';
import AccessibleIcon from '@tabler/icons/outline/accessible.svg?raw';
import '@nl-design-system-community/clippy-components/clippy-button';
import '@nl-design-system-community/clippy-components/clippy-drawer';
import '../wizard-validation-message';
import ChevronDownIcon from '@tabler/icons/outline/chevron-down.svg?raw';
import { html, LitElement, nothing, unsafeCSS } from 'lit';
import { query, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
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
  static override readonly styles = [styles, unsafeCSS(linkCss), unsafeCSS(paragraphCss)];

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
    return html`
      <clippy-button
        icon-only
        class=${classMap({
          'wizard-validation-drawer__toggle': true,
          'wizard-validation-drawer__toggle--has-notification': this.theme.errorCount,
        })}
        purpose="subtle-inverse"
        .expanded=${this.isDrawerOpen}
        slot="end"
        controls="clippy-mobile-menu-drawer"
        @click=${() => {
          this.#openDrawer();
        }}
      >
        <clippy-icon slot="iconStart">${unsafeSVG(AccessibleIcon)}</clippy-icon>
        ${t('wizard.validationDrawer.toggle', { count: this.theme.errorCount })}
        <clippy-icon slot="iconEnd">${unsafeSVG(ChevronDownIcon)}</clippy-icon>
      </clippy-button>

      <clippy-drawer actions="none" side="inline-end" id="wizard-validation-drawer">
        <span slot="title">${t('wizard.validationDrawer.title')}</span>
        ${!this.theme.errorCount ? html`<p class="nl-paragraph">${t('wizard.validationDrawer.noIssues')}</p>` : nothing}
        <clippy-stack size="3xl">
          ${Object.entries(this.theme.groupedIssues).map(([errorCode, errors]) => {
            if (!errors || errors.length === 0) return nothing;

            return html`
              <clippy-stack size="lg">
                <clippy-heading level=${2}>
                  ${t(`validation.error.${errorCode}.label`)} (${errors.length})
                </clippy-heading>

                <clippy-stack>
                  ${errors.map(
                    (error) => html`<wizard-validation-message path=${error.path}></wizard-validation-message>`,
                  )}
                </clippy-stack>
              </clippy-stack>
            `;
          })}
        </clippy-stack>
      </clippy-drawer>
    `;
  }
}
