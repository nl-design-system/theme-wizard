import type { ClippyModal } from '@nl-design-system-community/clippy-components/clippy-modal';
import type { DesignToken } from 'style-dictionary/types';
import '@nl-design-system-community/clippy-components/clippy-html-image';
import { consume } from '@lit/context';
import codeCss from '@nl-design-system-candidate/code-css/code.css?inline';
import '@nl-design-system-community/clippy-components/clippy-modal';
import '@nl-design-system-community/clippy-components/clippy-heading';
import dataBadgeCss from '@nl-design-system-candidate/data-badge-css/data-badge.css?inline';
import googleFonts from '@nl-design-system-community/clippy-components/assets/google-fonts.json' with { type: 'json' };
import { type ModernDimensionToken } from '@nl-design-system-community/design-tokens-schema';
import tableCss from '@utrecht/table-css/dist/index.css?inline';
import { LitElement, html, nothing, unsafeCSS } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { html as staticHtml } from 'lit/static-html.js';
import type Theme from '../../lib/Theme';
import type { DisplayToken, FontFamilyToken, FontSizeToken } from '../wizard-style-guide/types';
import { themeContext } from '../../contexts/theme';
import { t } from '../../i18n';
import styles from '../wizard-style-guide/styles';
import {
  countUsagePerToken,
  renderFontFamilyExample,
  renderFontSizeExample,
  renderTokenExample,
} from '../wizard-style-guide/utils';

const tag = 'wizard-style-guide-typography';

declare global {
  interface HTMLElementTagNameMap {
    [tag]: WizardStyleGuideTypography;
  }
}

@customElement(tag)
export class WizardStyleGuideTypography extends LitElement {
  @consume({ context: themeContext, subscribe: true })
  @state()
  private readonly theme!: Theme;

  #activeToken?: DisplayToken;

  static override readonly styles = [unsafeCSS(dataBadgeCss), unsafeCSS(tableCss), unsafeCSS(codeCss), styles];

