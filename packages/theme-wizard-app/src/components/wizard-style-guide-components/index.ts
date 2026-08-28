import { consume } from '@lit/context';
import linkCss from '@nl-design-system-candidate/link-css/link.css?inline';
import paragraphCss from '@nl-design-system-candidate/paragraph-css/paragraph.css?inline';
import '@nl-design-system-community/clippy-components/clippy-heading';
import { SKIP, walkTokens, type BaseDesignToken } from '@nl-design-system-community/design-tokens-schema';
import { LitElement, html, nothing, unsafeCSS } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import type Theme from '../../lib/Theme';
import { themeContext } from '../../contexts/theme';
import { t } from '../../i18n';
import styles from '../wizard-style-guide/styles';

const tag = 'wizard-style-guide-components';

declare global {
  interface HTMLElementTagNameMap {
    [tag]: WizardStyleGuideComponents;
  }
}

@customElement(tag)
export class WizardStyleGuideComponents extends LitElement {
  @consume({ context: themeContext, subscribe: true })
  @state()
  private readonly theme!: Theme;

  static override readonly styles = [unsafeCSS(linkCss), unsafeCSS(paragraphCss), styles];

  #collectComponentTokens(componentConfig: Record<string, unknown>): BaseDesignToken[] {
    const tokens: BaseDesignToken[] = [];

    walkTokens(componentConfig, (token) => {
      tokens.push({
        ...token,
      });
      return SKIP;
    });

    return tokens;
  }

  override render() {
    const components = this.theme.tokens['nl'];
    if (!components) return nothing;

    return html`
      <div class="wizard-style-guide">
        <p class="nl-paragraph">
          <a class="nl-link" href="https://nldesignsystem.nl/componenten/" target="_blank">docs</a>
        </p>

        ${Object.entries(components).map(([componentId, componentConfig]) => {
          const tokens = this.#collectComponentTokens(componentConfig);

          return html`
            <clippy-heading level="3">${`nl.${componentId}`}</clippy-heading>
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
