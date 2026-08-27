import { consume } from '@lit/context';
import codeCss from '@nl-design-system-candidate/code-css/code.css?inline';
import dataBadgeCss from '@nl-design-system-candidate/data-badge-css/data-badge.css?inline';
import '@nl-design-system-community/clippy-components/clippy-heading';
import '@nl-design-system-community/clippy-components/clippy-toggletip';
import linkCss from '@nl-design-system-candidate/link-css/link.css?inline';
import paragraphCss from '@nl-design-system-candidate/paragraph-css/paragraph.css?inline';
import { TokenGroup, TokenPath } from '@nl-design-system-community/clippy-components/clippy-reset-theme';
import buttonLinkStyles from '@utrecht/link-button-css?inline';
import tableCss from '@utrecht/table-css/dist/index.css?inline';
import { LitElement, html, unsafeCSS } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import type Theme from '../../lib/Theme';
import { themeContext } from '../../contexts/theme';
import { t } from '../../i18n';
import styles from '../wizard-style-guide/styles';
import { getTokenCollectionByTokenPaths } from '../wizard-style-guide/utils';

const tag = 'wizard-style-guide-spacing';

declare global {
  interface HTMLElementTagNameMap {
    [tag]: WizardStyleGuideSpacing;
  }
}

@customElement(tag)
export class WizardStyleGuideSpacing extends LitElement {
  @consume({ context: themeContext, subscribe: true })
  @state()
  private readonly theme!: Theme;

  static override readonly styles = [
    unsafeCSS(dataBadgeCss),
    unsafeCSS(tableCss),
    unsafeCSS(codeCss),
    unsafeCSS(paragraphCss),
    unsafeCSS(linkCss),
    unsafeCSS(buttonLinkStyles),
    styles,
  ];

  override render() {
    const basis = this.theme.tokens['basis'] as Record<string, unknown>;
    const spaceTypes = ['inline', 'block', 'text', 'column', 'row'];

    const paths: TokenPath[] = Object.keys(basis['space'] as TokenGroup).map((key) => `basis.space.${key}`.split('.'));
    const tokenCollection = getTokenCollectionByTokenPaths(this.theme.tokens, paths);

    // sort tokencollection based on spaceTypes
    tokenCollection.sort((a, b) => {
      const aType = a.name.split('.')[2];
      const bType = b.name.split('.')[2];
      return spaceTypes.indexOf(aType) - spaceTypes.indexOf(bType);
    });

    return html`
      <div class="wizard-style-guide">
        <p class="nl-paragraph">
          <a
            class="nl-link"
            href="https://nldesignsystem.nl/richtlijnen/stijl/ruimte/spacing-concepten/"
            target="_blank"
          >
            docs
          </a>
        </p>

        ${tokenCollection.map(({ name, tokens }) => {
          const concept = name.split('.').slice(-1)[0];
          const captionId = `styleguide-section-${concept}-title`;
          return html`
            <clippy-heading level="3" id=${captionId}
              >${t(`styleGuide.sections.space.${concept}.title`)}</clippy-heading
            >
            <p class="nl-paragraph">
              <a
                class="nl-link"
                href="https://nldesignsystem.nl/richtlijnen/stijl/ruimte/spacing-concepten/#${concept}"
                target="_blank"
              >
                docs
              </a>
            </p>
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
          `;
        })}
      </div>
    `;
  }
}
