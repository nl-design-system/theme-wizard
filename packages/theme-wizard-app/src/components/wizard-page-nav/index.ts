import linkStyles from '@nl-design-system-candidate/link-css/link.css?inline';
import { LitElement, TemplateResult, html, nothing, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { t } from '../../i18n';
import styles from './styles';

const tag = 'wizard-page-nav';

declare global {
  interface HTMLElementTagNameMap {
    [tag]: WizardPageNav;
  }
}

export type AnchorNavItem = {
  href: string;
  title: string | TemplateResult;
};

@customElement(tag)
export class WizardPageNav extends LitElement {
  @property({ type: Array }) items: AnchorNavItem[] = [
    { href: '/basis-tokens', title: t('nav.configure') },
    { href: '/components', title: t('nav.components') },
    { href: '/style-guide', title: t('nav.styleGuide') },
  ];

  static override readonly styles = [unsafeCSS(linkStyles), styles];

  private isCurrentPage(href: string): boolean {
    return globalThis.location.href.includes(href);
  }

  override render() {
    return html`
      <nav class="wizard-page-nav">
        ${this.items.map(
          (item) => html`
            <li class="wizard-page-nav__item">
              <a
                class="nl-link wizard-page-nav__link"
                href="${item.href}"
                aria-current=${this.isCurrentPage(item.href) ? 'page' : nothing}
              >
                ${item.title}
              </a>
            </li>
          `,
        )}
      </nav>
    `;
  }
}
