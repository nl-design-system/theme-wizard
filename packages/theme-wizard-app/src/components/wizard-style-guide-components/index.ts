import { consume } from '@lit/context';
import codeCss from '@nl-design-system-candidate/code-css/code.css?inline';
import dataBadgeCss from '@nl-design-system-candidate/data-badge-css/data-badge.css?inline';
import linkCss from '@nl-design-system-candidate/link-css/link.css?inline';
import paragraphCss from '@nl-design-system-candidate/paragraph-css/paragraph.css?inline';
import '@nl-design-system-community/clippy-components/clippy-heading';
import {
  extractRef,
  isRef,
  isTokenLike,
  resolveRef,
  walkObject,
  type BaseDesignToken,
} from '@nl-design-system-community/design-tokens-schema';
import tableCss from '@utrecht/table-css/dist/index.css?inline';
import { LitElement, html, nothing, unsafeCSS } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import type Theme from '../../lib/Theme';
import { themeContext } from '../../contexts/theme';
import { t } from '../../i18n';
import styles from '../wizard-style-guide/styles';
import { renderTokenExample, stringifyTokenValue } from '../wizard-style-guide/utils';

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

  static override readonly styles = [
    unsafeCSS(dataBadgeCss),
    unsafeCSS(tableCss),
    unsafeCSS(codeCss),
    unsafeCSS(linkCss),
    unsafeCSS(paragraphCss),
    styles,
  ];

  #collectComponentTokens(
    componentConfig: Record<string, unknown>,
    componentId: string,
  ): {
    fullPath: string;
    tokenConfig: BaseDesignToken;
  }[] {
    const tokens: {
      fullPath: string;
      tokenConfig: BaseDesignToken;
    }[] = [];

    walkObject<BaseDesignToken>(componentConfig, isTokenLike, (tokenConfig: BaseDesignToken, path: string[]) => {
      const tokenId = path.join('.');
      const fullPath = `nl.${componentId}.${tokenId}`;
      tokens.push({
        fullPath,
        tokenConfig,
      });
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

        ${Object.entries(components).map(
          ([componentId, componentConfig]) => html`
            <wizard-table-scroller>
              <table class="utrecht-table">
                <caption class="utrecht-table__caption">
                  ${`nl.${componentId}`}
                </caption>
                <thead class="utrecht-table__header">
                  <tr class="utrecht-table__row">
                    <th scope="col" class="utrecht-table__header-cell">${t('styleGuide.sample')}</th>
                    <th scope="col" class="utrecht-table__header-cell">${t('styleGuide.tokenName')}</th>
                    <th scope="col" class="utrecht-table__header-cell">${t('styleGuide.reference')}</th>
                    <th scope="col" class="utrecht-table__header-cell">${t('styleGuide.value')}</th>
                  </tr>
                </thead>
                <tbody class="utrecht-table__body">
                  ${this.#collectComponentTokens(componentConfig as Record<string, unknown>, componentId).map(
                    ({ fullPath, tokenConfig }) => {
                      const resolvedValue = isRef(tokenConfig.$value)
                        ? resolveRef(this.theme.tokens, tokenConfig.$value)
                        : tokenConfig.$value;
                      const displayValue = stringifyTokenValue(resolvedValue);

                      return html`
                        <tr class="utrecht-table__row">
                          <td class="utrecht-table__cell">
                            ${renderTokenExample({
                              displayValue: displayValue,
                              tokenId: fullPath,
                              tokenType: tokenConfig.$type,
                            })}
                          </td>
                          <td class="utrecht-table__cell">
                            <span class="nl-data-badge">${fullPath}</span>
                          </td>
                          <td class="utrecht-table__cell">
                            ${isRef(tokenConfig.$value)
                              ? html`<span class="nl-data-badge">${extractRef(tokenConfig.$value)}</span>`
                              : nothing}
                          </td>
                          <td class="utrecht-table__cell">
                            <code class="nl-code">${displayValue}</code>
                          </td>
                        </tr>
                      `;
                    },
                  )}
                </tbody>
              </table>
            </wizard-table-scroller>
          `,
        )}
      </div>
    `;
  }
}
