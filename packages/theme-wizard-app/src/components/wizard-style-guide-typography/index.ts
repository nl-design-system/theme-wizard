import '@nl-design-system-community/clippy-components/clippy-html-image';
import type { TokenGroup } from '@nl-design-system-community/clippy-components/clippy-reset-theme';
import '@nl-design-system-community/clippy-components/clippy-heading';
import '@nl-design-system-community/clippy-components/clippy-toggletip';
import '@nl-design-system-community/clippy-components/clippy-token-sample-text';
import '@nl-design-system-community/clippy-components/clippy-token-table';
import '@nl-design-system-community/clippy-components/clippy-reset-theme';
import '../wizard-preview-theme';
import { consume } from '@lit/context';
import linkCss from '@nl-design-system-candidate/link-css/link.css?inline';
import paragraphCss from '@nl-design-system-candidate/paragraph-css/paragraph.css?inline';
import { LitElement, html, unsafeCSS } from 'lit';
import { customElement, state } from 'lit/decorators.js';
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

  static override readonly styles = [unsafeCSS(linkCss), unsafeCSS(paragraphCss), styles];

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

        <clippy-reset-theme>
          <wizard-preview-theme>
            <clippy-token-table
              .tokens=${Object.values(text['font-family'] as TokenGroup)}
              example-label=${t('styleGuide.sample')}
              token-id-label=${t('styleGuide.tokenName')}
              value-label=${t('styleGuide.value')}
              reference-to-label=${t('styleGuide.referenceTo')}
              details-label=${t('styleGuide.details')}
              show-details-label=${t('styleGuide.showDetails')}
              copy-to-clipboard-label=${t('styleGuide.detailsDialog.copyToClipboard')}
              reference-title-label=${t('styleGuide.detailsDialog.tokenReferenceList.title')}
              reference-empty-label=${t('styleGuide.detailsDialog.tokenReferenceList.empty')}
            ></clippy-token-table>
          </wizard-preview-theme>
        </clippy-reset-theme>

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
        <clippy-reset-theme>
          <wizard-preview-theme>
            <clippy-token-table
              .tokens=${Object.values(text['font-size'] as TokenGroup)}
              example-label=${t('styleGuide.sample')}
              token-id-label=${t('styleGuide.tokenName')}
              value-label=${t('styleGuide.value')}
              reference-to-label=${t('styleGuide.referenceTo')}
              details-label=${t('styleGuide.details')}
              show-details-label=${t('styleGuide.showDetails')}
              copy-to-clipboard-label=${t('styleGuide.detailsDialog.copyToClipboard')}
              reference-title-label=${t('styleGuide.detailsDialog.tokenReferenceList.title')}
              reference-empty-label=${t('styleGuide.detailsDialog.tokenReferenceList.empty')}
            ></clippy-token-table>
          </wizard-preview-theme>
        </clippy-reset-theme>

        <p class="nl-paragraph">
          <a
            class="nl-link"
            href="https://nldesignsystem.nl/handboek/huisstijl/basis-tokens/#lettergrootte"
            target="_blank"
          >
            docs
          </a>
        </p>
      </div>
    `;
  }
}
