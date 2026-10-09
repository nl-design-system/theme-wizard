import type { NavigationItems } from '@nl-design-system-community/clippy-components/src/clippy-navigation-bar/types.js';
import '@nl-design-system-community/clippy-components/clippy-navigation-bar';
import '@nl-design-system-community/clippy-components/clippy-side-navigation';
import '@nl-design-system-community/clippy-components/clippy-page-header';
import '../wizard-logo';
import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { t } from '../../i18n';
import styles from './styles';

const tag = 'wizard-page-header';

declare global {
  interface HTMLElementTagNameMap {
    [tag]: WizardPageHeader;
  }
}

export const defaultNavigationItems: NavigationItems = [
  { href: '/wizard', label: t('nav.wizard') as string },
  { href: '/basis-tokens', label: t('nav.identity') as string },
  { href: '/components', label: t('nav.components') as string },
  { href: '/style-guide', label: t('nav.styleGuide') as string },
  { href: '/publish-tokens', label: t('nav.publish') as string },
];

@customElement(tag)
export class WizardPageHeader extends LitElement {
  @property({ attribute: 'navigation-items', type: Array }) navigationItems: NavigationItems = defaultNavigationItems;

  static override readonly styles = [styles];

  override render() {
    return html`
      <clippy-page-header variant="compact">
        <clippy-navigation-bar .items=${this.navigationItems} slot="navigation-bar"></clippy-navigation-bar>
        <clippy-side-navigation .items=${this.navigationItems} slot="navigation-drawer"></clippy-side-navigation>
        <a class="wizard-page-header__logo" href="/" slot="logo">
          <wizard-logo></wizard-logo>
        </a>
      </clippy-page-header>
    `;
  }
}
