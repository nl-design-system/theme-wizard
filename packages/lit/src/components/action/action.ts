import actionStyles from '@gemeente-denhaag/action/index.css?inline';
import { LitElement, html, unsafeCSS } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('theme-wizard-action')
export class ThemeWizardAction extends LitElement {
  static override readonly styles = [unsafeCSS(actionStyles)];
  override render() {
    return html`<a class="nl-link denhaag-action denhaag-action--single" href="#">
      <div class="denhaag-action__content">
        <strong> <slot></slot> </strong>
      </div>

      <div class="denhaag-action__details">
        <div class="denhaag-action__actions">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            fill="none"
            viewBox="0 0 24 24"
            class="denhaag-action__link-icon"
            focusable="false"
            aria-hidden="true"
            shape-rendering="auto"
          >
            <path
              fill="currentColor"
              d="M12.293 5.293a1 1 0 0 1 1.414 0l6 6a1 1 0 0 1 0 1.414l-6 6a1 1 0 0 1-1.414-1.414L16.586 13H5a1 1 0 1 1 0-2h11.586l-4.293-4.293a1 1 0 0 1 0-1.414"
            ></path>
          </svg>
        </div>
      </div>
    </a>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'theme-wizard-action': ThemeWizardAction;
  }
}
