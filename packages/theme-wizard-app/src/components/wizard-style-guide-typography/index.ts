import '@nl-design-system-community/clippy-components/clippy-html-image';
import { consume } from '@lit/context';
import codeCss from '@nl-design-system-candidate/code-css/code.css?inline';
import dataBadgeCss from '@nl-design-system-candidate/data-badge-css/data-badge.css?inline';
import '@nl-design-system-community/clippy-components/clippy-heading';
import '@nl-design-system-community/clippy-components/clippy-toggletip';
import '@nl-design-system-community/clippy-components/clippy-token-sample-text';
import '@nl-design-system-community/clippy-components/clippy-token-table';
import linkCss from '@nl-design-system-candidate/link-css/link.css?inline';
import paragraphCss from '@nl-design-system-candidate/paragraph-css/paragraph.css?inline';
import { TokenGroup } from '@nl-design-system-community/clippy-components/clippy-reset-theme';
import ClipboardCopyIcon from '@tabler/icons/outline/clipboard-copy.svg?raw';
import buttonLinkStyles from '@utrecht/link-button-css?inline';
import tableCss from '@utrecht/table-css/dist/index.css?inline';
import { LitElement, html, unsafeCSS } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import { html as staticHtml } from 'lit/static-html.js';
import type Theme from '../../lib/Theme';
import { themeContext } from '../../contexts/theme';
import { t } from '../../i18n';
import styles from '../wizard-style-guide/styles';

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

  static override readonly styles = [
    /* Remove when all tables are clippy-token-table */
    unsafeCSS(dataBadgeCss),
    unsafeCSS(tableCss),
    unsafeCSS(codeCss),
    unsafeCSS(buttonLinkStyles),
    /* end-remove */
    unsafeCSS(linkCss),
    unsafeCSS(paragraphCss),
    styles,
  ];

  // #linkToGoogleFontsSpecimen(family: string): string | null {
  //   const googleFont = googleFonts.find((font) => font.label === family);
  //   if (!googleFont) return null;
  //   return `https://fonts.google.com/specimen/${googleFont.label.replaceAll(/\s+/g, '+')}`;
  // }

  override render() {
    const basis = this.theme.tokens['basis'] as Record<string, unknown>;
    const text = basis['text'] as Record<string, unknown>;

    return html`
      <div class="wizard-style-guide">
        <clippy-heading level="3">${t('styleGuide.sections.typography.families.title')}</clippy-heading>
        <clippy-token-table
          .tokens=${Object.values(text['font-family'] as TokenGroup)}
          example-label=${t('styleGuide.sample')}
          token-id-label=${t('styleGuide.tokenName')}
          value-label=${t('styleGuide.value')}
          details-label=${t('styleGuide.details')}
          show-details-label=${t('styleGuide.showDetails')}
          copy-to-clipboard-label=${t('styleGuide.detailsDialog.copyToClipboard')}
          reference-title-label=${t('styleGuide.detailsDialog.tokenReferenceList.title')}
          reference-empty-label=${t('styleGuide.detailsDialog.tokenReferenceList.empty')}
        ></clippy-token-table>

        <p class="nl-paragraph">
          <a
            class="nl-link"
            href="https://nldesignsystem.nl/handboek/huisstijl/basis-tokens/#lettertype"
            target="_blank"
          >
            docs
          </a>
        </p>

        <clippy-heading level="3">${t('styleGuide.sections.typography.sizes.title')}</clippy-heading>
        <clippy-token-table
          .tokens=${Object.values(text['font-size'] as TokenGroup)}
          example-label=${t('styleGuide.sample')}
          token-id-label=${t('styleGuide.tokenName')}
          value-label=${t('styleGuide.value')}
          details-label=${t('styleGuide.details')}
          show-details-label=${t('styleGuide.showDetails')}
          copy-to-clipboard-label=${t('styleGuide.detailsDialog.copyToClipboard')}
          reference-title-label=${t('styleGuide.detailsDialog.tokenReferenceList.title')}
          reference-empty-label=${t('styleGuide.detailsDialog.tokenReferenceList.empty')}
        ></clippy-token-table>

        <p class="nl-paragraph">
          <a
            class="nl-link"
            href="https://nldesignsystem.nl/handboek/huisstijl/basis-tokens/#lettergrootte"
            target="_blank"
          >
            docs
          </a>
        </p>

        <wizard-table-scroller>
          <table class="utrecht-table">
            <caption class="utrecht-table__caption">
              <mark>${t('styleGuide.sections.typography.headings.title')}</mark>
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
        </wizard-table-scroller>
        <p class="nl-paragraph">
          <a class="nl-link" href="https://nldesignsystem.nl/heading/" target="_blank">docs</a>
        </p>
      </div>
    `;
  }
}
