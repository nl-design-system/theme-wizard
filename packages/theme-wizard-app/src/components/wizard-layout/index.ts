import maTheme from '@nl-design-system-community/ma-design-tokens/dist/theme.css?inline';
import linkCss from '@utrecht/link-css/dist/index.css?inline';
import { html, LitElement, unsafeCSS } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { t } from '../../i18n';
import '../sidebar/sidebar';
import '../wizard-logo';
import styles from './styles';

const tag = 'wizard-layout';

// Declare the custom element for TypeScript
declare global {
  interface HTMLElementTagNameMap {
    [tag]: WizardLayout;
  }
}

@customElement(tag)
export class WizardLayout extends LitElement {
  static override readonly styles = [unsafeCSS(maTheme), unsafeCSS(linkCss), styles];

  @state() private hasSidebar = false;

  private onSidebarSlotChange(e: Event) {
    const slot = e.target as HTMLSlotElement;
    this.hasSidebar = slot.assignedElements().length > 0;
  }

  override render() {
    return html`
      <div class="ma-theme wizard-layout ${classMap({ 'wizard-layout--has-sidebar': this.hasSidebar })}">
        <header class="wizard-layout__header">
          <div class="wizard-layout__logo">
            <a href="/">
              <wizard-logo></wizard-logo>
            </a>
          </div>

          <div class="wizard-layout__nav">
            <slot name="page-nav"></slot>
          </div>
        </header>

        <wizard-sidebar class="wizard-layout__sidebar" ?hidden=${!this.hasSidebar}>
          <slot name="sidebar" @slotchange=${this.onSidebarSlotChange}></slot>
        </wizard-sidebar>

        <section class="wizard-layout__main">
          <slot name="main"></slot>
        </section>

        <footer class="wizard-layout__footer">
          <div class="wizard-layout__footer-logo">
            <wizard-logo></wizard-logo>
          </div>
          <div class="wizard-layout__footer-about">
            <p>${t('footer.colophon.about')}</p>
          </div>
          <nav class="wizard-layout__footer-nav">
            <a class="nl-link wizard-layout__footer-nav-link" href="https://nldesignsystem.nl/project/kernteam/">
              ${t('footer.colophon.contact')}
            </a>
            <a class="nl-link wizard-layout__footer-nav-link" href="https://nldesignsystem.nl/privacyverklaring/">
              ${t('footer.colophon.privacyStatement')}
            </a>
            <a
              class="nl-link wizard-layout__footer-nav-link"
              href="https://nldesignsystem.nl/toegankelijkheidsverklaring/"
            >
              ${t('footer.colophon.accessibilityStatement')}
            </a>
          </nav>
        </footer>
      </div>
    `;
  }
}
