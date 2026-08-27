import { consume } from '@lit/context';
import codeCss from '@nl-design-system-candidate/code-css/code.css?inline';
import colorSampleCss from '@nl-design-system-candidate/color-sample-css/color-sample.css?inline';
import dataBadgeCss from '@nl-design-system-candidate/data-badge-css/data-badge.css?inline';
import '@nl-design-system-community/clippy-components/clippy-heading';
import '@nl-design-system-community/clippy-components/clippy-toggletip';
import linkCss from '@nl-design-system-candidate/link-css/link.css?inline';
import paragraphCss from '@nl-design-system-candidate/paragraph-css/paragraph.css?inline';
import '@nl-design-system-community/clippy-components/clippy-color-sample';
import { TokenPath } from '@nl-design-system-community/clippy-components/clippy-reset-theme';
import buttonLinkStyles from '@utrecht/link-button-css?inline';
import tableCss from '@utrecht/table-css/dist/index.css?inline';
import { LitElement, html, unsafeCSS } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import type Theme from '../../lib/Theme';
import { themeContext } from '../../contexts/theme';
import { t } from '../../i18n';
import styles from '../wizard-style-guide/styles';
import { getTokenCollectionByTokenPaths } from '../wizard-style-guide/utils';

const tag = 'wizard-style-guide-colors';

declare global {
  interface HTMLElementTagNameMap {
    [tag]: WizardStyleGuideColors;
  }
}

@customElement(tag)
export class WizardStyleGuideColors extends LitElement {
  @consume({ context: themeContext, subscribe: true })
  @state()
  private readonly theme!: Theme;

  static override readonly styles = [
    unsafeCSS(dataBadgeCss),
    unsafeCSS(tableCss),
    unsafeCSS(colorSampleCss),
    unsafeCSS(codeCss),
    unsafeCSS(paragraphCss),
    unsafeCSS(linkCss),
    unsafeCSS(buttonLinkStyles),
    styles,
  ];

  override render() {
    const basis = this.theme.tokens['basis'] as Record<string, unknown>;
    const colors = basis['color'] as Record<string, unknown>;
    const paths: TokenPath[] = Object.keys(colors)
      .filter((key) => !key.includes('inverse') && !key.includes('transparent'))
      .map((key) => `basis.color.${key}`.split('.'));
    const tokenCollection = getTokenCollectionByTokenPaths(this.theme.tokens, paths);

    return html`
      <div class="wizard-style-guide">
        ${tokenCollection.map(({ name, tokens }) => {
          return html`
            <clippy-heading level="3">${t(`tokens.fieldLabels.${name}.label`)}</clippy-heading>
            <clippy-token-table
              .tokens=${tokens}
              example-label=${t('styleGuide.sample')}
              token-id-label=${t('styleGuide.tokenName')}
              value-label=${t('styleGuide.value')}
              details-label=${t('styleGuide.details')}
              show-details-label=${t('styleGuide.showDetails')}
              copy-to-clipboard-label=${t('styleGuide.detailsDialog.copyToClipboard')}
              reference-title-label=${t('styleGuide.detailsDialog.tokenReferenceList.title')}
              reference-empty-label=${t('styleGuide.detailsDialog.tokenReferenceList.empty')}
            ></clippy-token-table>

            <p class="nl-paragraph">
              <a class="nl-link" target="_blank" href=${t(`tokens.fieldLabels.${name}.docs`)}>docs</a>
            </p>
          `;
        })}
      </div>
    `;
  }
}
