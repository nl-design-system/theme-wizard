import maTheme from '@nl-design-system-community/ma-design-tokens/dist/theme.css?inline';
import linkCss from '@utrecht/link-css/dist/index.css?inline';
import { html, LitElement, unsafeCSS } from 'lit';
import { customElement } from 'lit/decorators.js';
import styles from './styles';
import '../sidebar/sidebar';
import '../wizard-logo';

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

  override render() {
    return html`
      <div class="wizard-layout ma-theme">
        <div class="wizard-layout__logo">
          <wizard-logo></wizard-logo>
        </div>

        <wizard-sidebar class="wizard-layout__sidebar">
          <slot name="sidebar"></slot>
        </wizard-sidebar>

        <div class="wizard-layout__nav">
          <nav>
            <a href="/" class="utrecht-link utrecht-link--html-a wizard-layout__nav-item"> Configureer </a>
            <a href="/style-guide" class="utrecht-link utrecht-link--html-a wizard-layout__nav-item"> Style Guide </a>
          </nav>

          <div class="wizard-layout__nav-slot">
            <slot name="nav"></slot>
          </div>
        </div>

        <section class="wizard-layout__main">
          <slot name="main"></slot>
        </section>
      </div>
    `;
  }
}
