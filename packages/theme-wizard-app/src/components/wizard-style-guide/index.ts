import { consume } from '@lit/context';
import colorSampleCss from '@nl-design-system-candidate/color-sample-css/color-sample.css?inline';
import headingCss from '@nl-design-system-candidate/heading-css/heading.css?inline';
<<<<<<< HEAD
import {
  legacyToModernColor,
  type ColorToken as ColorTokenType,
} from '@nl-design-system-community/design-tokens-schema';
||||||| parent of c602bc7 (initial style Guide page setup)
import { LitElement, html } from 'lit';
=======
import { legacyToModernColor } from '@nl-design-system-community/design-tokens-schema';
>>>>>>> c602bc7 (initial style Guide page setup)
import { LitElement, html, nothing, unsafeCSS } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import '../wizard-layout';
import { html as staticHtml, unsafeStatic } from 'lit/static-html.js';
<<<<<<< HEAD
import { DesignToken } from 'style-dictionary/types';
||||||| parent of c602bc7 (initial style Guide page setup)
=======
>>>>>>> c602bc7 (initial style Guide page setup)
import type Theme from '../../lib/Theme';
import { themeContext } from '../../contexts/theme';
import { t } from '../../i18n';
import { resolveColorValue } from '../wizard-colorscale-input';
import styles from './styles';
<<<<<<< HEAD
import '@nl-design-system-community/clippy-components/clippy-html-image';
||||||| parent of c602bc7 (initial style Guide page setup)
import '../wizard-layout';
=======
>>>>>>> c602bc7 (initial style Guide page setup)

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

  static override readonly styles = [unsafeCSS(colorSampleCss), unsafeCSS(headingCss), styles];

  override connectedCallback(): void {
    super.connectedCallback();
    document.title = t('styleGuide.title').toString();
  }

<<<<<<< HEAD
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

