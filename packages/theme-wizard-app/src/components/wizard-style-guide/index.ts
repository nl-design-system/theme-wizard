import type { ClippyModal } from '@nl-design-system-community/clippy-components/clippy-modal';
import type { DesignToken } from 'style-dictionary/types';
import { consume } from '@lit/context';
import '@nl-design-system-community/clippy-components/clippy-html-image';
import colorSampleCss from '@nl-design-system-candidate/color-sample-css/color-sample.css?inline';
import headingCss from '@nl-design-system-candidate/heading-css/heading.css?inline';
import '@nl-design-system-community/clippy-components/clippy-modal';
import {
  legacyToModernColor,
  type ColorToken as ColorTokenType,
  walkTokensWithRef,
} from '@nl-design-system-community/design-tokens-schema';
import tableCss from '@utrecht/table-css/dist/index.css?inline';
import Color from 'colorjs.io';
import '../wizard-layout';
import { LitElement, html, nothing, unsafeCSS } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { html as staticHtml, unsafeStatic } from 'lit/static-html.js';
import type Theme from '../../lib/Theme';
import googleFonts from '../../../../clippy-components/assets/google-fonts.json' with { type: 'json' };
import { themeContext } from '../../contexts/theme';
import { t } from '../../i18n';
import { resolveColorValue } from '../wizard-colorscale-input';
import styles from './styles';

