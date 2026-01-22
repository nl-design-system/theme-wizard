import amsStyles from '@amsterdam/design-system-css/dist/page-header/page-header.css?inline';
import amsVisuallyHiddenStyles from '@amsterdam/design-system-css/dist/visually-hidden/visually-hidden.css?inline';
import { LitElement, html, unsafeCSS } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('template-page-header')
export class TemplatePageHeader extends LitElement {
  static override readonly styles = [unsafeCSS(amsStyles), unsafeCSS(amsVisuallyHiddenStyles)];
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
          <slot name="menu-links"></slot>
        </ul>
      </nav>
    </header>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'template-page-header': TemplatePageHeader;
  }
}
