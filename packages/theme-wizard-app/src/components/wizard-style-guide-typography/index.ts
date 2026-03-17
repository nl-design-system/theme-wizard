import type { DesignToken } from 'style-dictionary/types';
import '@nl-design-system-community/clippy-components/clippy-html-image';
import { consume } from '@lit/context';
import codeCss from '@nl-design-system-candidate/code-css/code.css?inline';
import dataBadgeCss from '@nl-design-system-candidate/data-badge-css/data-badge.css?inline';
import '@nl-design-system-community/clippy-components/clippy-heading';
import '@nl-design-system-community/clippy-components/clippy-toggletip';
import linkCss from '@nl-design-system-candidate/link-css/link.css?inline';
import paragraphCss from '@nl-design-system-candidate/paragraph-css/paragraph.css?inline';
import googleFonts from '@nl-design-system-community/clippy-components/assets/google-fonts.json' with { type: 'json' };
import { type ModernDimensionToken } from '@nl-design-system-community/design-tokens-schema';
import ClipboardCopyIcon from '@tabler/icons/outline/clipboard-copy.svg?raw';
import tableCss from '@utrecht/table-css/dist/index.css?inline';
import { LitElement, html, nothing, unsafeCSS } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import { html as staticHtml } from 'lit/static-html.js';
import type Theme from '../../lib/Theme';
import type { DisplayToken, FontFamilyToken, FontSizeToken } from '../wizard-style-guide/types';
import { themeContext } from '../../contexts/theme';
import { t } from '../../i18n';
import styles from '../wizard-style-guide/styles';
import { countUsagePerToken, openTokenDialog, renderTokenDialog } from '../wizard-style-guide/utils';

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

  @state() private activeToken?: DisplayToken;

  static override readonly styles = [
    unsafeCSS(dataBadgeCss),
    unsafeCSS(tableCss),
    unsafeCSS(codeCss),
    unsafeCSS(linkCss),
    unsafeCSS(paragraphCss),
    styles,
  ];

  #linkToGoogleFontsSpecimen(family: string): string | null {
    const googleFont = googleFonts.find((font) => font.label === family);
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
      const usage = tokenUsage.get(tokenId) || [];
      const usageCount = usage.length;
      return { name, displayValue, googleFontsSpecimen, tokenId, usage, usageCount };
    });
  }

  #prepareFontSizes(text: Record<string, unknown>, tokenUsage: Map<string, string[]>): FontSizeToken[] {
    return Object.entries(text['font-size'] as Record<string, unknown>)
      .reverse()
      .map(([name, tokenValue]) => {
        const { $value } = tokenValue as ModernDimensionToken;
        const displayValue = $value.value?.toString() + $value.unit;
        const tokenId = `basis.text.font-size.${name}`;
        const usage = tokenUsage.get(tokenId) || [];
        const usageCount = usage.length;
        return { name, displayValue, tokenId, usage, usageCount };
      });
  }

  #openDialog(token: DisplayToken) {
    openTokenDialog(token, this.renderRoot, (t) => {
      this.activeToken = t;
    });
  }

  override render() {
    const basis = this.theme.tokens['basis'] as Record<string, unknown>;
    const text = basis['text'] as Record<string, unknown>;
    const tokenUsage = countUsagePerToken(this.theme.tokens);
    const fontFamilies = this.#prepareFontFamilies(text, tokenUsage);
    const fontSizes = this.#prepareFontSizes(text, tokenUsage);

    return html`
      <div class="wizard-style-guide">
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
              ({ name, displayValue, googleFontsSpecimen, tokenId, usage }) => html`
                <tr class="utrecht-table__row">
                  <td class="utrecht-table__cell">
                    <wizard-font-sample
                      family=${displayValue}
                      size="var(--basis-text-font-size-xl)"
                    ></wizard-font-sample>
                    ${googleFontsSpecimen
                      ? html`<p class="nl-paragraph">
                          <a class="nl-link" href=${googleFontsSpecimen} rel="external noreferrer" target="_blank">
                            ${t('tokens.showOnGoogleFonts')}
                          </a>
                        </p>`
                      : nothing}
                  </td>
                  <td class="utrecht-table__cell">
                    <span class="nl-data-badge" id="${`basis-text-font-family-${name}`}">${tokenId}</span>
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
                    <code class="nl-code">${displayValue}</code>
                    <clippy-toggletip text=${t('copyToClipboard')}>
                      <clippy-button
                        icon-only
                        purpose="subtle"
                        size="small"
                        @click=${() => navigator.clipboard.writeText(displayValue)}
                      >
                        ${t('copyValueToClipboard', { value: displayValue })}
                        <clippy-icon size="small" slot="iconEnd">${unsafeSVG(ClipboardCopyIcon)}</clippy-icon>
                      </clippy-button>
                    </clippy-toggletip>
                  </td>
                  <td class="utrecht-table__cell">
                    <clippy-button
                      purpose="secondary"
                      @click=${() => this.#openDialog({ displayValue, tokenId, tokenType: 'fontFamily', usage })}
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
          <a
            class="nl-link"
            href="https://nldesignsystem.nl/handboek/huisstijl/themas/start-thema/#lettertype"
            target="_blank"
          >
            docs
          </a>
        </p>

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
              ({ name, displayValue, tokenId, usage }) => html`
                <tr class="utrecht-table__row">
                  <td class="utrecht-table__cell">
                    <wizard-font-sample size=${displayValue}></wizard-font-sample>
                  </td>
                  <td class="utrecht-table__cell">
                    <span class="nl-data-badge" id="${`basis-text-font-size-${name}`}">${tokenId}</span>
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
                    <code class="nl-code">${displayValue}</code>
                    <clippy-toggletip text=${t('copyToClipboard')}>
                      <clippy-button
                        icon-only
                        purpose="subtle"
                        size="small"
                        @click=${() => navigator.clipboard.writeText(displayValue)}
                      >
                        ${t('copyValueToClipboard', { value: displayValue })}
                        <clippy-icon size="small" slot="iconEnd">${unsafeSVG(ClipboardCopyIcon)}</clippy-icon>
                      </clippy-button>
                    </clippy-toggletip>
                  </td>
                  <td class="utrecht-table__cell">
                    <clippy-button
                      purpose="secondary"
                      @click=${() => this.#openDialog({ displayValue, tokenId, tokenType: 'fontSize', usage })}
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
          <a
            class="nl-link"
            href="https://nldesignsystem.nl/handboek/huisstijl/themas/start-thema/#lettergrootte"
            target="_blank"
          >
            docs
          </a>
        </p>

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
                    <code class="nl-code" id="${`basis.heading.level-${level}`}" style="white-space: nowrap">
                      ${`basis.heading.level-${level}`}
                    </code>
                    <clippy-toggletip text=${t('copyToClipboard')}>
                      <clippy-button
                        icon-only
                        purpose="subtle"
                        size="small"
                        @click=${() => navigator.clipboard.writeText(`basis.heading.level-${level}`)}
                      >
                        ${t('copyValueToClipboard', { value: `basis.heading.level-${level}` })}
                        <clippy-icon size="small" slot="iconEnd">${unsafeSVG(ClipboardCopyIcon)}</clippy-icon>
                      </clippy-button>
                    </clippy-toggletip>
                  </td>
                </tr>
              `;
            })}
          </tbody>
        </table>
        <p class="nl-paragraph">
          <a class="nl-link" href="https://nldesignsystem.nl/heading/" target="_blank">docs</a>
        </p>
      </div>

      ${renderTokenDialog(this.activeToken)}
    `;
  }
}