const unquote = (input: string): string => {
  return input.replaceAll(/(^['"])|(['"]$)/g, '');
};

const tag = 'wizard-style-guide';

declare global {
  interface HTMLElementTagNameMap {
    [tag]: WizardStyleGuide;
  }
}

type DisplayToken = {
  tokenId: string;
  usage: string[];
  isUsed: boolean;
  tokenType: DesignToken['$type'];
  displayValue: string;
  metadata?: Record<string, string>;
};

type TokenTableRow = Pick<DisplayToken, 'tokenId' | 'displayValue' | 'isUsed' | 'usage'>;

@customElement(tag)
export class WizardStyleGuide extends LitElement {
  @consume({ context: themeContext, subscribe: true })
  @state()
  private readonly theme!: Theme;

  #activeToken?: DisplayToken;

  static override readonly styles = [unsafeCSS(tableCss), unsafeCSS(colorSampleCss), unsafeCSS(headingCss), styles];

  override connectedCallback(): void {
    super.connectedCallback();
    document.title = t('styleGuide.title').toString();
  }

  override firstUpdated(): void {
    // Scroll to hash on page load
    const hash = globalThis.location.hash;
    if (hash) {
      this.scrollToHash(hash);
    }
  }

  private scrollToHash(hash: string): void {
    const target = this.shadowRoot?.querySelector(hash) || document.querySelector(hash);
    if (target) {
      // Use requestAnimationFrame to ensure element is rendered
      requestAnimationFrame(() => {
        target.scrollIntoView();
      });
    }
  }

  private handleNavClick(event: Event): void {
    const link = (event.target as Element).closest('a[href^="#"]');
    if (!link) return;

    const href = link.getAttribute('href');
    if (!href) return;

    event.preventDefault();
    globalThis.location.hash = href;
    this.scrollToHash(href);
  }

  private countUsagePerToken(tokens: typeof this.theme.tokens): Map<string, string[]> {
    const tokenUsage = new Map<string, string[]>();
    walkTokensWithRef(tokens, tokens, (token, path) => {
      const tokenId = token.$value.slice(1, -1);
      if (path.includes('$extensions')) return; // ignore contrast-with etc.
      const stored = tokenUsage.get(tokenId) || [];
      stored.push(path.join('.'));
      tokenUsage.set(tokenId, stored);
    });
    return tokenUsage;
  }

  private createGoogleFontUrl(family: string): string | null {
    const googleFont = googleFonts.find((font) => {
      return font.label === family;
    });
    if (!googleFont) return null;
    return `https://fonts.google.com/noto/specimen/${googleFont.label.replaceAll(/\s+/g, '+')}`;
  }

  private prepareColorGroups(colors: Record<string, unknown>, tokenUsage: Map<string, string[]>) {
    return Object.entries(colors)
      .filter(([key]) => !key.includes('inverse') && !key.includes('transparent'))
      .filter(([, value]) => typeof value === 'object' && value !== null)
      .map(([key, value]) => {
        const colorEntries = Object.entries(value as Record<string, unknown>)
          .filter(([, token]) => typeof token === 'object' && token !== null && '$value' in token)
          .map(([colorKey, token]) => {
            const color = resolveColorValue(token as ColorTokenType, this.theme.tokens);
            const displayValue = color ? legacyToModernColor.encode(color) : '#000';
            const tokenId = `basis.color.${key}.${colorKey}`;
            const isUsed = tokenUsage.has(tokenId);
            const usage = tokenUsage.get(tokenId) || [];
            const usageCount = usage.length;
            return { colorKey, displayValue, isUsed, tokenId, usage, usageCount };
          })
          .filter(({ displayValue }) => displayValue !== null) satisfies TokenTableRow[];
        return { colorEntries, isUsed: colorEntries.some((color) => color.isUsed), key };
      });
  }

  private prepareFontFamilies(text: Record<string, unknown>, tokenUsage: Map<string, string[]>) {
    return Object.entries(text['font-family'] as Record<string, unknown>).map(([name, tokenValue]) => {
      const value = (tokenValue as DesignToken).$value;
      const searchFamily = unquote(Array.isArray(value) ? value.at(0) : value);
      const googleFontUrl = this.createGoogleFontUrl(searchFamily);

      const displayValue = Array.isArray(value) ? value.join(', ') : value;
      const tokenId = `basis.text.font-family.${name}`;
      const isUsed = tokenUsage.has(tokenId);
      const usage = tokenUsage.get(tokenId) || [];
      const usageCount = usage.length;
      return { name, displayValue, googleFontUrl, isUsed, tokenId, usage, usageCount };
    }) satisfies TokenTableRow[];
  }

  private prepareFontSizes(text: Record<string, unknown>, tokenUsage: Map<string, string[]>) {
    return Object.entries(text['font-size'] as Record<string, unknown>)
      .reverse()
      .map(([name, tokenValue]) => {
        const displayValue = (tokenValue as DesignToken).$value;
        const tokenId = `basis.text.font-size.${name}`;
        const isUsed = tokenUsage.has(tokenId);
        const usage = tokenUsage.get(tokenId) || [];
        const usageCount = usage.length;
        return { name, displayValue, isUsed, tokenId, usage, usageCount };
      }) satisfies TokenTableRow[];
  }

  private prepareSpaceTokens(basis: Record<string, unknown>, space: string, tokenUsage: Map<string, string[]>) {
    return Object.entries((basis['space'] as Record<string, unknown>)[space] as Record<string, unknown>)
      .filter(([name]) => !['min', 'max'].includes(name))
      .reverse()
      .map(([name, tokenValue]) => {
        const value = (tokenValue as DesignToken).$value;
        const tokenId = `basis.space.${space}.${name}`;
        const isUsed = tokenUsage.has(tokenId);
        const usage = tokenUsage.get(tokenId) || [];
        const usageCount = usage.length ?? 0;
        return { name, isUsed, tokenId, usage, usageCount, value };
      });
  }

  private setActiveToken(token: DisplayToken | undefined) {
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

  private renderColorSample(displayValue: string, tokenId?: string) {
    return html`
      <svg
        role="img"
        xmlns="http://www.w3.org/2000/svg"
        class="nl-color-sample"
        style="color: ${displayValue};"
        aria-labelledby=${tokenId}
        width="32"
        height="32"
        viewBox="0 0 32 32"
      >
        <path d="M0 0H32V32H0Z" fill="currentcolor" />
      </svg>
    `;
  }

  private renderFontSizeExample(displayValue: string) {
    return html`
      <clippy-html-image>
        <span slot="label">${t('styleGuide.sections.typography.sizes.sample')}</span>
        <utrecht-paragraph
          style="--utrecht-paragraph-font-size: ${displayValue}; overflow: hidden; display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 1;"
        >
          Op brute wijze ving de schooljuf de quasi-kalme lynx.
        </utrecht-paragraph>
      </clippy-html-image>
    `;
  }

  private renderFontFamilyExample(displayValue: string) {
    return html`
      <clippy-html-image>
        <span slot="label">${t('styleGuide.sections.typography.families.sample')}</span>
        <utrecht-paragraph
          style="--utrecht-paragraph-font-size: var(--basis-text-font-size-2xl); --utrecht-paragraph-font-family: ${displayValue}; overflow: hidden; display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 1;"
        >
          Op brute wijze ving de schooljuf de quasi-kalme lynx.
        </utrecht-paragraph>
      </clippy-html-image>
    `;
  }

  private renderSpacingExample(value: string, space: string) {
    return html`
      <clippy-html-image>
        <span slot="label">${t(`styleGuide.sections.space.${space}.sample`)}</span>
        <div
          style="block-size: ${['block', 'row'].includes(space) ? value : '2rem'}; inline-size: ${[
            'inline',
            'column',
            'text',
          ].includes(space)
            ? value
            : '2rem'}; background-color: currentColor; cursor: default; forced-color-adjust: none; user-select: none;"
        ></div>
      </clippy-html-image>
    `;
  }

  private renderColorSection(colorGroups: ReturnType<typeof this.prepareColorGroups>) {
    return html`
      <section id="colors">
        <utrecht-heading-2>${t('styleGuide.sections.colors.title')}</utrecht-heading-2>

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
                        <td class="utrecht-table__cell">${this.renderColorSample(displayValue, tokenId)}</td>
                        <td class="utrecht-table__cell">
                          <utrecht-button
                            appearance="subtle-button"
                            @click=${() => navigator.clipboard.writeText(tokenId)}
                          >
                            <utrecht-code id=${tokenId}>${tokenId}</utrecht-code>
                          </utrecht-button>
                        </td>
                        <td class="utrecht-table__cell">
                          <utrecht-button
                            appearance="subtle-button"
                            @click=${() => navigator.clipboard.writeText(displayValue)}
                          >
                            <utrecht-code id=${displayValue}>${displayValue}</utrecht-code>
                          </utrecht-button>
                        </td>
                        <td class="utrecht-table__cell">
                          <utrecht-button
                            @click=${() => {
                              const color = new Color(displayValue);
                              this.setActiveToken({
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
    `;
  }

  private renderTypographySection(
    fontFamilies: ReturnType<typeof this.prepareFontFamilies>,
    fontSizes: ReturnType<typeof this.prepareFontSizes>,
  ) {
    return html`
      <section id="typography">
        <utrecht-heading-2>${t('styleGuide.sections.typography.title')}</utrecht-heading-2>

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
              ({ name, displayValue, googleFontUrl, isUsed, tokenId, usage }) => html`
                <tr
                  aria-describedby=${isUsed ? nothing : 'basis-color-typography-font-family-unused-warning'}
                  class="utrecht-table__row"
                >
                  <td class="utrecht-table__cell">
                    ${this.renderFontFamilyExample(displayValue)}
                    ${googleFontUrl
                      ? html`<utrecht-paragraph>
                          <a href=${googleFontUrl} rel="external noreferrer" target="_blank">View on Google Fonts</a>
                        </utrecht-paragraph>`
                      : nothing}
                  </td>
                  <td class="utrecht-table__cell">
                    <utrecht-button appearance="subtle-button" @click=${() => navigator.clipboard.writeText(tokenId)}>
                      <utrecht-code id="${`basis-text-font-family-${name}`}">${tokenId}</utrecht-code>
                    </utrecht-button>
                  </td>
                  <td class="utrecht-table__cell">
                    <utrecht-button
                      appearance="subtle-button"
                      @click=${() => navigator.clipboard.writeText(displayValue)}
                    >
                      <utrecht-code>${displayValue}</utrecht-code>
                    </utrecht-button>
                  </td>
                  <td class="utrecht-table__cell">
                    <utrecht-button
                      @click=${() => {
                        this.setActiveToken({
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
                  <td class="utrecht-table__cell">${this.renderFontSizeExample(displayValue)}</td>
                  <td class="utrecht-table__cell">
                    <utrecht-button appearance="subtle-button" @click=${() => navigator.clipboard.writeText(tokenId)}>
                      <utrecht-code id="${`basis-text-font-size-${name}`}"> ${tokenId} </utrecht-code>
                    </utrecht-button>
                  </td>
                  <td class="utrecht-table__cell">
                    <utrecht-button
                      appearance="subtle-button"
                      @click=${() => navigator.clipboard.writeText(displayValue)}
                    >
                      <utrecht-code>${displayValue}</utrecht-code>
                    </utrecht-button>
                  </td>
                  <td class="utrecht-table__cell">
                    <utrecht-button
                      @click=${() => {
                        this.setActiveToken({
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
              const tag = unsafeStatic(`h${level}`);
              const heading = staticHtml`<${tag} class="nl-heading nl-heading--level-${level}" style="line-clamp: 3; overflow: hidden; display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 3;">Wijzigingswet Vreemdelingenwet 2000, enz. (vaststelling criteria en instrumenten ter bepaling van de verantwoordelijke lidstaat voor behandeling verzoek om internationale bescherming)</${tag}>`;
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
                      <utrecht-code id="${`basis.heading.level-${level}`}" style="white-space: nowrap">
                        ${`basis.heading.level-${level}`}
                      </utrecht-code>
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
    `;
  }

  private renderSpacingSection(
    spacingData: Array<{
      space: string;
      tokens: Array<{
        name: string;
        isUsed: boolean;
        tokenId: string;
        usage: string[];
        usageCount: number;
        value: string;
      }>;
    }>,
  ) {
    return html`
      <section id="spacing">
        <utrecht-heading-2>${t('styleGuide.sections.space.title')}</utrecht-heading-2>
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
                      <td class="utrecht-table__cell">${this.renderSpacingExample(value, space)}</td>
                      <td class="utrecht-table__cell">
                        <utrecht-button
                          appearance="subtle-button"
                          @click=${() => navigator.clipboard.writeText(tokenId)}
                        >
                          <utrecht-code id="${`basis-space-${space}-${name}`}"> ${tokenId} </utrecht-code>
                        </utrecht-button>
                      </td>
                      <td class="utrecht-table__cell">
                        <utrecht-button appearance="subtle-button" @click=${() => navigator.clipboard.writeText(value)}>
                          <utrecht-code>${value}</utrecht-code>
                        </utrecht-button>
                      </td>

                      <td class="utrecht-table__cell">
                        <utrecht-button
                          @click=${() => {
                            this.setActiveToken({
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
    `;
  }

  override render() {
    if (!this.theme) {
      return t('loading');
    }

    const basis = this.theme.tokens['basis'] as Record<string, unknown>;
    const colors = basis['color'] as Record<string, unknown>;
    const text = basis['text'] as Record<string, unknown>;
    const tokenUsage = this.countUsagePerToken(this.theme.tokens);

    const colorGroups = this.prepareColorGroups(colors, tokenUsage);
    const fontFamilies = this.prepareFontFamilies(text, tokenUsage);
    const fontSizes = this.prepareFontSizes(text, tokenUsage);
    const spaceTypes = ['block', 'inline', 'text', 'column', 'row'];
    const spacingData = spaceTypes.map((space) => ({
      space,
      tokens: this.prepareSpaceTokens(basis, space, tokenUsage),
    }));

    return html`
      <wizard-layout>
        <nav slot="sidebar" class="wizard-styleguide__nav" @click=${this.handleNavClick}>
          <a class="wizard-styleguide__nav-item" href="#colors">${t('styleGuide.sections.colors.title')}</a>
          <a class="wizard-styleguide__nav-item" href="#typography">${t('styleGuide.sections.typography.title')}</a>
          <a class="wizard-styleguide__nav-item" href="#spacing">${t('styleGuide.sections.space.title')}</a>
        </nav>

        <div slot="main" class="wizard-styleguide__main">
          <utrecht-heading-1>${t('styleGuide.title')}</utrecht-heading-1>

          ${this.renderColorSection(colorGroups)} ${this.renderTypographySection(fontFamilies, fontSizes)}
          ${this.renderSpacingSection(spacingData)}

          <clippy-modal
            id="token-dialog"
            title=${this.#activeToken?.tokenId}
            open=${this.#activeToken !== undefined}
            actions="none"
          >
            ${this.#activeToken
              ? html`
                  ${this.#activeToken.tokenType === 'color'
                    ? html`
                        <utrecht-heading-3>${t('styleGuide.sample')}</utrecht-heading-3>
                        ${this.renderColorSample(this.#activeToken.displayValue)}
                      `
                    : nothing}
                  ${this.#activeToken.tokenType === 'fontSize'
                    ? html`
                        <utrecht-heading-3>${t('styleGuide.sample')}</utrecht-heading-3>
                        ${this.renderFontSizeExample(this.#activeToken.displayValue)}
                      `
                    : nothing}
                  ${this.#activeToken.tokenType === 'fontFamily'
                    ? html`
                        <utrecht-heading-3>${t('styleGuide.sample')}</utrecht-heading-3>
                        ${this.renderFontFamilyExample(this.#activeToken.displayValue)}
                      `
                    : nothing}
                  ${this.#activeToken.tokenType === 'dimension' && this.#activeToken.metadata?.['space']
                    ? html`
                        <utrecht-heading-3>${t('styleGuide.sample')}</utrecht-heading-3>
                        ${this.renderSpacingExample(
                          this.#activeToken.displayValue,
                          this.#activeToken.metadata['space'],
                        )}
                      `
                    : nothing}
                  <dl>
                    <dt>Token type</dt>
                    <dd>
                      <utrecht-code>${this.#activeToken.tokenType}</utrecht-code>
                    </dd>
                    <dt>Token ID</dt>
                    <dd>
                      <utrecht-code>${this.#activeToken.tokenId}</utrecht-code>
                    </dd>
                    <dt>CSS Variable</dt>
                    <dd>
                      <utrecht-code>${`--${this.#activeToken.tokenId.replaceAll('.', '-')}`}</utrecht-code>
                    </dd>
                    <dt>${t('styleGuide.value')}</dt>
                    <dd>
                      <utrecht-code>${this.#activeToken.displayValue}</utrecht-code>
                    </dd>
                    ${this.#activeToken.metadata === undefined
                      ? nothing
                      : Object.entries(this.#activeToken.metadata).map(
                          ([key, value]) => html`
                            <dt>${key}</dt>
                            <dd>
                              <utrecht-code>${value}</utrecht-code>
                            </dd>
                          `,
                        )}
                  </dl>

                  <utrecht-heading-3>
                    ${t('styleGuide.detailsDialog.tokenReferenceList.title')}
                    <data>(${this.#activeToken.usage.length}&times;)</data>
                  </utrecht-heading-3>
                  ${this.#activeToken.usage.length === 0
                    ? html`<utrecht-paragraph>
                        ${t('styleGuide.detailsDialog.tokenReferenceList.empty')}
                      </utrecht-paragraph>`
                    : html`<ul>
                        ${this.#activeToken.usage.map(
                          (referrer) => html`
                            <li>
                              <utrecht-code>${referrer}</utrecht-code>
                            </li>
                          `,
                        )}
                      </ul>`}
                `
              : nothing}
          </clippy-modal>
        </div>
      </wizard-layout>
    `;
  }
}