||||||| parent of c602bc7 (initial style Guide page setup)
=======
>>>>>>> c602bc7 (initial style Guide page setup)
  override render() {
    if (!this.theme) {
      return t('loading');
    }

<<<<<<< HEAD
    const basis = this.theme.tokens['basis'] as Record<string, unknown>;
    const colors = basis['color'] as Record<string, unknown>;
    const text = basis['text'] as Record<string, unknown>;
||||||| parent of c602bc7 (initial style Guide page setup)
=======
    const basis = this.theme.tokens['basis'];
>>>>>>> c602bc7 (initial style Guide page setup)

    return html`
      <wizard-layout>
<<<<<<< HEAD
        <nav slot="sidebar" class="wizard-styleguide__nav" @click=${this.handleNavClick}>
          <a class="wizard-styleguide__nav-item" href="#colors">${t('styleGuide.sections.colors.title')}</a>
          <a class="wizard-styleguide__nav-item" href="#typography">${t('styleGuide.sections.typography.title')}</a>
          <a class="wizard-styleguide__nav-item" href="#spacing">${t('styleGuide.sections.space.title')}</a>
        </nav>

        <div slot="main" class="wizard-styleguide__main">
          <utrecht-heading-1>${t('styleGuide.title')}</utrecht-heading-1>

          <section id="colors">
            <utrecht-heading-2>${t('styleGuide.sections.colors.title')}</utrecht-heading-2>

            ${Object.entries(colors)
              .filter(([key]) => !key.includes('inverse') && !key.includes('transparent'))
              .filter(([, value]) => typeof value === 'object' && value !== null)
              .map(([key, value]) => {
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
                      </utrecht-table-row>
                    </utrecht-table-header>
                    <utrecht-table-body>
                      ${Object.entries(value as Record<string, unknown>)
                        .filter(([, token]) => typeof token === 'object' && token !== null && '$value' in token)
                        .map(([colorKey, token]) => {
                          const color = resolveColorValue(token as ColorTokenType, this.theme.tokens);
                          if (!color) {
                            return nothing;
                          }
                          const cssColor = legacyToModernColor.encode(color);
                          const colorId = `basis.color.${key}.${colorKey}`;
                          return html`
                            <utrecht-table-row>
                              <utrecht-table-cell>
                                <svg
                                  role="img"
                                  xmlns="http://www.w3.org/2000/svg"
                                  class="nl-color-sample"
                                  style="color: ${cssColor};"
                                  aria-labelledby=${colorId}
                                >
                                  <path d="M0 0H32V32H0Z" fill="currentcolor" />
                                </svg>
                              </utrecht-table-cell>
                              <utrecht-table-cell>
                                <utrecht-button
                                  appearance="subtle-button"
                                  @click=${() => navigator.clipboard.writeText(colorId)}
                                >
                                  <utrecht-code id=${colorId}>${colorId}</utrecht-code>
                                </utrecht-button>
                              </utrecht-table-cell>
                              <utrecht-table-cell>
                                <utrecht-button
                                  appearance="subtle-button"
                                  @click=${() => navigator.clipboard.writeText(cssColor)}
                                >
                                  <utrecht-code>${cssColor}</utrecht-code>
                                </utrecht-button>
                              </utrecht-table-cell>
                            </utrecht-table-row>
                          `;
                        })}
                    </utrecht-table-body>
                  </utrecht-table>
                  <utrecht-paragraph>
                    <a href=${t(`tokens.fieldLabels.basis.color.${key}.docs`)}>docs</a>
                  </utrecht-paragraph>
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
                </utrecht-table-row>
              </utrecht-table-header>
              <utrecht-table-body>
                ${Object.entries(text['font-family'] as Record<string, unknown>).map(([name, tokenValue]) => {
                  const value = (tokenValue as DesignToken).$value;
                  return html`
                    <utrecht-table-row>
                      <utrecht-table-cell>
                        <clippy-html-image>
                          <span slot="label">${t('styleGuide.sections.typography.families.sample')}</span>
                          <utrecht-paragraph style="--utrecht-paragraph-font-size: var(--basis-text-font-size-2xl); --utrecht-paragraph-font-family: ${value};">Abc</utrecht-paragraph>
                        <clippy-html-image>
                      </utrecht-table-cell>
                      <utrecht-table-cell>
                        <utrecht-button
                          appearance="subtle-button"
                          @click=${() => navigator.clipboard.writeText(`basis.text.font-family.${name}`)}
                        >
                          <utrecht-code id="${`basis.text.font-family.${name}`}">
                            ${`basis.text.font-family.${name}`}
                          </utrecht-code>
                        </utrecht-button>
                      </utrecht-table-cell>
                      <utrecht-table-cell>
                        <utrecht-button appearance="subtle-button" @click=${() => navigator.clipboard.writeText(value)}>
                          <utrecht-code>${value}</utrecht-code>
                        </utrecht-button>
                      </utrecht-table-cell>
                    </utrecht-table-row>
                  `;
                })}
              </utrecht-table-body>
            </utrecht-table>
            <utrecht-paragraph>
              <a href="https://nldesignsystem.nl/handboek/huisstijl/themas/start-thema/#lettertype" target="_blank">
                docs
              </a>
            </utrecht-paragraph>

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
                </utrecht-table-row>
              </utrecht-table-header>
              <utrecht-table-body>
                ${Object.entries(text['font-size'] as Record<string, unknown>)
                  .reverse()
                  .map(([name, tokenValue]) => {
                    const value = (tokenValue as DesignToken).$value;
                    return html`
                      <utrecht-table-row>
                        <utrecht-table-cell>
                          <clippy-html-image>
                            <span slot="label">${t('styleGuide.sections.typography.sizes.sample')}</span>
                            <utrecht-paragraph style="--utrecht-paragraph-font-size: ${value};">Abc</utrecht-paragraph>
                          </clippy-html-image>
                        </utrecht-table-cell>
                        <utrecht-table-cell>
                          <utrecht-button
                            appearance="subtle-button"
                            @click=${() => navigator.clipboard.writeText(`basis.text.font-size.${name}`)}
                          >
                            <utrecht-code id="${`basis.text.font-size.${name}`}">
                              ${`basis.text.font-size.${name}`}
                            </utrecht-code>
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
                      </utrecht-table-row>
                    `;
                  })}
              </utrecht-table-body>
            </utrecht-table>
            <utrecht-paragraph>
              <a href="https://nldesignsystem.nl/handboek/huisstijl/themas/start-thema/#lettergrootte" target="_blank">
                docs
              </a>
            </utrecht-paragraph>

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
              </utrecht-table-body>
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

            ${['block', 'inline', 'text', 'column', 'row'].map((space) => {
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
                    </utrecht-table-row>
                  </utrecht-table-header>
                  <utrecht-table-body>
                    ${Object.entries((basis['space'] as Record<string, unknown>)[space] as Record<string, unknown>)
                      .filter(([name]) => !['min', 'max'].includes(name))
                      .reverse()
                      .map(([name, tokenValue]) => {
                        const value = (tokenValue as DesignToken).$value;
                        return html`
                          <utrecht-table-row>
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
                                @click=${() => navigator.clipboard.writeText(`basis.space.${space}.${name}`)}
                              >
                                <utrecht-code id="${`basis.space.${space}.${name}`}">
                                  ${`basis.space.${space}.${name}`}
                                </utrecht-code>
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
                          </utrecht-table-row>
                        `;
                      })}
                  </utrecht-table-body>
                </utrecht-table>
              `;
            })}
