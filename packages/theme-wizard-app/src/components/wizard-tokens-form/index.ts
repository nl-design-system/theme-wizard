import { consume } from '@lit/context';
import buttonLinkStyles from '@utrecht/link-button-css?inline';
import { LitElement, html, unsafeCSS } from 'lit';
import { customElement, state, query } from 'lit/decorators.js';
import '@nl-design-system-community/clippy-components/clippy-heading';
import '../wizard-layout';
import '../wizard-preview';
import '../wizard-token-field';
import '../wizard-font-input';
import '../wizard-download-confirmation';
import '../wizard-validation-issues-alert';
import '../wizard-scraper';
import type Theme from '../../lib/Theme';
import type { WizardDownloadConfirmation } from '../wizard-download-confirmation';
import { themeContext } from '../../contexts/theme';
import { t } from '../../i18n';
import styles from './styles';

const BODY_FONT_TOKEN_REF = 'basis.text.font-family.default';
const HEADING_FONT_TOKEN_REF = 'basis.heading.font-family';

const tag = 'wizard-tokens-form';

declare global {
  interface HTMLElementTagNameMap {
    [tag]: WizardTokensForm;
  }
}

@customElement(tag)
export class WizardTokensForm extends LitElement {
  static override readonly styles = [unsafeCSS(buttonLinkStyles), styles];

  @consume({ context: themeContext, subscribe: true })
  @state()
  private readonly theme!: Theme;

  @query('wizard-download-confirmation')
  private readonly dialogElement?: WizardDownloadConfirmation;

  readonly #handleReset = () => {
    this.dispatchEvent(new Event('reset', { bubbles: true, composed: true }));
  };

  readonly #downloadJSON = async () => {
    const data = await this.theme.toTokensJSON();
    const encoded = encodeURIComponent(data);
    const href = `data:application/json,${encoded}`;
    const anchor = document.createElement('a');
    anchor.download = 'tokens.json';
    anchor.href = href;
    anchor.click();
    anchor.remove();
  };

  readonly #handleDownloadClick = () => {
    if (this.theme.errorCount > 0) {
      this.dialogElement?.open();
      return;
    }

    this.#downloadJSON();
  };

  readonly #handleDialogClose = (event: Event) => {
    const dialog = event.currentTarget as WizardDownloadConfirmation;
    if (dialog.returnValue === 'confirm') {
      this.#downloadJSON();
    }
  };

  override render() {
    if (!this.theme) {
      return html`<div>Loading...</div>`;
    }

    const fonts = [
      {
        label: t('tokens.fieldLabels.headingFont'),
        path: HEADING_FONT_TOKEN_REF,
        token: this.theme.at(HEADING_FONT_TOKEN_REF),
      },
      {
        label: t('tokens.fieldLabels.bodyFont'),
        path: BODY_FONT_TOKEN_REF,
        token: this.theme.at(BODY_FONT_TOKEN_REF),
      },
    ];

    return html`
      <section>
        <form @reset=${this.#handleReset}>
          <button class="utrecht-link-button utrecht-link-button--html-button" type="reset">Reset tokens</button>

          ${fonts.map(
            ({ label, path, token }) =>
              html` <wizard-font-input
                .errors=${this.theme.issues.filter((error) => error.path === path)}
                .value=${token.$value}
                label=${label}
                name=${path}
              >
                ${label}
              </wizard-font-input>`,
          )}

          <ul class="wizard-app__basis-colors">
            ${(() => {
              const basis = this.theme.tokens['basis'];
              const color =
                typeof basis === 'object' && basis !== null && 'color' in basis ? basis['color'] : undefined;
              const colorKeys = typeof color === 'object' && color !== null ? Object.keys(color) : [];
              return colorKeys
                .filter((name) => name !== 'transparent')
                .map(
                  (colorKey) => html`
                    <li>
                      <wizard-colorscale-input
                        key=${colorKey}
                        label=${t(`tokens.fieldLabels.basis.color.${colorKey}.label`)}
                        id=${`basis.color.${colorKey}`}
                        name=${`basis.color.${colorKey}`}
                        .colorToken=${this.theme.at(`basis.color.${colorKey}.color-default`)}
                        .inverse=${colorKey.includes('inverse')}
                      >
                        <a
                          href=${t(`tokens.fieldLabels.basis.color.${colorKey}.docs`)}
                          target="_blank"
                          slot="extra-label"
                        >
                          docs
                        </a>
                      </wizard-colorscale-input>
                    </li>
                  `,
                );
            })()}
          </ul>

          <details>
            <summary>Alle tokens</summary>
            <wizard-token-field
              .errors=${this.theme.issues}
              .token=${this.theme.tokens['basis']}
              path=${`basis`}
              class="wizard-app__root-token-field"
            ></wizard-token-field>
          </details>
        </form>
      </section>

      <section>
        <clippy-heading level="2">Download thema</clippy-heading>

        <wizard-download-confirmation
          .issues=${this.theme.groupedIssues}
          @close=${this.#handleDialogClose}
        ></wizard-download-confirmation>

        <utrecht-button
          appearance="primary-action-button"
          type="button"
          ?disabled=${!this.theme.modified}
          @click=${this.#handleDownloadClick}
        >
          Download tokens als JSON
        </utrecht-button>
      </section>
    `;
  }
}
