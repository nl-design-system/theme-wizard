import { consume } from '@lit/context';
import codeCss from '@nl-design-system-candidate/code-css/code.css?inline';
import colorSampleCss from '@nl-design-system-candidate/color-sample-css/color-sample.css?inline';
import dataBadgeCss from '@nl-design-system-candidate/data-badge-css/data-badge.css?inline';
import '@nl-design-system-community/clippy-components/clippy-heading';
import '@nl-design-system-community/clippy-components/clippy-toggletip';
import linkCss from '@nl-design-system-candidate/link-css/link.css?inline';
import paragraphCss from '@nl-design-system-candidate/paragraph-css/paragraph.css?inline';
import { type ColorToken as ColorTokenType, stringifyColor } from '@nl-design-system-community/design-tokens-schema';
import ClipboardCopyIcon from '@tabler/icons/outline/clipboard-copy.svg?raw';
import tableCss from '@utrecht/table-css/dist/index.css?inline';
import Color from 'colorjs.io';
import { LitElement, html, unsafeCSS } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import type Theme from '../../lib/Theme';
import type { ColorGroup, DisplayToken } from '../wizard-style-guide/types';
import { themeContext } from '../../contexts/theme';
import { t } from '../../i18n';
import { resolveColorValue } from '../wizard-colorscale-input';
import styles from '../wizard-style-guide/styles';
import { countUsagePerToken, openTokenDialog, renderTokenDialog } from '../wizard-style-guide/utils';

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
    styles,
  ];

  #prepareColorGroups(colors: Record<string, unknown>, tokenUsage: Map<string, string[]>): ColorGroup[] {
    return Object.entries(colors)
      .filter(([key]) => !key.includes('inverse') && !key.includes('transparent'))
      .filter(([, value]) => typeof value === 'object' && value !== null)
      .map(([key, value]) => {
        const colorEntries = Object.entries(value as Record<string, unknown>)
          .filter(([, token]) => typeof token === 'object' && token !== null && '$value' in token)
          .map(([colorKey, token]) => {
            const color = resolveColorValue(token as ColorTokenType, this.theme.tokens);
            const displayValue = color ? stringifyColor(color) : '#000';
            const tokenId = `basis.color.${key}.${colorKey}`;
            const usage = tokenUsage.get(tokenId) || [];
            const usageCount = usage.length;
            return { colorKey, displayValue, tokenId, usage, usageCount };
          })
          .filter(({ displayValue }) => displayValue !== null);
        return { colorEntries, key };
      });
  }

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
    const tokenUsage = countUsagePerToken(this.theme.tokens);
    const colorGroups = this.#prepareColorGroups(colors, tokenUsage);

    return html`
      <div class="wizard-style-guide">
        ${colorGroups.map(({ colorEntries, key }) => {
          return html`
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
                        <wizard-color-sample color=${displayValue}></wizard-color-sample>
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
                            ${t('copyToClipboard')}
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
                            ${t('copyToClipboard')}
                            <clippy-icon size="small" slot="iconEnd">${unsafeSVG(ClipboardCopyIcon)}</clippy-icon>
                          </clippy-button>
                        </clippy-toggletip>
                      </td>
                      <td class="utrecht-table__cell">
                        <clippy-button
                          purpose="secondary"
                          @click=${() => this.#openDialog(displayValue, tokenId, usage)}
                        >
                          ${t('styleGuide.showDetails')}
                        </clippy-button>
                      </td>
                    </tr>
                  `,
                )}
              </tbody>
            </table>
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
