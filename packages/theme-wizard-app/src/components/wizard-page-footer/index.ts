import linkCSS from '@nl-design-system-candidate/link-css/link.css?inline';
import paragraphCSS from '@nl-design-system-candidate/paragraph-css/paragraph.css?inline';
import '../wizard-logo';
import { LitElement, html, unsafeCSS } from 'lit';
import { customElement } from 'lit/decorators.js';
import { t } from '../../i18n';
import styles from './styles';

const tag = 'wizard-page-footer';

declare global {
  interface HTMLElementTagNameMap {
    [tag]: WizardPageFooter;
  }
}

@customElement(tag)
export class WizardPageFooter extends LitElement {
  static override readonly styles = [unsafeCSS(paragraphCSS), unsafeCSS(linkCSS), styles];

  override render() {
    return html`
      <div class="wizard-page-footer__content">
        <div class="wizard-page-footer__logo">
          <wizard-logo></wizard-logo>
        </div>
        <div class="wizard-page-footer__about">
          <p class="nl-paragraph">${t('footer.colophon.about')}</p>
        </div>
        <nav class="wizard-page-footer__nav">
          <a class="wizard-page-footer__nav-link | nl-link" href="https://nldesignsystem.nl/project/kernteam/">
            ${t('footer.colophon.contact')}
          </a>
          <a class="wizard-page-footer__nav-link | nl-link" href="https://nldesignsystem.nl/privacyverklaring/">
            ${t('footer.colophon.privacyStatement')}
          </a>
          <a
            class="wizard-page-footer__nav-link | nl-link"
            href="https://nldesignsystem.nl/toegankelijkheidsverklaring/"
          >
            ${t('footer.colophon.accessibilityStatement')}
          </a>
        </nav>
        <nav class="wizard-page-footer__nav">
          <a class="wizard-page-footer__nav-link | nl-link" href="/validate-tokens">
            ${t('footer.otherLinks.validateTokens')}
          </a>
          <a class="wizard-page-footer__nav-link | nl-link" href="/reuse-tokens">
            ${t('footer.otherLinks.reuseTokens')}
          </a>
          <a class="wizard-page-footer__nav-link | nl-link" href="/minify-tokens">
            ${t('footer.otherLinks.minifyTokens')}
          </a>
        </nav>
      </div>
    `;
  }
}
