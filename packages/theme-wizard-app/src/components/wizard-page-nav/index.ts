import type { NavigationItems } from '@nl-design-system-community/clippy-components/src/clippy-navigation-bar/types.js';
import '@nl-design-system-community/clippy-components/clippy-navigation-bar';
import linkStyles from '@nl-design-system-candidate/link-css/link.css?inline';
import { LitElement, TemplateResult, html, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { t } from '../../i18n';
import styles from './styles';

const tag = 'wizard-page-nav';

declare global {
  interface HTMLElementTagNameMap {
    [tag]: WizardPageNav;
  }
}

export type PageNavItem = {
  href: string;
  title: string | TemplateResult;
};

@customElement(tag)
export class WizardPageNav extends LitElement {
  @property({ type: Array }) items: NavigationItems = [
    { href: '/wizard', label: t('nav.wizard') as string },
    { href: '/basis-tokens', label: t('nav.identity') as string },
    { href: '/components', label: t('nav.components') as string },
    { href: '/style-guide', label: t('nav.styleGuide') as string },
    { href: '/publish-tokens', label: t('nav.publish') as string },
  ];

  static override readonly styles = [unsafeCSS(linkStyles), styles];

  private isCurrentPage(href: string): boolean {
    return globalThis.location.href.includes(href);
  }

  override render() {
    const items = this.items.map((item) => ({
      ...item,
      current: this.isCurrentPage(item.href),
    }));
    return html` <clippy-navigation-bar .items=${items}></clippy-navigation-bar> `;
  }
}
