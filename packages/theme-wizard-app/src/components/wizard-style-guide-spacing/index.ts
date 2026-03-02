import { consume } from '@lit/context';
import codeCss from '@nl-design-system-candidate/code-css/code.css?inline';
import dataBadgeCss from '@nl-design-system-candidate/data-badge-css/data-badge.css?inline';
import '@nl-design-system-community/clippy-components/clippy-heading';
import { type DimensionToken } from '@nl-design-system-community/design-tokens-schema';
import tableCss from '@utrecht/table-css/dist/index.css?inline';
import { LitElement, html, unsafeCSS } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import type Theme from '../../lib/Theme';
import type { DisplayToken, SpaceToken } from '../wizard-style-guide/types';
import { themeContext } from '../../contexts/theme';
import { t } from '../../i18n';
import styles from '../wizard-style-guide/styles';
import {
  countUsagePerToken,
  openTokenDialog,
  renderSpacingExample,
  renderTokenDialog,
} from '../wizard-style-guide/utils';

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

  @state() private activeToken?: DisplayToken;

  static override readonly styles = [unsafeCSS(dataBadgeCss), unsafeCSS(tableCss), unsafeCSS(codeCss), styles];

  #prepareSpaceTokens(basis: Record<string, unknown>, space: string, tokenUsage: Map<string, string[]>): SpaceToken[] {
    return Object.entries((basis['space'] as Record<string, unknown>)[space] as Record<string, unknown>)
      .filter(([name]) => !['min', 'max'].includes(name))
      .reverse()
      .map(([name, tokenValue]) => {
        const value = (tokenValue as DimensionToken).$value;
        const stringifiedValue = typeof value === 'string' ? value : value.value + value.unit;
        const tokenId = `basis.space.${space}.${name}`;
        const usage = tokenUsage.get(tokenId) || [];
        const usageCount = usage.length ?? 0;
        return { name, tokenId, usage, usageCount, value: stringifiedValue };
      });
  }

  #openDialog(token: DisplayToken) {
    openTokenDialog(token, this.renderRoot, (t) => {
      this.activeToken = t;
    });
  }

  override render() {
    const basis = this.theme.tokens['basis'] as Record<string, unknown>;
    const tokenUsage = countUsagePerToken(this.theme.tokens);
    const spaceTypes = ['block', 'inline', 'text', 'column', 'row'];
    const spacingData = spaceTypes.map((space) => ({
      space,
      tokens: this.#prepareSpaceTokens(basis, space, tokenUsage),
    }));

    return html`
      <div class="wizard-style-guide">
        <utrecht-paragraph>
          <a href="https://nldesignsystem.nl/richtlijnen/stijl/ruimte/spacing-concepten/" target="_blank"> docs </a>
        </utrecht-paragraph>

        ${spacingData.map(({ space, tokens }) => {
          const captionId = `styleguide-section-space-${space}-title`;
          return html`
            <table class="utrecht-table" aria-labelledby=${captionId}>
              <caption class="utrecht-table__caption" id=${captionId}>
                ${t(`styleGuide.sections.space.${space}.title`)}
              </caption>
              <thead class="utrecht-table__header">
                <tr class="utrecht-table__row">
                  <th scope="col" class="utrecht-table__header-cell">${t('styleGuide.sample')}</th>
                  <th scope="col" class="utrecht-table__header-cell">${t('styleGuide.tokenName')}</th>
                  <th scope="col" class="utrecht-table__header-cell">${t('styleGuide.value')}</th>
                  <th scope="col" class="utrecht-table__header-cell">${t('styleGuide.details')}</th>
                </tr>
              </thead>
              <tbody class="utrecht-table__body">
                ${tokens.map(
                  ({ name, tokenId, usage, value }) => html`
                    <tr class="utrecht-table__row">
                      <td class="utrecht-table__cell">${renderSpacingExample(value, space)}</td>
                      <td class="utrecht-table__cell">
                        <clippy-button purpose="subtle" @click=${() => navigator.clipboard.writeText(tokenId)}>
                          <span class="nl-data-badge" id="${`basis-space-${space}-${name}`}">${tokenId}</span>
                        </clippy-button>
                      </td>
                      <td class="utrecht-table__cell">
                        <clippy-button purpose="subtle" @click=${() => navigator.clipboard.writeText(value)}>
                          <code class="nl-code">${value}</code>
                        </clippy-button>
                      </td>

                      <td class="utrecht-table__cell">
                        <clippy-button
                          purpose="secondary"
                          @click=${() =>
                            this.#openDialog({
                              displayValue: value,
                              metadata: { space },
                              tokenId,
                              tokenType: 'dimension',
                              usage,
                            })}
                        >
                          ${t('styleGuide.showDetails')}
                        </clippy-button>
                      </td>
                    </tr>
                  `,
                )}
              </tbody>
            </table>

            <utrecht-paragraph>
              <a href="https://nldesignsystem.nl/richtlijnen/stijl/ruimte/spacing-concepten/#${space}" target="_blank">
                docs
              </a>
            </utrecht-paragraph>
          `;
        })}
      </div>

      ${renderTokenDialog(this.activeToken)}
    `;
  }
}