||||||| parent of c602bc7 (initial style Guide page setup)
        <div slot="main">
          <utrecht-paragraph>
            Theme has ${Object.keys(this.theme.tokens).length} top-level token groups.
          </utrecht-paragraph>
=======
        <nav slot="sidebar">
          <a href="#colors">${t('styleGuide.sections.colors.title')}</a>
          <br />
          <a href="#typography">${t('styleGuide.sections.typography.title')}</a>
          <br />
          <a href="#spacing">${t('styleGuide.sections.space.title')}</a>
        </nav>

        <div slot="main" class="wizard-styleguide__main">
          <utrecht-heading-1>${t('styleGuide.title')}</utrecht-heading-1>

          <section id="colors">
            <utrecht-heading-2>${t('styleGuide.sections.colors.title')}</utrecht-heading-2>

            ${Object.entries(basis['color'])
              .filter(([key]) => !key.includes('inverse') && !key.includes('transparent'))
              .map(([key, value]) => {
                return html`
                  <utrecht-heading-3>${t(`tokens.fieldLabels.basis.color.${key}.label`)}</utrecht-heading-3>
                  <utrecht-paragraph>
                    <a href=${t(`tokens.fieldLabels.basis.color.${key}.docs`)}>docs</a>
                  </utrecht-paragraph>
                  <utrecht-table>
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
                      </utrecht-table-row>
                    </utrecht-table-header>
                    <utrecht-table-body>
                      ${Object.entries(value).map(([colorKey, token]) => {
                        try {
                          const color = resolveColorValue(token);
                          const cssColor = color ? legacyToModernColor.encode(color) : '';
                          return html`
                            <utrecht-table-row>
                              <utrecht-table-cell>
                                <svg
                                  role="img"
                                  xmlns="http://www.w3.org/2000/svg"
                                  class="nl-color-sample"
                                  style="color: ${cssColor};"
                                  aria-labelledby="${`basis.color.${key}.${colorKey}`}"
                                >
                                  <path d="M0 0H32V32H0Z" fill="currentcolor" />
                                </svg>
                              </utrecht-table-cell>
                              <utrecht-table-cell>
                                <utrecht-button
                                  apprearance="subtle"
                                  @click=${() => navigator.clipboard.writeText(cssColor)}
                                >
                                  <utrecht-code id="${`basis.color.${key}.${colorKey}`}">
                                    ${`basis.color.${key}.${colorKey}`}
                                  </utrecht-code>
                                </utrecht-button>
                              </utrecht-table-cell>
                              <utrecht-table-cell>
                                <utrecht-button
                                  apprearance="subtle"
                                  @click=${() => navigator.clipboard.writeText(cssColor)}
                                >
                                  <utrecht-code>${cssColor}</utrecht-code>
                                </utrecht-button>
                              </utrecht-table-cell>
                            </utrecht-table-row>
                          `;
                        } catch {
                          return nothing;
                        }
                      })}
                    </utrecht-table-body>
                  </utrecht-table>
                `;
              })}
          </section>

          <section id="typography">
            <utrecht-heading-2>${t('styleGuide.sections.typography.title')}</utrecht-heading-2>

            <utrecht-heading-3>${t(`styleGuide.sections.typography.sizes.title`)}</utrecht-heading-3>
            <utrecht-paragraph>
              <a href="https://nldesignsystem.nl/handboek/huisstijl/themas/start-thema/#lettergrootte" target="_blank">
                docs
              </a>
            </utrecht-paragraph>
            <utrecht-table>
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
                </utrecht-table-row>
              </utrecht-table-header>
              <utrecht-table-body>
                ${Object.entries(basis['text']['font-size'])
                  .reverse()
                  .map(([name, value]) => {
                    return html`
                      <utrecht-table-row>
                        <utrecht-table-header-cell>
                          <!-- TODO: replace with <clippy-html-image> when ready -->
                          <div
                            role="img"
                            aria-label=${t('styleGuide.sections.typography.sizes.sample')}
                            style="--utrecht-paragraph-font-size: ${value.$value}; cursor: default; forced-color-adjust: none; user-select: none;"
                          >
                            <utrecht-paragraph>Abc</utrecht-paragraph>
                          </div>
                        </utrecht-table-header-cell>
                        <utrecht-table-header-cell>
                          <utrecht-button
                            apprearance="subtle"
                            @click=${() => navigator.clipboard.writeText(`basis.text.font-size.${name}`)}
                          >
                            <utrecht-code id="${`basis.text.font-size.${name}`}">
                              ${`basis.text.font-size.${name}`}
                            </utrecht-code>
                          </utrecht-button>
                        </utrecht-table-header-cell>
                        <utrecht-table-header-cell>
                          <utrecht-button
                            apprearance="subtle"
                            @click=${() => navigator.clipboard.writeText(value.$value)}
                          >
                            <utrecht-code>${value.$value}</utrecht-code>
                          </utrecht-button>
                        </utrecht-table-header-cell>
                      </utrecht-table-row>
                    `;
                  })}
              </utrecht-table-body>
            </utrecht-table>

            <utrecht-heading-3>${t(`styleGuide.sections.typography.headings.title`)}</utrecht-heading-3>
            <utrecht-paragraph>
              <a href="https://nldesignsystem.nl/heading/" target="_blank">docs</a>
            </utrecht-paragraph>
            <utrecht-table>
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
                      <utrecht-table-header-cell>
                        <!-- TODO: replace with <clippy-html-image> when ready -->
                        <div
                          role="img"
                          aria-label=${t('styleGuide.sections.typography.headings.sample')}
                          style="cursor: default; forced-color-adjust: none; user-select: none;"
                        >
                          ${heading}
                        </div>
                      </utrecht-table-header-cell>
                      <utrecht-table-header-cell>
                        <utrecht-button
                          apprearance="subtle"
                          @click=${() => navigator.clipboard.writeText(`basis.heading.level-${level}`)}
                        >
                          <utrecht-code id="${`basis.heading.level-${level}`}" style="white-space: nowrap">
                            ${`basis.heading.level-${level}`}
                          </utrecht-code>
                        </utrecht-button>
                      </utrecht-table-header-cell>
                    </utrecht-table-row>
                  `;
                })}
              </utrecht-table-body>
            </utrecht-table>
          </section>

          <section id="spacing">
            <utrecht-heading-2>${t('styleGuide.sections.space.title')}</utrecht-heading-2>
            <utrecht-paragraph>
              <a href="https://nldesignsystem.nl/richtlijnen/stijl/ruimte/spacing-concepten/" target="_blank"> docs </a>
            </utrecht-paragraph>

            ${['block', 'inline', 'text', 'column', 'row'].map(
              (space) => html`
                <utrecht-heading-3>${t(`styleGuide.sections.space.${space}.title`)}</utrecht-heading-3>
                <utrecht-table>
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
                    </utrecht-table-row>
                  </utrecht-table-header>
                  <utrecht-table-body>
                    ${Object.entries(basis['space'][space])
                      .filter(([name]) => !['min', 'max'].includes(name))
                      .reverse()
                      .map(([name, value]) => {
                        return html`
                          <utrecht-table-row>
                            <utrecht-table-header-cell>
                              <!-- TODO: replace with <clippy-html-image> when ready -->
                              <div
                                role="img"
                                aria-label=${t(`styleGuide.sections.space.${space}.sample`)}
                                style="block-size: ${['block', 'row'].includes(space)
                                  ? value.$value
                                  : '2rem'}; inline-size: ${['inline', 'column', 'text'].includes(space)
                                  ? value.$value
                                  : '2rem'}; background-color: currentColor; cursor: default; forced-color-adjust: none; user-select: none;"
                              ></div>
                            </utrecht-table-header-cell>
                            <utrecht-table-header-cell>
                              <utrecht-button
                                apprearance="subtle"
                                @click=${() => navigator.clipboard.writeText(`basis.space.${space}.${name}`)}
                              >
                                <utrecht-code id="${`basis.space.${space}.${name}`}">
                                  ${`basis.space.${space}.${name}`}
                                </utrecht-code>
                              </utrecht-button>
                            </utrecht-table-header-cell>
                            <utrecht-table-header-cell>
                              <utrecht-button
                                apprearance="subtle"
                                @click=${() => navigator.clipboard.writeText(value.$value)}
                              >
                                <utrecht-code>${value.$value}</utrecht-code>
                              </utrecht-button>
                            </utrecht-table-header-cell>
                          </utrecht-table-row>
                        `;
                      })}
                  </utrecht-table-body>
                </utrecht-table>
              `,
            )}
>>>>>>> c602bc7 (initial style Guide page setup)
          </section>
        </div>
      </wizard-layout>
    `;
  }
}
