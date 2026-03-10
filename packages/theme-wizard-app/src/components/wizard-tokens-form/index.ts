import { consume } from '@lit/context';
import linkCss from '@nl-design-system-candidate/link-css/link.css?inline';
import paragraphCss from '@nl-design-system-candidate/paragraph-css/paragraph.css?inline';
import '@nl-design-system-community/clippy-components/clippy-heading';
import '../wizard-layout';
import '../wizard-preview';
import '../wizard-token-field';
import '../wizard-font-input';
import '../wizard-download-confirmation';
import '../wizard-validation-issues-alert';
import '../wizard-scraper';
import { LitElement, html, unsafeCSS } from 'lit';
import { customElement, state } from 'lit/decorators.js';
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

type DisplayMode = 'initial' | 'fonts' | 'colors' | 'spacing';

@customElement(tag)
export class WizardTokensForm extends LitElement {
  static override readonly styles = [styles, unsafeCSS(linkCss), unsafeCSS(paragraphCss)];

  @consume({ context: themeContext, subscribe: true })
  private readonly theme!: Theme;

  @state()
  private displayMode: DisplayMode = 'initial';

  private readonly handleModeSwitch = (event: MouseEvent, newMode: DisplayMode) => {
    event.preventDefault();
    this.displayMode = newMode;
  };

  private readonly showInitialMode = (event: MouseEvent) => {
    event.preventDefault();
    this.displayMode = 'initial';
  };

  private readonly renderChevron = () => {
    return html`<svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="wizard-tokens-form__section-link-icon"
      aria-hidden="true"
    >
      <path d="M9 6l6 6l-6 6" />
    </svg>`;
  };

  override render() {
    if (this.displayMode === 'initial') {
      return html`
        <div class="wizard-tokens-form__section-links">
          <a
            class="nl-link wizard-tokens-form__section-link"
            href="#typography"
            @click=${(event: MouseEvent) => this.handleModeSwitch(event, 'fonts')}
          >
            Typografie ${this.renderChevron()}
          </a>
          <a
            class="nl-link wizard-tokens-form__section-link"
            href="#colors"
            @click=${(event: MouseEvent) => this.handleModeSwitch(event, 'colors')}
          >
            Kleuren ${this.renderChevron()}
          </a>
          <a
            class="nl-link wizard-tokens-form__section-link"
            href="#spacing"
            @click=${(event: MouseEvent) => this.handleModeSwitch(event, 'spacing')}
          >
            Witruimte ${this.renderChevron()}
          </a>
        </div>
      `;
    }

    if (this.displayMode === 'fonts') {
      const fonts = [
        {
          docsUrl: 'https://nldesignsystem.nl/handboek/huisstijl/themas/start-thema/#lettertype',
          label: t('tokens.fieldLabels.headingFont'),
          path: HEADING_FONT_TOKEN_REF,
          token: this.theme.at(HEADING_FONT_TOKEN_REF),
        },
        {
          docsUrl: 'https://nldesignsystem.nl/handboek/huisstijl/themas/start-thema/#lettertype',
          label: t('tokens.fieldLabels.bodyFont'),
          path: BODY_FONT_TOKEN_REF,
          token: this.theme.at(BODY_FONT_TOKEN_REF),
        },
      ];
      return html`
        <wizard-stack size="4xl">
          <a href="#" class="nl-link" @click=${this.showInitialMode}>← Terug naar overzicht</a>
          <clippy-heading level="3">Typografie</clippy-heading>
          <wizard-stack size="2xl">
            ${fonts.map(
              ({ docsUrl, label, path, token }) =>
                html`<wizard-stack>
                  <wizard-font-input
                    .errors=${this.theme.issues.filter((error) => error.path === path)}
                    .value=${token.$value}
                    label=${label}
                    name=${path}
                  >
                    <div slot="label">${label}</div>
                  </wizard-font-input>
                  <p class="nl-paragraph">
                    <a href=${docsUrl} target="_blank" class="nl-link">Meer informatie</a>
                  </p>
                </wizard-stack>`,
            )}
          </wizard-stack>
          <clippy-button purpose="primary" @click=${this.showInitialMode}>Opslaan</clippy-button>
        </wizard-stack>
      `;
    }

    if (this.displayMode === 'colors') {
      return html`
        <wizard-stack size="4xl">
          <a href="#" class="nl-link" @click=${this.showInitialMode}>← Terug naar overzicht</a>
          <clippy-heading level="3">Kleuren</clippy-heading>
          <wizard-stack size="3xl">
            ${(() => {
              const basis = this.theme.tokens['basis'];
              const color =
                typeof basis === 'object' && basis !== null && 'color' in basis ? basis['color'] : undefined;
              const colorKeys = typeof color === 'object' && color !== null ? Object.keys(color) : [];
              return colorKeys
                .filter((name) => name !== 'transparent' && !name.includes('inverse'))
                .map(
                  (colorKey) => html`
                    <wizard-stack size="lg" class="wizard-form__color-field">
                      <clippy-heading level="4">
                        ${t(`tokens.fieldLabels.basis.color.${colorKey}.label`)}
                      </clippy-heading>
                      <p class="nl-paragraph">
                        PLACEHOLDER: hier moet de tekst komen uit de NLDS documentatie package.
                      </p>
                      <wizard-colorscale-input
                        key=${colorKey}
                        label=${t(`tokens.fieldLabels.basis.color.${colorKey}.label`)}
                        id=${`basis.color.${colorKey}`}
                        name=${`basis.color.${colorKey}`}
                        .colorToken=${this.theme.at(`basis.color.${colorKey}.color-default`)}
                      >
                      </wizard-colorscale-input>
                      <a class="nl-link" href=${t(`tokens.fieldLabels.basis.color.${colorKey}.docs`)} target="_blank">
                        Meer informatie
                      </a>
                    </wizard-stack>
                  `,
                );
            })()}
          </wizard-stack>
          <clippy-button purpose="primary" @click=${this.showInitialMode}>Opslaan</clippy-button>
        </wizard-stack>
      `;
    }

    return html`
      <wizard-stack size="4xl">
        <a href="#" class="nl-link" @click=${this.showInitialMode}>← Terug naar overzicht</a>
        <clippy-button purpose="primary" @click=${this.showInitialMode}>Opslaan</clippy-button>
      </wizard-stack>
    `;
  }
}
