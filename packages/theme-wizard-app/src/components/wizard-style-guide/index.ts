import type { ClippyModal } from '@nl-design-system-community/clippy-components/clippy-modal';
import type { DesignToken } from 'style-dictionary/types';
import { consume } from '@lit/context';
import '@nl-design-system-community/clippy-components/clippy-html-image';
import colorSampleCss from '@nl-design-system-candidate/color-sample-css/color-sample.css?inline';
import dataBadgeCss from '@nl-design-system-candidate/data-badge-css/data-badge.css?inline';
import '@nl-design-system-community/clippy-components/clippy-modal';
import '@nl-design-system-community/clippy-components/clippy-heading';
import googleFonts from '@nl-design-system-community/clippy-components/assets/google-fonts.json' with { type: 'json' };
import {
  legacyToModernColor,
  type ColorToken as ColorTokenType,
  walkTokensWithRef,
  walkObject,
  isRef,
  resolveRef,
  isValueObject,
  isTokenLike,
  type TokenLike,
  ColorValue,
} from '@nl-design-system-community/design-tokens-schema';
import tableCss from '@utrecht/table-css/dist/index.css?inline';
import '../wizard-layout';
import Color from 'colorjs.io';
import { LitElement, html, nothing, unsafeCSS } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { html as staticHtml } from 'lit/static-html.js';
import type Theme from '../../lib/Theme';
import { themeContext } from '../../contexts/theme';
import { t } from '../../i18n';
import { unquote } from '../../utils/string-utils';
import { resolveColorValue } from '../wizard-colorscale-input';
import styles from './styles';

const tag = 'wizard-style-guide';

declare global {
  interface HTMLElementTagNameMap {
    [tag]: WizardStyleGuide;
  }
}

type DisplayToken = {
  tokenId: string;
  usage: string[];
  isUsed?: boolean;
  tokenType: DesignToken['$type'];
  displayValue: string;
  metadata?: Record<string, string>;
};

type TokenTableRow = Pick<DisplayToken, 'tokenId' | 'displayValue' | 'isUsed' | 'usage'>;

type BaseToken = {
  isUsed: boolean;
  tokenId: string;
  usage: string[];
  usageCount: number;
};

type ColorEntry = BaseToken & {
  colorKey: string;
  displayValue: string;
};

type ColorGroup = {
  colorEntries: ColorEntry[];
  isUsed: boolean;
  key: string;
};

type FontFamilyToken = BaseToken & {
  name: string;
  displayValue: string;
  googleFontsSpecimen: string | null;
};

type FontSizeToken = BaseToken & {
  name: string;
  displayValue: string;
};

type SpaceToken = BaseToken & {
  name: string;
  value: string;
};

@customElement(tag)
export class WizardStyleGuide extends LitElement {
  @consume({ context: themeContext, subscribe: true })
  @state()
  private readonly theme!: Theme;

  #activeToken?: DisplayToken;

  static override readonly styles = [
    unsafeCSS(dataBadgeCss),
    unsafeCSS(tableCss),
    unsafeCSS(colorSampleCss),
    styles,
  ];

  override connectedCallback(): void {
    super.connectedCallback();
    document.title = t('styleGuide.title').toString();
  }

  override firstUpdated(): void {
    // Scroll to hash on page load
    const hash = globalThis.location.hash;
    if (hash) {
      this.#scrollToHash(hash);
    }
  }

