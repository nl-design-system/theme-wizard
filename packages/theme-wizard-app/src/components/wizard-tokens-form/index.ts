import { consume } from '@lit/context';
import linkCss from '@nl-design-system-candidate/link-css/link.css?inline';
import paragraphCss from '@nl-design-system-candidate/paragraph-css/paragraph.css?inline';
import '@nl-design-system-community/clippy-components/clippy-heading';
import srOnlyStyles from '@nl-design-system-community/clippy-components/lib/sr-only';
import accent1Docs from '@nl-design-system-unstable/documentation/handboek/huisstijl-vastleggen/themas/_basis-color-accent-1-intro.md?raw';
import accent2Docs from '@nl-design-system-unstable/documentation/handboek/huisstijl-vastleggen/themas/_basis-color-accent-2-intro.md?raw';
import accent3Docs from '@nl-design-system-unstable/documentation/handboek/huisstijl-vastleggen/themas/_basis-color-accent-3-intro.md?raw';
import action1Docs from '@nl-design-system-unstable/documentation/handboek/huisstijl-vastleggen/themas/_basis-color-action-1-intro.md?raw';
import action2Docs from '@nl-design-system-unstable/documentation/handboek/huisstijl-vastleggen/themas/_basis-color-action-2-intro.md?raw';
import defaultDocs from '@nl-design-system-unstable/documentation/handboek/huisstijl-vastleggen/themas/_basis-color-default-intro.md?raw';
import disabledDocs from '@nl-design-system-unstable/documentation/handboek/huisstijl-vastleggen/themas/_basis-color-disabled-intro.md?raw';
import highlightDocs from '@nl-design-system-unstable/documentation/handboek/huisstijl-vastleggen/themas/_basis-color-highlight-intro.md?raw';
import infoDocs from '@nl-design-system-unstable/documentation/handboek/huisstijl-vastleggen/themas/_basis-color-info-intro.md?raw';
import negativeDocs from '@nl-design-system-unstable/documentation/handboek/huisstijl-vastleggen/themas/_basis-color-negative-intro.md?raw';
import positiveDocs from '@nl-design-system-unstable/documentation/handboek/huisstijl-vastleggen/themas/_basis-color-positive-intro.md?raw';
import selectedDocs from '@nl-design-system-unstable/documentation/handboek/huisstijl-vastleggen/themas/_basis-color-selected-intro.md?raw';
import warningDocs from '@nl-design-system-unstable/documentation/handboek/huisstijl-vastleggen/themas/_basis-color-warning-intro.md?raw';
import ChevronLeft from '@tabler/icons/outline/chevron-left.svg?raw';
import ChevronRight from '@tabler/icons/outline/chevron-right.svg?raw';
import buttonLinkCss from '@utrecht/link-button-css/dist/index.css?inline';
import '../wizard-layout';
import '../wizard-preview';
import '../wizard-token-field';
import '../wizard-font-input';
import '../wizard-download-confirmation';
import '../wizard-validation-issues-alert';

