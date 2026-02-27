import { consume } from '@lit/context';
import buttonLinkStyles from '@utrecht/link-button-css?inline';
import { LitElement, html, unsafeCSS } from 'lit';
import { customElement } from 'lit/decorators.js';
import '@nl-design-system-community/clippy-components/clippy-heading';
import '../wizard-layout';
import '../wizard-preview';
import '../wizard-token-field';
import '../wizard-font-input';
import '../wizard-download-confirmation';
import '../wizard-validation-issues-alert';
import '../wizard-scraper';
import type Theme from '../../lib/Theme';
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
  private readonly theme!: Theme;

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
      <form>
        <ul class="wizard-app__basis-tokens">
          ${fonts.map(
            ({ label, path, token }) =>
              html`<li>
                <wizard-font-input
                  .errors=${this.theme.issues.filter((error) => error.path === path)}
                  .value=${token.$value}
                  label=${label}
                  name=${path}
                >
                  <div slot="label">${label}</div>
                </wizard-font-input>
              </li>`,
          )}
        </ul>

        <ul class="wizard-app__basis-tokens">
          ${(() => {
            const basis = this.theme.tokens['basis'];
            const color = typeof basis === 'object' && basis !== null && 'color' in basis ? basis['color'] : undefined;
            const colorKeys = typeof color === 'object' && color !== null ? Object.keys(color) : [];
            return colorKeys
              .filter((name) => name !== 'transparent' && !name.includes('inverse'))
              .map(
                (colorKey) => html`
                  <li>
                    <wizard-colorscale-input
                      key=${colorKey}
                      label=${t(`tokens.fieldLabels.basis.color.${colorKey}.label`)}
                      id=${`basis.color.${colorKey}`}
                      name=${`basis.color.${colorKey}`}
                      .colorToken=${this.theme.at(`basis.color.${colorKey}.color-default`)}
                    >
                      <a
                        href=${t(`tokens.fieldLabels.basis.color.${colorKey}.docs`)}
                        target="_blank"
                        slot="extra-label"
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
      </form>
    `;
  }
}
