import type { ClippyModal } from '@nl-design-system-community/clippy-components/clippy-modal';
import { consume } from '@lit/context';
import codeCss from '@nl-design-system-candidate/code-css/code.css?inline';
import dataBadgeCss from '@nl-design-system-candidate/data-badge-css/data-badge.css?inline';
import '@nl-design-system-community/clippy-components/clippy-modal';
import '@nl-design-system-community/clippy-components/clippy-heading';
import { type DimensionToken } from '@nl-design-system-community/design-tokens-schema';
import tableCss from '@utrecht/table-css/dist/index.css?inline';
import { LitElement, html, nothing, unsafeCSS } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import type Theme from '../../lib/Theme';
import type { DisplayToken, SpaceToken } from '../wizard-style-guide/types';
import { themeContext } from '../../contexts/theme';
import { t } from '../../i18n';
import styles from '../wizard-style-guide/styles';
import { countUsagePerToken, renderSpacingExample, renderTokenExample } from '../wizard-style-guide/utils';

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

  #activeToken?: DisplayToken;

  static override readonly styles = [unsafeCSS(dataBadgeCss), unsafeCSS(tableCss), unsafeCSS(codeCss), styles];

  #prepareSpaceTokens(basis: Record<string, unknown>, space: string, tokenUsage: Map<string, string[]>): SpaceToken[] {
    return Object.entries((basis['space'] as Record<string, unknown>)[space] as Record<string, unknown>)
      .filter(([name]) => !['min', 'max'].includes(name))
      .reverse()
      .map(([name, tokenValue]) => {
        const value = (tokenValue as DimensionToken).$value;
        const stringifiedValue = typeof value === 'string' ? value : value.value + value.unit;
        const tokenId = `basis.space.${space}.${name}`;
        const isUsed = tokenUsage.has(tokenId);
        const usage = tokenUsage.get(tokenId) || [];
        const usageCount = usage.length ?? 0;
        return { name, isUsed, tokenId, usage, usageCount, value: stringifiedValue };
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
    const tokenUsage = countUsagePerToken(this.theme.tokens);
    const spaceTypes = ['block', 'inline', 'text', 'column', 'row'];
    const spacingData = spaceTypes.map((space) => ({
      space,
      tokens: this.#prepareSpaceTokens(basis, space, tokenUsage),
    }));

    return html`
      <section>
        <clippy-heading level=${2}>${t('styleGuide.sections.space.title')}</clippy-heading>
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
                  ({ name, isUsed, tokenId, usage, value }) => html`
                    <tr
                      class="utrecht-table__row"
                      aria-describedby=${isUsed ? nothing : `basis-space-${space}-unused-warning`}
                    >
                      <td class="utrecht-table__cell">${renderSpacingExample(value, space)}</td>
                      <td class="utrecht-table__cell">
                        <utrecht-button
                          appearance="subtle-button"
                          @click=${() => navigator.clipboard.writeText(tokenId)}
                        >
                          <span class="nl-data-badge" id="${`basis-space-${space}-${name}`}">${tokenId}</span>
                        </utrecht-button>
                      </td>
                      <td class="utrecht-table__cell">
                        <utrecht-button appearance="subtle-button" @click=${() => navigator.clipboard.writeText(value)}>
                          <code class="nl-code">${value}</code>
                        </utrecht-button>
                      </td>

                      <td class="utrecht-table__cell">
                        <utrecht-button
                          @click=${() => {
                            this.#setActiveToken({
                              displayValue: value,
                              isUsed,
                              metadata: { space },
                              tokenId,
                              tokenType: 'dimension',
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

            <utrecht-paragraph>
              <a href="https://nldesignsystem.nl/richtlijnen/stijl/ruimte/spacing-concepten/#${space}" target="_blank">
                docs
              </a>
            </utrecht-paragraph>

            <utrecht-paragraph id="basis-space-${space}-unused-warning" class="wizard-token-unused">
              ${t('styleGuide.unusedTokenWarning')}
            </utrecht-paragraph>
          `;
        })}
      </section>

      ${this.#renderTokenDialog()}
    `;
  }
}
