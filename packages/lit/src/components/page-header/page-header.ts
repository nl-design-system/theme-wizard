import amsStyles from '@amsterdam/design-system-css/dist/index.css?inline';
import { LitElement, html, unsafeCSS } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('wiz-page-header')
export class WizPageHeader extends LitElement {
  static override readonly styles = [unsafeCSS(amsStyles)];
  override render() {
    return html` <header class="ams-page-header">
      <a class="ams-page-header__logo-link" href="/">
        <span class="ams-page-header__logo-container">
          <slot name="logo"></slot>
        </span>
      </a>

      <nav aria-labelledby="primary-navigation" class="ams-page-header__navigation">
        <h2 aria-hidden="true" class="ams-visually-hidden" id="primary-navigation">Hoofdnavigatie</h2>

        <ul class="ams-page-header__menu">
          <li class="ams-page-header__menu-item">
            <slot name="menu-links"></slot>
          </li>
        </ul>
      </nav>
    </header>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'wiz-page-header': WizPageHeader;
  }
}