  #linkToGoogleFontsSpecimen(family: string): string | null {
    const googleFont = googleFonts.find((font) => {
      return font.label === family;
    });
    if (!googleFont) return null;
    return `https://fonts.google.com/specimen/${googleFont.label.replaceAll(/\s+/g, '+')}`;
  }

  #prepareFontFamilies(text: Record<string, unknown>, tokenUsage: Map<string, string[]>): FontFamilyToken[] {
    return Object.entries(text['font-family'] as Record<string, unknown>).map(([name, tokenValue]) => {
      const value = (tokenValue as DesignToken).$value;
      const searchFamily = Array.isArray(value) ? value.at(0) : value;
      const googleFontsSpecimen = this.#linkToGoogleFontsSpecimen(searchFamily);

      const displayValue = Array.isArray(value) ? value.join(', ') : value;
      const tokenId = `basis.text.font-family.${name}`;
      const isUsed = tokenUsage.has(tokenId);
      const usage = tokenUsage.get(tokenId) || [];
      const usageCount = usage.length;
      return { name, displayValue, googleFontsSpecimen, isUsed, tokenId, usage, usageCount };
    });
  }

  #prepareFontSizes(text: Record<string, unknown>, tokenUsage: Map<string, string[]>): FontSizeToken[] {
    return Object.entries(text['font-size'] as Record<string, unknown>)
      .reverse()
      .map(([name, tokenValue]) => {
        const { $value } = tokenValue as ModernDimensionToken;
        const displayValue = $value.value?.toString() + $value.unit;
        const tokenId = `basis.text.font-size.${name}`;
        const isUsed = tokenUsage.has(tokenId);
        const usage = tokenUsage.get(tokenId) || [];
        const usageCount = usage.length;
        return { name, displayValue, isUsed, tokenId, usage, usageCount };
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
    const text = basis['text'] as Record<string, unknown>;
    const tokenUsage = countUsagePerToken(this.theme.tokens);
    const fontFamilies = this.#prepareFontFamilies(text, tokenUsage);
    const fontSizes = this.#prepareFontSizes(text, tokenUsage);

    return html`
      <section>
        <clippy-heading level=${2}>${t('styleGuide.sections.typography.title')}</clippy-heading>

        <table class="utrecht-table">
          <caption class="utrecht-table__caption">
            ${t(`styleGuide.sections.typography.families.title`)}
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
            ${fontFamilies.map(
              ({ name, displayValue, googleFontsSpecimen, isUsed, tokenId, usage }) => html`
                <tr
                  aria-describedby=${isUsed ? nothing : 'basis-color-typography-font-family-unused-warning'}
                  class="utrecht-table__row"
                >
                  <td class="utrecht-table__cell">
                    ${renderFontFamilyExample(displayValue)}
                    ${googleFontsSpecimen
                      ? html`<utrecht-paragraph>
                          <a href=${googleFontsSpecimen} rel="external noreferrer" target="_blank">
                            ${t('tokens.showOnGoogleFonts')}
                          </a>
                        </utrecht-paragraph>`
                      : nothing}
                  </td>
                  <td class="utrecht-table__cell">
                    <utrecht-button appearance="subtle-button" @click=${() => navigator.clipboard.writeText(tokenId)}>
                      <span class="nl-data-badge" id="${`basis-text-font-family-${name}`}">${tokenId}</span>
                    </utrecht-button>
                  </td>
                  <td class="utrecht-table__cell">
                    <utrecht-button
                      appearance="subtle-button"
                      @click=${() => navigator.clipboard.writeText(displayValue)}
                    >
                      <code class="nl-code">${displayValue}</code>
                    </utrecht-button>
                  </td>
                  <td class="utrecht-table__cell">
                    <utrecht-button
                      @click=${() => {
                        this.#setActiveToken({
                          displayValue,
                          isUsed,
                          tokenId,
                          tokenType: 'fontFamily',
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
          <a href="https://nldesignsystem.nl/handboek/huisstijl/themas/start-thema/#lettertype" target="_blank">
            docs
          </a>
        </utrecht-paragraph>
        ${fontFamilies.every((family) => family.isUsed)
          ? nothing
          : html`<utrecht-paragraph id="basis-color-typography-font-family-unused-warning" class="wizard-token-unused">
              ${t('styleGuide.unusedTokenWarning')}
            </utrecht-paragraph>`}

        <table class="utrecht-table">
          <caption class="utrecht-table__caption">
            ${t(`styleGuide.sections.typography.sizes.title`)}
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
            ${fontSizes.map(
              ({ name, displayValue, isUsed, tokenId, usage }) => html`
                <tr
                  class="utrecht-table__row"
                  aria-describedby=${isUsed ? nothing : 'basis-color-typography-sizes-unused-warning'}
                >
                  <td class="utrecht-table__cell">${renderFontSizeExample(displayValue)}</td>
                  <td class="utrecht-table__cell">
                    <utrecht-button appearance="subtle-button" @click=${() => navigator.clipboard.writeText(tokenId)}>
                      <span class="nl-data-badge" id="${`basis-text-font-size-${name}`}">${tokenId}</span>
                    </utrecht-button>
                  </td>
                  <td class="utrecht-table__cell">
                    <utrecht-button
                      appearance="subtle-button"
                      @click=${() => navigator.clipboard.writeText(displayValue)}
                    >
                      <code class="nl-code">${displayValue}</code>
                    </utrecht-button>
                  </td>
                  <td class="utrecht-table__cell">
                    <utrecht-button
                      @click=${() => {
                        this.#setActiveToken({
                          displayValue,
                          isUsed,
                          tokenId,
                          tokenType: 'fontSize',
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
          <a href="https://nldesignsystem.nl/handboek/huisstijl/themas/start-thema/#lettergrootte" target="_blank">
            docs
          </a>
        </utrecht-paragraph>
        ${fontSizes.every((size) => size.isUsed)
          ? nothing
          : html`<utrecht-paragraph id="basis-color-typography-sizes-unused-warning" class="wizard-token-unused">
              ${t('styleGuide.unusedTokenWarning')}
            </utrecht-paragraph>`}

        <table class="utrecht-table">
          <caption class="utrecht-table__caption">
            ${t(`styleGuide.sections.typography.headings.title`)}
          </caption>
          <thead class="utrecht-table__header">
            <tr class="utrecht-table__row">
              <th scope="col" class="utrecht-table__header-cell">${t('styleGuide.sample')}</th>
              <th scope="col" class="utrecht-table__header-cell">${t('styleGuide.tokenName')}</th>
            </tr>
          </thead>
          <tbody class="utrecht-table__body">
            ${[1, 2, 3, 4, 5, 6].map((level) => {
              const heading = staticHtml`<clippy-heading level=${level} style="line-clamp: 3; overflow: hidden; display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 3;">Wijzigingswet Vreemdelingenwet 2000, enz. (vaststelling criteria en instrumenten ter bepaling van de verantwoordelijke lidstaat voor behandeling verzoek om internationale bescherming)</clippy-heading>`;
              return html`
                <tr class="utrecht-table__row">
                  <td class="utrecht-table__cell">
                    <clippy-html-image>
                      <span slot="label">${t('styleGuide.sections.typography.headings.sample')}</span>
                      ${heading}
                    </clippy-html-image>
                  </td>
                  <td class="utrecht-table__cell">
                    <utrecht-button
                      appearance="subtle-button"
                      @click=${() => navigator.clipboard.writeText(`basis.heading.level-${level}`)}
                    >
                      <code class="nl-code" id="${`basis.heading.level-${level}`}" style="white-space: nowrap">
                        ${`basis.heading.level-${level}`}
                      </code>
                    </utrecht-button>
                  </td>
                </tr>
              `;
            })}
          </tbody>
        </table>
        <utrecht-paragraph>
          <a href="https://nldesignsystem.nl/heading/" target="_blank">docs</a>
        </utrecht-paragraph>
      </section>

      ${this.#renderTokenDialog()}
    `;
  }
}