const colorDocs: Record<string, string> = {
  'accent-1': accent1Docs,
  'accent-2': accent2Docs,
  'accent-3': accent3Docs,
  'action-1': action1Docs,
  'action-2': action2Docs,
  default: defaultDocs,
  disabled: disabledDocs,
  highlight: highlightDocs,
  info: infoDocs,
  negative: negativeDocs,
  positive: positiveDocs,
  selected: selectedDocs,
  warning: warningDocs,
};
import { LitElement, TemplateResult, html, unsafeCSS } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import type Theme from '../../lib/Theme';
import { themeContext } from '../../contexts/theme';
import { t } from '../../i18n';
import '@vanillawc/wc-markdown';
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
  static override readonly styles = [
    unsafeCSS(srOnlyStyles),
    unsafeCSS(linkCss),
    unsafeCSS(paragraphCss),
    unsafeCSS(buttonLinkCss),
    styles,
  ];

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

  private readonly renderBackLink = () => {
    return html`
      <button
        type="button"
        @click=${this.showInitialMode}
        class="utrecht-link-button utrecht-link-button--html-button wizard-tokens-form__back-button"
      >
        ${unsafeSVG(ChevronLeft)} ${t('tokens.backToOverview')}
      </button>
    `;
  };

  private readonly renderSaveButton = () => {
    return html` <clippy-button purpose="primary" @click=${this.showInitialMode}> ${t('save')} </clippy-button> `;
  };

  override render() {
    if (this.displayMode === 'initial') {
      const buttons: Array<{ id: Exclude<DisplayMode, 'initial'>; title: string | TemplateResult }> = [
        { id: 'fonts', title: t('tokens.fieldLabels.basis.typography') },
        { id: 'colors', title: t('tokens.fieldLabels.basis.colors') },
        { id: 'spacing', title: t('tokens.fieldLabels.basis.spacing') },
      ];
      return html`
        <wizard-stack size="4xl">
          <clippy-heading level="3">${t('nav.configure')}</clippy-heading>
          <div class="wizard-tokens-form__section-links">
            ${buttons.map(
              ({ id, title }) => html`
                <button
                  type="button"
                  class="utrecht-link-button utrecht-link-button--html-button wizard-tokens-form__section-link"
                  @click=${(event: MouseEvent) => this.handleModeSwitch(event, id)}
                >
                  ${title}
                  <span class="wizard-tokens-form__section-link-icon"> ${unsafeSVG(ChevronRight)} </span>
                </button>
              `,
            )}
          </div>

          <wizard-tokens-download></wizard-tokens-download>
          <wizard-theme-reset-button></wizard-theme-reset-button>
        </wizard-stack>
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
          ${this.renderBackLink()}
          <clippy-heading level="3">${t('tokens.fieldLabels.basis.typography')}</clippy-heading>

          <wizard-scroll-container>
            <wizard-stack size="2xl">
              ${fonts.map(
                ({ docsUrl, label, path, token }) =>
                  html`<wizard-stack class="wizard-form__field">
                    <clippy-heading level="4">${label}</clippy-heading>
                    <wizard-font-input
                      .errors=${this.theme.issues.filter((error) => error.path === path)}
                      .value=${token.$value}
                      label=${label}
                      name=${path}
                    >
                      <div slot="label">${label}</div>
                    </wizard-font-input>
                    <p class="nl-paragraph">
                      <a href=${docsUrl} target="_blank" class="nl-link">
                        <span aria-hidden="true">${t('moreInformationCompact')}</span>
                        <span class="sr-only">${t('moreInformation', { text: label })}</span>
                      </a>
                    </p>
                  </wizard-stack>`,
              )}
            </wizard-stack>
          </wizard-scroll-container>

          ${this.renderSaveButton()}
        </wizard-stack>
      `;
    }

    if (this.displayMode === 'colors') {
      return html`
        <wizard-stack size="4xl">
          ${this.renderBackLink()}
          <clippy-heading level="3">${t('tokens.fieldLabels.basis.colors')}</clippy-heading>

          <wizard-scroll-container>
            <wizard-stack size="3xl">
              ${Object.entries(colorDocs).map(
                ([colorKey, docs]) => html`
                  <wizard-stack size="lg" class="wizard-form__field">
                    <clippy-heading level="4">${t(`tokens.fieldLabels.basis.color.${colorKey}.label`)}</clippy-heading>
                    <wc-markdown class="wizard-tokens-form__markdown">${docs}</wc-markdown>
                    <wizard-colorscale-input
                      key=${colorKey}
                      label=${t(`tokens.fieldLabels.basis.color.${colorKey}.label`)}
                      id=${`basis.color.${colorKey}`}
                      name=${`basis.color.${colorKey}`}
                      .colorToken=${this.theme.at(`basis.color.${colorKey}.color-default`)}
                    >
                    </wizard-colorscale-input>
                    <a class="nl-link" href=${t(`tokens.fieldLabels.basis.color.${colorKey}.docs`)} target="_blank">
                      <span aria-hidden="true">${t('moreInformationCompact')}</span>
                      <span class="sr-only">
                        ${t('moreInformation', { text: t(`tokens.fieldLabels.basis.color.${colorKey}.label`) })}
                      </span>
                    </a>
                  </wizard-stack>
                `,
              )}
            </wizard-stack>
          </wizard-scroll-container>

          ${this.renderSaveButton()}
        </wizard-stack>
      `;
    }

    // TODO: We don't have inputs to control spacing yet, but we can render the section
    return html`
      <wizard-stack size="4xl">
        ${this.renderBackLink()}
        <clippy-heading level="3">${t('tokens.fieldLabels.basis.spacing')}</clippy-heading>

        <wizard-scroll-container>
          <div
            aria-hidden="true"
            style="block-size: var(--basis-size-2xl); border: var(--basis-border-width-sm) solid var(--basis-color-accent-1-border-subtle); background-color: var(--basis-color-accent-1-bg-default);"
          >
            Placeholder (add controls here)
          </div>
        </wizard-scroll-container>

        ${this.renderSaveButton()}
      </wizard-stack>
    `;
  }
}
