import { consume } from '@lit/context';
import colorSampleCss from '@nl-design-system-candidate/color-sample-css/color-sample.css?inline';
import dataBadgeCss from '@nl-design-system-candidate/data-badge-css/data-badge.css?inline';
import headingCss from '@nl-design-system-candidate/heading-css/heading.css?inline';
import '@nl-design-system-community/clippy-components/clippy-html-image';
import {
  legacyToModernColor,
  type ColorToken as ColorTokenType,
  walkTokensWithRef,
} from '@nl-design-system-community/design-tokens-schema';
import { LitElement, html, nothing, unsafeCSS } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { html as staticHtml, unsafeStatic } from 'lit/static-html.js';
import '../wizard-layout';
import { DesignToken } from 'style-dictionary/types';
import type Theme from '../../lib/Theme';
import { themeContext } from '../../contexts/theme';
import { t } from '../../i18n';
import { resolveColorValue } from '../wizard-colorscale-input';
import styles from './styles';

const tag = 'wizard-style-guide';

declare global {
  interface HTMLElementTagNameMap {
    [tag]: WizardStyleGuide;
  }
}

@customElement(tag)
export class WizardStyleGuide extends LitElement {
  @consume({ context: themeContext, subscribe: true })
  @state()
  private readonly theme!: Theme;

  static override readonly styles = [unsafeCSS(colorSampleCss), unsafeCSS(headingCss), unsafeCSS(dataBadgeCss), styles];

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

  private countUsagePerToken(tokens: typeof this.theme.tokens): Map<string, number> {
    const tokenUsage = new Map<string, number>();
    walkTokensWithRef(tokens, tokens, (token) => {
      const tokenId = token.$value.slice(1, -1);
      tokenUsage.set(tokenId, (tokenUsage.get(tokenId) || 0) + 1);
    });
    return tokenUsage;
  }

  private prepareColorGroups(colors: Record<string, unknown>, tokenUsage: Map<string, number>) {
    return Object.entries(colors)
      .filter(([key]) => !key.includes('inverse') && !key.includes('transparent'))
      .filter(([, value]) => typeof value === 'object' && value !== null)
      .map(([key, value]) => {
        const colorEntries = Object.entries(value as Record<string, unknown>)
          .filter(([, token]) => typeof token === 'object' && token !== null && '$value' in token)
          .map(([colorKey, token]) => {
            const color = resolveColorValue(token as ColorTokenType, this.theme.tokens);
            const cssColor = color ? legacyToModernColor.encode(color) : null;
            const tokenId = `basis.color.${key}.${colorKey}`;
            const isUsed = tokenUsage.has(tokenId);
            const usageCount = tokenUsage.get(tokenId) ?? 0;
            return { colorKey, cssColor, isUsed, tokenId, usageCount };
          })
          .filter(({ cssColor }) => cssColor !== null);
        return { colorEntries, isUsed: colorEntries.some((color) => color.isUsed), key };
      });
  }

  private prepareFontFamilies(text: Record<string, unknown>, tokenUsage: Map<string, number>) {
    return Object.entries(text['font-family'] as Record<string, unknown>).map(([name, tokenValue]) => {
      const value = (tokenValue as DesignToken).$value;
      const tokenId = `basis.text.font-family.${name}`;
      const isUsed = tokenUsage.has(tokenId);
      const usageCount = tokenUsage.get(tokenId) ?? 0;
      return { name, isUsed, tokenId, usageCount, value };
    });
  }

  private prepareFontSizes(text: Record<string, unknown>, tokenUsage: Map<string, number>) {
    return Object.entries(text['font-size'] as Record<string, unknown>)
      .reverse()
      .map(([name, tokenValue]) => {
        const value = (tokenValue as DesignToken).$value;
        const tokenId = `basis.text.font-size.${name}`;
        const isUsed = tokenUsage.has(tokenId);
        const usageCount = tokenUsage.get(tokenId) ?? 0;
        return { name, isUsed, tokenId, usageCount, value };
      });
  }