  #scrollToHash(hash: string): void {
    const target = this.shadowRoot?.querySelector(hash) || document.querySelector(hash);
    if (target) {
      // Use requestAnimationFrame to ensure element is rendered
      requestAnimationFrame(() => {
        target.scrollIntoView();
      });
    }
  }

  #handleNavClick(event: Event): void {
    const link = (event.target as Element).closest('a[href^="#"]');
    if (!link) return;

    const href = link.getAttribute('href');
    if (!href) return;

    event.preventDefault();
    globalThis.location.hash = href;
    this.#scrollToHash(href);
  }

  #countUsagePerToken(tokens: typeof this.theme.tokens): Map<string, string[]> {
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

  #linkToGoogleFontsSpecimen(family: string): string | null {
    const googleFont = googleFonts.find((font) => {
      return font.label === family;
    });
    if (!googleFont) return null;
    return `https://fonts.google.com/specimen/${googleFont.label.replaceAll(/\s+/g, '+')}`;
  }

  #prepareColorGroups(colors: Record<string, unknown>, tokenUsage: Map<string, string[]>): ColorGroup[] {
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

  #prepareFontFamilies(text: Record<string, unknown>, tokenUsage: Map<string, string[]>): FontFamilyToken[] {
    return Object.entries(text['font-family'] as Record<string, unknown>).map(([name, tokenValue]) => {
      const value = (tokenValue as DesignToken).$value;
      const searchFamily = unquote(Array.isArray(value) ? value.at(0) : value);
      const googleFontsSpecimen = this.#linkToGoogleFontsSpecimen(searchFamily);

      const displayValue = Array.isArray(value) ? value.join(', ') : value;
      const tokenId = `basis.text.font-family.${name}`;
      const isUsed = tokenUsage.has(tokenId);
      const usage = tokenUsage.get(tokenId) || [];
      const usageCount = usage.length;
      return { name, displayValue, googleFontsSpecimen, isUsed, tokenId, usage, usageCount };
    }) satisfies TokenTableRow[];
  }

  #prepareFontSizes(text: Record<string, unknown>, tokenUsage: Map<string, string[]>): FontSizeToken[] {
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

  #prepareSpaceTokens(basis: Record<string, unknown>, space: string, tokenUsage: Map<string, string[]>): SpaceToken[] {
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

  #renderColorSample(displayValue: string, tokenId?: string) {
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

  #renderFontSizeExample(displayValue: string) {
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

  #renderFontFamilyExample(displayValue: string) {
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

  #renderSpacingExample(value: string, space: string = 'block') {
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

  #renderFontWeightExample(displayValue: string | number) {
    return html`
      <clippy-html-image>
        <span slot="label">${t('styleGuide.sections.typography.fontWeight.sample')}</span>
        <utrecht-paragraph
          style="--utrecht-paragraph-font-size: var(--basis-text-font-size-2xl); --utrecht-paragraph-font-weight: ${displayValue}; overflow: hidden; display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 1;"
        >
          Op brute wijze ving de schooljuf de quasi-kalme lynx.
        </utrecht-paragraph>
      </clippy-html-image>
    `;
  }

  #renderLineHeightExample(displayValue: string | number) {
    return html`
      <clippy-html-image>
        <span slot="label">${t('styleGuide.sections.typography.fontWeight.sample')}</span>
        <utrecht-paragraph
          style="--utrecht-paragraph-font-size: var(--basis-text-font-size-xl); --utrecht-paragraph-line-height: ${displayValue}; overflow: hidden; display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 1; outline: 1px solid"
        >
          Op brute wijze ving de schooljuf de quasi-kalme lynx.
        </utrecht-paragraph>
      </clippy-html-image>
    `;
  }

  #renderTokenExample(token: Omit<DisplayToken, 'usage' | 'isUsed'>) {
    return html`
      ${token.tokenType === 'color' ? html` ${this.#renderColorSample(token.displayValue)} ` : nothing}
      ${token.tokenType === 'fontSize' ? html` ${this.#renderFontSizeExample(token.displayValue)} ` : nothing}
      ${token.tokenType === 'fontFamily' ? html` ${this.#renderFontFamilyExample(token.displayValue)} ` : nothing}
      ${token.tokenType === 'dimension'
        ? html` ${this.#renderSpacingExample(token.displayValue, token.metadata?.['space'])} `
        : nothing}
      ${token.tokenType === 'fontWeight' ? this.#renderFontWeightExample(token.displayValue) : nothing}
      ${token.tokenType === 'lineHeight' ? this.#renderLineHeightExample(token.displayValue) : nothing}
    `;
  }

  #renderColorSection(colorGroups: ColorGroup[]) {
    return html`
      <section id="colors">
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
                        <td class="utrecht-table__cell">${this.#renderColorSample(displayValue, tokenId)}</td>
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
    `;
  }

  #renderTypographySection(fontFamilies: FontFamilyToken[], fontSizes: FontSizeToken[]) {
    return html`
      <section id="typography">
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
                    ${this.#renderFontFamilyExample(displayValue)}
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
                  <td class="utrecht-table__cell">${this.#renderFontSizeExample(displayValue)}</td>
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

  #renderSpacingSection(
    spacingData: {
      space: string;
      tokens: SpaceToken[];
    }[],
  ) {
    return html`
      <section id="spacing">
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
                      <td class="utrecht-table__cell">${this.#renderSpacingExample(value, space)}</td>
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
    `;
  }

  #collectComponentTokens(
    componentConfig: Record<string, unknown>,
    componentId: string,
  ): {
    fullPath: string;
    tokenConfig: TokenLike;
  }[] {
    const tokens: {
      fullPath: string;
      tokenConfig: TokenLike;
    }[] = [];

    // Use walkObject to recursively find all tokens
    walkObject<TokenLike>(componentConfig, isTokenLike, (tokenConfig: TokenLike, path: string[]) => {
      const tokenId = path.join('.');
      const fullPath = `nl.${componentId}.${tokenId}`;
      tokens.push({
        fullPath,
        tokenConfig,
      });
    });

    return tokens;
  }

  #renderComponentsSection() {
    // We only render Candidtae (`nl.`) components for now
    const components = this.theme.tokens['nl'];
    if (!components) return nothing;

    return html`
      <section id="components">
        <clippy-heading level=${2}>${t('styleGuide.sections.components.title')}</clippy-heading>
        <utrecht-paragraph>
          <a href="https://nldesignsystem.nl/componenten/" target="_blank">docs</a>
        </utrecht-paragraph>

        ${Object.entries(components).map(
          ([componentId, componentConfig]) => html`
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
                    const displayValue = this.#stringifyTokenValue(resolvedValue);

                    return html`
                      <tr class="utrecht-table__row">
                        <td class="utrecht-table__cell">
                          ${this.#renderTokenExample({
                            displayValue: displayValue,
                            tokenId: fullPath,
                            tokenType: tokenConfig.$type,
                          })}
                        </td>
                        <td class="utrecht-table__cell">
                          <utrecht-code>${fullPath}</utrecht-code>
                        </td>
                        <td class="utrecht-table__cell">
                          ${isRef(tokenConfig.$value)
                            ? html`<span class="nl-data-badge">${tokenConfig.$value.slice(1, -1)}</span>`
                            : nothing}
                        </td>
                        <td class="utrecht-table__cell">
                          <utrecht-code>${displayValue}</utrecht-code>
                        </td>
                      </tr>
                    `;
                  },
                )}
              </tbody>
            </table>
          `,
        )}
      </section>
    `;
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
              ${this.#renderTokenExample(this.#activeToken)}
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
                ${this.#activeToken.metadata
                  ? Object.entries(this.#activeToken.metadata).map(
                      ([key, value]) => html`
                        <dt>${key}</dt>
                        <dd>
                          <utrecht-code>${value}</utrecht-code>
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

  /**
   * TODO: we probably want/need a sort of DesignToken class where we can call .toString()
   */
  #stringifyTokenValue(token: unknown): string {
    // Handle string primitives
    if (typeof token === 'string') return token;

    // Must be an object to have $value
    if (!isValueObject(token)) {
      return JSON.stringify(token);
    }

    const tokenObj = token as Record<string, unknown>;
    const value = tokenObj['$value'];

    // No $value property
    if (value === undefined || value === null) {
      return '';
    }

    // Handle array values: stringify each element
    if (Array.isArray(value)) {
      return value.map((v) => this.#stringifyTokenValue(v)).join(', ');
    }

    // Handle object values
    if (isValueObject(value)) {
      // Special handling for color tokens
      if (tokenObj['$type'] === 'color') {
        return legacyToModernColor.encode(value as ColorValue);
      }
      // Other object values: stringify
      return JSON.stringify(value);
    }

    // Handle primitive values (number, boolean, etc.)
    return value.toString();
  }

  override render() {
    if (!this.theme) {
      return t('loading');
    }

    const basis = this.theme.tokens['basis'] as Record<string, unknown>;
    const colors = basis['color'] as Record<string, unknown>;
    const text = basis['text'] as Record<string, unknown>;
    const tokenUsage = this.#countUsagePerToken(this.theme.tokens);

    const colorGroups = this.#prepareColorGroups(colors, tokenUsage);
    const fontFamilies = this.#prepareFontFamilies(text, tokenUsage);
    const fontSizes = this.#prepareFontSizes(text, tokenUsage);
    const spaceTypes = ['block', 'inline', 'text', 'column', 'row'];
    const spacingData = spaceTypes.map((space) => ({
      space,
      tokens: this.#prepareSpaceTokens(basis, space, tokenUsage),
    }));

    return html`
      <wizard-layout>
        <nav slot="sidebar" class="wizard-styleguide__nav" @click=${this.#handleNavClick}>
          <a class="wizard-styleguide__nav-item" href="#colors">${t('styleGuide.sections.colors.title')}</a>
          <a class="wizard-styleguide__nav-item" href="#typography">${t('styleGuide.sections.typography.title')}</a>
          <a class="wizard-styleguide__nav-item" href="#spacing">${t('styleGuide.sections.space.title')}</a>
          <a class="wizard-styleguide__nav-item" href="#components">${t('styleGuide.sections.components.title')}</a>
        </nav>

        <div slot="main" class="wizard-styleguide__main">
          <clippy-heading level=${1}>${t('styleGuide.title')}</clippy-heading>

          ${this.#renderColorSection(colorGroups)} ${this.#renderTypographySection(fontFamilies, fontSizes)}
          ${this.#renderSpacingSection(spacingData)} ${this.#renderComponentsSection()} ${this.#renderTokenDialog()}
        </div>
      </wizard-layout>
    `;
  }
}
