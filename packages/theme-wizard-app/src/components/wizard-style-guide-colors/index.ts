import { consume } from '@lit/context';
import codeCss from '@nl-design-system-candidate/code-css/code.css?inline';
import colorSampleCss from '@nl-design-system-candidate/color-sample-css/color-sample.css?inline';
import dataBadgeCss from '@nl-design-system-candidate/data-badge-css/data-badge.css?inline';
import '@nl-design-system-community/clippy-components/clippy-heading';
import '@nl-design-system-community/clippy-components/clippy-toggletip';
import linkCss from '@nl-design-system-candidate/link-css/link.css?inline';
import paragraphCss from '@nl-design-system-candidate/paragraph-css/paragraph.css?inline';
import '@nl-design-system-community/clippy-components/clippy-color-sample';
import ClipboardCopyIcon from '@tabler/icons/outline/clipboard-copy.svg?raw';
import buttonLinkStyles from '@utrecht/link-button-css?inline';
import tableCss from '@utrecht/table-css/dist/index.css?inline';
import Color from 'colorjs.io';
import { LitElement, html, unsafeCSS } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import type Theme from '../../lib/Theme';
import type { DisplayToken } from '../wizard-style-guide/types';
import { themeContext } from '../../contexts/theme';
import { t } from '../../i18n';
import styles from '../wizard-style-guide/styles';
import { openTokenDialog, prepareColorGroups, renderTokenDialog } from '../wizard-style-guide/utils';

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

  @state() private activeToken?: DisplayToken;

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

  #openDialog(displayValue: string, tokenId: string, usage: string[]) {
    const color = new Color(displayValue);
    openTokenDialog(
      {
        displayValue,
        metadata: {
          OKLCH: color.toString({ format: 'oklch' }),
          'P3 Color': color.toString({ format: 'color' }),
          RGB: color.toString({ format: 'rgb' }),
        },
        tokenId,
        tokenType: 'color',
        usage,
      },
      this.renderRoot,
      (token) => {
        this.activeToken = token;
      },
    );
  }

  override render() {
    const basis = this.theme.tokens['basis'] as Record<string, unknown>;
    const colors = basis['color'] as Record<string, unknown>;
    const colorGroups = prepareColorGroups(colors);

    return html`
      <div class="wizard-style-guide">
        ${colorGroups.map(({ colorEntries, key }) => {
          return html`
            <wizard-table-scroller>
              <table class="utrecht-table">
                <caption class="utrecht-table__caption">
                  ${t(`tokens.fieldLabels.basis.color.${key}.label`)}
                </caption>
                <thead class="utrecht-table__header">
                  <tr class="utrecht-table__row">
                    <th scope="col" class="utrecht-table__header-cell">${t('styleGuide.sample')}</th>
                    <th scope="col" class="utrecht-table__header-cell">${t('styleGuide.tokenName')}</th>
                    <th scope="col" class="utrecht-table__header-cell">
                      ${t('styleGuide.sections.colors.table.header.hexCode')}
                    </th>
                    <th scope="col" class="utrecht-table__header-cell">${t('styleGuide.details')}</th>
                  </tr>
                </thead>
                <tbody class="utrecht-table__body">
                  ${colorEntries.map(
                    ({ displayValue, tokenId, usage }) => html`
                      <tr class="utrecht-table__row">
                        <td class="utrecht-table__cell">
                          <clippy-color-sample color=${displayValue}></clippy-color-sample>
                        </td>
                        <td class="utrecht-table__cell">
                          <span class="nl-data-badge" id=${tokenId}>${tokenId}</span>
                          <clippy-toggletip text=${t('copyToClipboard')}>
                            <clippy-button
                              icon-only
                              purpose="subtle"
                              size="small"
                              @click=${() => navigator.clipboard.writeText(tokenId)}
                            >
                              ${t('copyValueToClipboard', { value: tokenId })}
                              <clippy-icon size="small" slot="iconEnd">${unsafeSVG(ClipboardCopyIcon)}</clippy-icon>
                            </clippy-button>
                          </clippy-toggletip>
                        </td>
                        <td class="utrecht-table__cell">
                          <code class="nl-code" id=${displayValue}>${displayValue}</code>
                          <clippy-toggletip text=${t('copyToClipboard')}>
                            <clippy-button
                              purpose="subtle"
                              icon-only
                              size="small"
                              @click=${() => navigator.clipboard.writeText(displayValue)}
                            >
                              ${t('copyValueToClipboard', { value: displayValue })}
                              <clippy-icon size="small" slot="iconEnd">${unsafeSVG(ClipboardCopyIcon)}</clippy-icon>
                            </clippy-button>
                          </clippy-toggletip>
                        </td>
                        <td class="utrecht-table__cell">
                          <button
                            type="button"
                            class="utrecht-link-button utrecht-link-button--html-button"
                            @click=${() => this.#openDialog(displayValue, tokenId, usage)}
                          >
                            ${t('styleGuide.showDetails')}
                          </button>
                        </td>
                      </tr>
                    `,
                  )}
                </tbody>
              </table>
            </wizard-table-scroller>

            <p class="nl-paragraph">
              <a class="nl-link" target="_blank" href=${t(`tokens.fieldLabels.basis.color.${key}.docs`)}>docs</a>
            </p>
          `;
        })}
      </div>

      ${renderTokenDialog(this.activeToken)}
    `;
  }
}
