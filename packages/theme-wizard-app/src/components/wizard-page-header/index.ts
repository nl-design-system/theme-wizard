import type { NavigationItems } from '@nl-design-system-community/clippy-components/src/clippy-navigation-bar/types.js';
import '@nl-design-system-community/clippy-components/clippy-navigation-bar';
import '@nl-design-system-community/clippy-components/clippy-side-navigation';
import '@nl-design-system-community/clippy-components/clippy-page-header';
import '../wizard-logo';
import { LitElement, PropertyValues, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { t } from '../../i18n';
import { hasChangedProperty } from '../../utils/lit';
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

  #parsedNavigationItems: NavigationItems = [];

  static override readonly styles = [styles];

  private isCurrentPage(href: string): boolean {
    return globalThis.location.href.includes(href);
  }

  protected override willUpdate(changedProperties: PropertyValues) {
    if (!hasChangedProperty(changedProperties, ['navigationItems'])) {
      return;
    }

    this.#parsedNavigationItems = this.navigationItems.map((item) => ({
      ...item,
      current: this.isCurrentPage(item.href),
    }));

    console.log('this.#parsedNavigationItems', this.#parsedNavigationItems);
  }

  override render() {
    console.log('this.items', this.navigationItems);
    console.log('this.#parsedNavigationItems', this.#parsedNavigationItems);
    return html`
      <clippy-page-header variant="compact">
        <clippy-navigation-bar .items=${this.#parsedNavigationItems} slot="navigation-bar"></clippy-navigation-bar>
        <clippy-side-navigation .items=${this.#parsedNavigationItems} slot="navigation-drawer"></clippy-side-navigation>
        <a class="wizard-page-header__logo" href="/" slot="logo">
          <wizard-logo></wizard-logo>
        </a>
      </clippy-page-header>
    `;
  }
}
