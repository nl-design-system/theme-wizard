// @ts-nocheck

import { consume } from '@lit/context';
import colorSampleCss from '@nl-design-system-candidate/color-sample-css/color-sample.css?inline';
import headingCss from '@nl-design-system-candidate/heading-css/heading.css?inline';
import { legacyToModernColor } from '@nl-design-system-community/design-tokens-schema';
import { LitElement, html, nothing, unsafeCSS } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import '../wizard-layout';
import { html as staticHtml, unsafeStatic } from 'lit/static-html.js';
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

  static override readonly styles = [unsafeCSS(colorSampleCss), unsafeCSS(headingCss), styles];

  override connectedCallback(): void {
    super.connectedCallback();
    document.title = t('styleGuide.title').toString();
  }

  override render() {
    if (!this.theme) {
      return t('loading');
    }

    const basis = this.theme.tokens['basis'];
    const colors = basis['color'];

    return html`
      <wizard-layout>
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

            ${Object.entries(colors)
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
                          // TODO: figure out why this is breaking
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
                  .map(([name, tokenValue]) => {
                    const value = (tokenValue as DesignToken).$value;
                    return html`
                      <utrecht-table-row>
                        <utrecht-table-header-cell>
                          <!-- TODO: replace with <clippy-html-image> when ready -->
                          <div
                            role="img"
                            aria-label=${t('styleGuide.sections.typography.sizes.sample')}
                            style="--utrecht-paragraph-font-size: ${value}; cursor: default; forced-color-adjust: none; user-select: none;"
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
                          <utrecht-button apprearance="subtle" @click=${() => navigator.clipboard.writeText(value)}>
                            <utrecht-code>${value}</utrecht-code>
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
                      .map(([name, tokenValue]) => {
                        const value = (tokenValue as DesignToken).$value;
                        return html`
                          <utrecht-table-row>
                            <utrecht-table-header-cell>
                              <!-- TODO: replace with <clippy-html-image> when ready -->
                              <div
                                role="img"
                                aria-label=${t(`styleGuide.sections.space.${space}.sample`)}
                                style="block-size: ${['block', 'row'].includes(space)
                                  ? value
                                  : '2rem'}; inline-size: ${['inline', 'column', 'text'].includes(space)
                                  ? value
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
                              <utrecht-button apprearance="subtle" @click=${() => navigator.clipboard.writeText(value)}>
                                <utrecht-code>${value}</utrecht-code>
                              </utrecht-button>
                            </utrecht-table-header-cell>
                          </utrecht-table-row>
                        `;
                      })}
                  </utrecht-table-body>
                </utrecht-table>
              `,
            )}
          </section>
        </div>
      </wizard-layout>
    `;
  }
}
