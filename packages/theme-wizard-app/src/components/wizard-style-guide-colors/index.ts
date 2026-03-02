import type { ClippyModal } from '@nl-design-system-community/clippy-components/clippy-modal';
import { consume } from '@lit/context';
import codeCss from '@nl-design-system-candidate/code-css/code.css?inline';
import colorSampleCss from '@nl-design-system-candidate/color-sample-css/color-sample.css?inline';
import dataBadgeCss from '@nl-design-system-candidate/data-badge-css/data-badge.css?inline';
import '@nl-design-system-community/clippy-components/clippy-modal';
import '@nl-design-system-community/clippy-components/clippy-heading';
import { type ColorToken as ColorTokenType, stringifyColor } from '@nl-design-system-community/design-tokens-schema';
import tableCss from '@utrecht/table-css/dist/index.css?inline';
import Color from 'colorjs.io';
import { LitElement, html, nothing, unsafeCSS } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import type Theme from '../../lib/Theme';
import type { ColorGroup, DisplayToken } from '../wizard-style-guide/types';
import { themeContext } from '../../contexts/theme';
import { t } from '../../i18n';
import { resolveColorValue } from '../wizard-colorscale-input';
import styles from '../wizard-style-guide/styles';
import { countUsagePerToken, renderColorSample, renderTokenExample } from '../wizard-style-guide/utils';

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

  #activeToken?: DisplayToken;

  static override readonly styles = [
    unsafeCSS(dataBadgeCss),
    unsafeCSS(tableCss),
    unsafeCSS(colorSampleCss),
    unsafeCSS(codeCss),
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
            const isUsed = tokenUsage.has(tokenId);
            const usage = tokenUsage.get(tokenId) || [];
            const usageCount = usage.length;
            return { colorKey, displayValue, isUsed, tokenId, usage, usageCount };
          })
          .filter(({ displayValue }) => displayValue !== null);
        return { colorEntries, isUsed: colorEntries.some((color) => color.isUsed), key };
      });
  }

  #setActiveToken(token: DisplayToken | undefined) {
    this.#activeToken = token;

    if (token !== undefined) {
      this.requestUpdate();
      const dialog = this.renderRoot.querySelector('#token-dialog')! as ClippyModal;

      dialog.addEventListener(
        'close',
        () => {
          this.#activeToken = undefined;
        },
        { once: true },
      );
      dialog.open();
    }
  }

  #renderTokenDialog() {
    return html`
      <clippy-modal
        id="token-dialog"
        title=${this.#activeToken?.tokenId}
        open=${this.#activeToken !== undefined}
        actions="none"
      >
        ${this.#activeToken
          ? html`
              <clippy-heading level=${3}>${t('styleGuide.sample')}</clippy-heading>
              ${renderTokenExample(this.#activeToken)}
              <dl>
                <dt>Token type</dt>
                <dd>
                  <code class="nl-code">${this.#activeToken.tokenType}</code>
                </dd>
                <dt>Token ID</dt>
                <dd>
                  <span class="nl-data-badge">${this.#activeToken.tokenId}</span>
                </dd>
                <dt>CSS Variable</dt>
                <dd>
                  <code class="nl-code">${`--${this.#activeToken.tokenId.replaceAll('.', '-')}`}</code>
                </dd>
                <dt>${t('styleGuide.value')}</dt>
                <dd>
                  <code class="nl-code">${this.#activeToken.displayValue}</code>
                </dd>
                ${this.#activeToken.metadata
                  ? Object.entries(this.#activeToken.metadata).map(
                      ([key, value]) => html`
                        <dt>${key}</dt>
                        <dd>
                          <code class="nl-code">${value}</code>
                        </dd>
                      `,
                    )
                  : nothing}
              </dl>

              <clippy-heading level=${3}>
                ${t('styleGuide.detailsDialog.tokenReferenceList.title')}
                <data>(${this.#activeToken.usage.length}&times;)</data>
              </clippy-heading>
              ${this.#activeToken.usage.length > 0
                ? html`
                    <ul>
                      ${this.#activeToken.usage.map(
                        (referrer) => html`
                          <li>
                            <span class="nl-data-badge">${referrer}</span>
                          </li>
                        `,
                      )}
                    </ul>
                  `
                : html`
                    <utrecht-paragraph>${t('styleGuide.detailsDialog.tokenReferenceList.empty')}</utrecht-paragraph>
                  `}
            `
          : nothing}
      </clippy-modal>
    `;
  }

  override render() {
    if (!this.theme) {
      return t('loading');
    }

    const basis = this.theme.tokens['basis'] as Record<string, unknown>;
    const colors = basis['color'] as Record<string, unknown>;
    const tokenUsage = countUsagePerToken(this.theme.tokens);
    const colorGroups = this.#prepareColorGroups(colors, tokenUsage);

    return html`
      <section>
        <clippy-heading level=${2}>${t('styleGuide.sections.colors.title')}</clippy-heading>

        ${colorGroups.map(({ colorEntries, isUsed, key }) => {
          return html`
            <utrecht-table>
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
                    ({ displayValue, isUsed, tokenId, usage }) => html`
                      <tr
                        aria-describedby=${isUsed ? nothing : `basis-color-${key}-unused-warning`}
                        class="utrecht-table__row"
                      >
                        <td class="utrecht-table__cell">${renderColorSample(displayValue, tokenId)}</td>
                        <td class="utrecht-table__cell">
                          <utrecht-button
                            appearance="subtle-button"
                            @click=${() => navigator.clipboard.writeText(tokenId)}
                          >
                            <span class="nl-data-badge" id=${tokenId}>${tokenId}</span>
                          </utrecht-button>
                        </td>
                        <td class="utrecht-table__cell">
                          <utrecht-button
                            appearance="subtle-button"
                            @click=${() => navigator.clipboard.writeText(displayValue)}
                          >
                            <code class="nl-code" id=${displayValue}>${displayValue}</code>
                          </utrecht-button>
                        </td>
                        <td class="utrecht-table__cell">
                          <utrecht-button
                            @click=${() => {
                              const color = new Color(displayValue);
                              this.#setActiveToken({
                                displayValue,
                                isUsed,
                                metadata: {
                                  OKLCH: color.toString({ format: 'oklch' }),
                                  'P3 Color': color.toString({ format: 'color' }),
                                  RGB: color.toString({ format: 'rgb' }),
                                },
                                tokenId,
                                tokenType: 'color',
                                usage,
                              });
                            }}
                          >
                            ${t('styleGuide.showDetails')}
                          </utrecht-button>
                        </td>
                      </tr>
                    `,
                  )}
                </tbody>
              </table>
            </utrecht-table>
            <utrecht-paragraph>
              <a target="_blank" href=${t(`tokens.fieldLabels.basis.color.${key}.docs`)}>docs</a>
            </utrecht-paragraph>
            ${isUsed
              ? nothing
              : html`<utrecht-paragraph id="basis-color-${key}-unused-warning" class="wizard-token-unused">
                  ${t('styleGuide.unusedTokenWarning')}
                </utrecht-paragraph>`}
          `;
        })}
      </section>

      ${this.#renderTokenDialog()}
    `;
  }
}