  private prepareSpaceTokens(basis: Record<string, unknown>, space: string, tokenUsage: Map<string, number>) {
    return Object.entries((basis['space'] as Record<string, unknown>)[space] as Record<string, unknown>)
      .filter(([name]) => !['min', 'max'].includes(name))
      .reverse()
      .map(([name, tokenValue]) => {
        const value = (tokenValue as DesignToken).$value;
        const tokenId = `basis.space.${space}.${name}`;
        const isUsed = tokenUsage.has(tokenId);
        const usageCount = tokenUsage.get(tokenId) ?? 0;
        return { name, isUsed, tokenId, usageCount, value };
      });
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

          <section id="colors">
            <utrecht-heading-2>${t('styleGuide.sections.colors.title')}</utrecht-heading-2>

            ${colorGroups.map(({ colorEntries, isUsed, key }) => {
              const captionId = `tokens-basis-color-${key}-caption`;
              return html`
                <utrecht-table aria-labelledby=${captionId}>
                  <utrecht-table-caption id=${captionId}>
                    ${t(`tokens.fieldLabels.basis.color.${key}.label`)}
                  </utrecht-table-caption>
                  <utrecht-table-header>
                    <utrecht-table-row>
                      <utrecht-table-header-cell scope="col">
                        ${t('styleGuide.sections.colors.table.header.sample')}
                      </utrecht-table-header-cell>
                      <utrecht-table-header-cell scope="col">
                        ${t('styleGuide.sections.colors.table.header.name')}
                      </utrecht-table-header-cell>
                      <utrecht-table-header-cell scope="col">
                        ${t('styleGuide.sections.colors.table.header.hexCode')}
                      </utrecht-table-header-cell>
                      <utrecht-table-header-cell scope="col">
                        ${t('styleGuide.sections.colors.table.header.usageCount')}
                      </utrecht-table-header-cell>
                    </utrecht-table-row>
                  </utrecht-table-header>
                  <utrecht-table-body>
                    ${colorEntries.map(
                      ({ cssColor, isUsed, tokenId, usageCount }) => html`
                        <utrecht-table-row aria-describedby=${isUsed ? nothing : `basis-color-${key}-unused-warning`}>
                          <utrecht-table-cell>
                            <svg
                              role="img"
                              xmlns="http://www.w3.org/2000/svg"
                              class="nl-color-sample"
                              style="color: ${cssColor!};"
                              aria-labelledby=${tokenId}
                              width="32"
                              height="32"
                              viewBox="0 0 32 32"
                            >
                              <path d="M0 0H32V32H0Z" fill="currentcolor" />
                            </svg>
                          </utrecht-table-cell>
                          <utrecht-table-cell>
                            <utrecht-button
                              appearance="subtle-button"
                              @click=${() => navigator.clipboard.writeText(tokenId)}
                            >
                              <utrecht-code id=${tokenId}>${tokenId}</utrecht-code>
                            </utrecht-button>
                          </utrecht-table-cell>
                          <utrecht-table-cell>
                            <utrecht-button
                              appearance="subtle-button"
                              @click=${() => navigator.clipboard.writeText(cssColor!)}
                            >
                              <utrecht-code>${cssColor}</utrecht-code>
                            </utrecht-button>
                          </utrecht-table-cell>
                          <utrecht-table-cell>
                            <span class="nl-data-badge">${usageCount}</span>
                          </utrecht-table-cell>
                        </utrecht-table-row>
                      `,
                    )}
                  </utrecht-table-body>
                </utrecht-table>
                <utrecht-paragraph>
                  <a href=${t(`tokens.fieldLabels.basis.color.${key}.docs`)}>docs</a>
                </utrecht-paragraph>
                ${isUsed
                  ? nothing
                  : html`<utrecht-paragraph id="basis-color-${key}-unused-warning" class="wizard-token-unused">
                      ${t('styleGuide.unusedTokenWarning')}
                    </utrecht-paragraph>`}
              `;
            })}
          </section>

          <section id="typography">
            <utrecht-heading-2>${t('styleGuide.sections.typography.title')}</utrecht-heading-2>

            <utrecht-table aria-labelledby="styleGuide-sections-typography-families-title">
              <utrecht-table-caption id="styleGuide-sections-typography-families-title">
                ${t(`styleGuide.sections.typography.families.title`)}
              </utrecht-table-caption>
              <utrecht-table-header>
                <utrecht-table-row>
                  <utrecht-table-header-cell scope="col">
                    ${t('styleGuide.sections.typography.families.table.header.sample')}
                  </utrecht-table-header-cell>
                  <utrecht-table-header-cell scope="col">
                    ${t('styleGuide.sections.typography.families.table.header.name')}
                  </utrecht-table-header-cell>
                  <utrecht-table-header-cell scope="col">
                    ${t('styleGuide.sections.typography.families.table.header.value')}
                  </utrecht-table-header-cell>
                  <utrecht-table-header-cell scope="col">
                    ${t('styleGuide.sections.typography.families.table.header.usageCount')}
                  </utrecht-table-header-cell>
                </utrecht-table-row>
              </utrecht-table-header>
              <utrecht-table-body>
                ${fontFamilies.map(
                  ({ name, isUsed, tokenId, usageCount, value }) => html`
                  <utrecht-table-row aria-describedby=${isUsed ? nothing : 'basis-color-typography-font-family-unused-warning'}>
                    <utrecht-table-cell>
                      <clippy-html-image>
                        <span slot="label">${t('styleGuide.sections.typography.families.sample')}</span>
                        <utrecht-paragraph style="--utrecht-paragraph-font-size: var(--basis-text-font-size-2xl); --utrecht-paragraph-font-family: ${value}; overflow: hidden; display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 1;">
                          Op brute wijze ving de schooljuf de quasi-kalme lynx.
                        </utrecht-paragraph>
                      <clippy-html-image>
                    </utrecht-table-cell>
                    <utrecht-table-cell>
                      <utrecht-button
                        appearance="subtle-button"
                        @click=${() => navigator.clipboard.writeText(tokenId)}
                      >
                        <utrecht-code id="${`basis-text-font-family-${name}`}">
                          ${tokenId}
                        </utrecht-code>
                      </utrecht-button>
                    </utrecht-table-cell>
                    <utrecht-table-cell>
                      <utrecht-button appearance="subtle-button" @click=${() => navigator.clipboard.writeText(value)}>
                        <utrecht-code>${value}</utrecht-code>
                      </utrecht-button>
                    </utrecht-table-cell>
                    <utrecht-table-cell>
                      <span class="nl-data-badge">${usageCount}</span>
                    </utrecht-table-cell>
                  </utrecht-table-row>
                `,
                )}
              </utrecht-table-body>
            </utrecht-table>
            <utrecht-paragraph>
              <a href="https://nldesignsystem.nl/handboek/huisstijl/themas/start-thema/#lettertype" target="_blank">
                docs
              </a>
            </utrecht-paragraph>
            ${
              fontFamilies.every((family) => family.isUsed)
                ? nothing
                : html`<utrecht-paragraph
                    id="basis-color-typography-font-family-unused-warning"
                    class="wizard-token-unused"
                  >
                    ${t('styleGuide.unusedTokenWarning')}
                  </utrecht-paragraph>`
            }

            <utrecht-table aria-labelledby="styleGuide-sections-typography-sizes-title">
              <utrecht-table-caption id="styleGuide-sections-typography-sizes-title">
                ${t(`styleGuide.sections.typography.sizes.title`)}
              </utrecht-table-caption>
              <utrecht-table-header>
                <utrecht-table-row>
                  <utrecht-table-header-cell scope="col">
                    ${t('styleGuide.sections.typography.sizes.table.header.sample')}
                  </utrecht-table-header-cell>
                  <utrecht-table-header-cell scope="col">
                    ${t('styleGuide.sections.typography.sizes.table.header.name')}
                  </utrecht-table-header-cell>
                  <utrecht-table-header-cell scope="col">
                    ${t('styleGuide.sections.typography.sizes.table.header.value')}
                  </utrecht-table-header-cell>
                  <utrecht-table-header-cell scope="col">
                    ${t('styleGuide.sections.typography.sizes.table.header.usageCount')}
                  </utrecht-table-header-cell>
                </utrecht-table-row>
              </utrecht-table-header>
              <utrecht-table-body>
                ${fontSizes.map(
                  ({ name, isUsed, tokenId, value }) => html`
                    <utrecht-table-row
                      aria-describedby=${isUsed ? nothing : 'basis-color-typography-sizes-unused-warning'}
                    >
                      <utrecht-table-cell>
                        <clippy-html-image>
                          <span slot="label">${t('styleGuide.sections.typography.sizes.sample')}</span>
                          <utrecht-paragraph
                            style="--utrecht-paragraph-font-size: ${value}; overflow: hidden; display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 1;"
                          >
                            Op brute wijze ving de schooljuf de quasi-kalme lynx.
                          </utrecht-paragraph>
                        </clippy-html-image>
                      </utrecht-table-cell>
                      <utrecht-table-cell>
                        <utrecht-button
                          appearance="subtle-button"
                          @click=${() => navigator.clipboard.writeText(tokenId)}
                        >
                          <utrecht-code id="${`basis-text-font-size-${name}`}"> ${tokenId} </utrecht-code>
                        </utrecht-button>
                      </utrecht-table-cell>
                      <utrecht-table-cell>
                        <utrecht-button appearance="subtle-button" @click=${() => navigator.clipboard.writeText(value)}>
                          <utrecht-code>${value}</utrecht-code>
                        </utrecht-button>
                      </utrecht-table-cell>
                      <utrecht-table-cell>
                        <span class="nl-data-badge">${tokenUsage.get(tokenId) ?? 0}</span>
                      </utrecht-table-cell>
                    </utrecht-table-row>
                  `,
                )}
              </tbody>
            </utrecht-table>
            <utrecht-paragraph>
              <a href="https://nldesignsystem.nl/handboek/huisstijl/themas/start-thema/#lettergrootte" target="_blank">
                docs
              </a>
            </utrecht-paragraph>
            ${
              fontSizes.every((size) => size.isUsed)
                ? nothing
                : html`<utrecht-paragraph id="basis-color-typography-sizes-unused-warning" class="wizard-token-unused">
                    ${t('styleGuide.unusedTokenWarning')}
                  </utrecht-paragraph>`
            }

            <utrecht-table aria-labelledby="styleGuide-sections-typography-headings-title">
              <utrecht-table-caption id="styleGuide-sections-typography-headings-title">
                ${t(`styleGuide.sections.typography.headings.title`)}
              </utrecht-table-caption>
              <utrecht-table-header>
                <utrecht-table-row>
                  <utrecht-table-header-cell scope="col">
                    ${t('styleGuide.sections.typography.headings.table.header.sample')}
                  </utrecht-table-header-cell>
                  <utrecht-table-header-cell scope="col">
                    ${t('styleGuide.sections.typography.headings.table.header.name')}
                  </utrecht-table-header-cell>
                </utrecht-table-row>
              </utrecht-table-header>
              <utrecht-table-body>
                ${[1, 2, 3, 4, 5, 6].map((level) => {
                  const tag = unsafeStatic(`h${level}`);
                  const heading = staticHtml`<${tag} class="nl-heading nl-heading--level-${level}" style="line-clamp: 3; overflow: hidden; display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 3;">Wijzigingswet Vreemdelingenwet 2000, enz. (vaststelling criteria en instrumenten ter bepaling van de verantwoordelijke lidstaat voor behandeling verzoek om internationale bescherming)</${tag}>`;
                  return html`
                    <utrecht-table-row>
                      <utrecht-table-cell>
                        <clippy-html-image>
                          <span slot="label">${t('styleGuide.sections.typography.headings.sample')}</span>
                          ${heading}
                        </clippy-html-image>
                      </utrecht-table-cell>
                      <utrecht-table-cell>
                        <utrecht-button
                          appearance="subtle-button"
                          @click=${() => navigator.clipboard.writeText(`basis.heading.level-${level}`)}
                        >
                          <utrecht-code id="${`basis.heading.level-${level}`}" style="white-space: nowrap">
                            ${`basis.heading.level-${level}`}
                          </utrecht-code>
                        </utrecht-button>
                      </utrecht-table-cell>
                    </utrecht-table-row>
                  `;
                })}
              </tbody>
            </utrecht-table>
            <utrecht-paragraph>
              <a href="https://nldesignsystem.nl/heading/" target="_blank">docs</a>
            </utrecht-paragraph>
          </section>

          <section id="spacing">
            <utrecht-heading-2>${t('styleGuide.sections.space.title')}</utrecht-heading-2>
            <utrecht-paragraph>
              <a href="https://nldesignsystem.nl/richtlijnen/stijl/ruimte/spacing-concepten/" target="_blank"> docs </a>
            </utrecht-paragraph>

            ${spacingData.map(({ space, tokens }) => {
              const captionId = `styleguide-section-space-${space}-title`;
              return html`
                <utrecht-table aria-labelledby=${captionId}>
                  <utrecht-table-caption id=${captionId}>
                    ${t(`styleGuide.sections.space.${space}.title`)}
                  </utrecht-table-caption>
                  <utrecht-table-header>
                    <utrecht-table-row>
                      <utrecht-table-header-cell scope="col">
                        ${t('styleGuide.sections.space.table.header.sample')}
                      </utrecht-table-header-cell>
                      <utrecht-table-header-cell scope="col">
                        ${t('styleGuide.sections.space.table.header.name')}
                      </utrecht-table-header-cell>
                      <utrecht-table-header-cell scope="col">
                        ${t('styleGuide.sections.space.table.header.value')}
                      </utrecht-table-header-cell>
                      <utrecht-table-header-cell scope="col">
                        ${t('styleGuide.sections.space.table.header.usageCount')}
                      </utrecht-table-header-cell>
                    </utrecht-table-row>
                  </utrecht-table-header>
                  <utrecht-table-body>
                    ${tokens.map(
                      ({ name, isUsed, tokenId, value }) => html`
                        <utrecht-table-row aria-describedby=${isUsed ? nothing : `basis-space-${space}-unused-warning`}>
                          <utrecht-table-cell>
                            <clippy-html-image>
                              <span slot="label">${t(`styleGuide.sections.space.${space}.sample`)}</span>
                              <div
                                style="block-size: ${['block', 'row'].includes(space)
                                  ? value
                                  : '2rem'}; inline-size: ${['inline', 'column', 'text'].includes(space)
                                  ? value
                                  : '2rem'}; background-color: currentColor; cursor: default; forced-color-adjust: none; user-select: none;"
                              ></div>
                            </clippy-html-image>
                          </utrecht-table-cell>
                          <utrecht-table-cell>
                            <utrecht-button
                              appearance="subtle-button"
                              @click=${() => navigator.clipboard.writeText(tokenId)}
                            >
                              <utrecht-code id="${`basis-space-${space}-${name}`}"> ${tokenId} </utrecht-code>
                            </utrecht-button>
                          </utrecht-table-cell>
                          <utrecht-table-cell>
                            <utrecht-button
                              appearance="subtle-button"
                              @click=${() => navigator.clipboard.writeText(value)}
                            >
                              <utrecht-code>${value}</utrecht-code>
                            </utrecht-button>
                          </utrecht-table-cell>
                          <utrecht-table-cell>
                            <span class="nl-data-badge">${tokenUsage.get(tokenId) ?? 0}</span>
                          </utrecht-table-cell>
                        </utrecht-table-row>
                      `,
                    )}
                  </tbody>
                </utrecht-table>

                <utrecht-paragraph>
                  <a
                    href="https://nldesignsystem.nl/richtlijnen/stijl/ruimte/spacing-concepten/#${space}"
                    target="_blank"
                  >
                    docs
                  </a>
                </utrecht-paragraph>

                <utrecht-paragraph id="basis-space-${space}-unused-warning" class="wizard-token-unused">
                  ${t('styleGuide.unusedTokenWarning')}
                </utrecht-paragraph>
              `;
            })}
          </section>
        </div>
      </wizard-layout>
    `;
  }
}
