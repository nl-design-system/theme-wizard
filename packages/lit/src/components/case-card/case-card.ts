import caseCardStyles from '@gemeente-denhaag/card/index.css?inline';
import { LitElement, html, unsafeCSS } from 'lit';
import { customElement } from 'lit/decorators.js';
import caseCardTokenMap from './case-card.css';

@customElement('theme-wizard-case-card')
export class ThemeWizardCaseCard extends LitElement {
  static override readonly styles = [unsafeCSS(caseCardStyles), caseCardTokenMap];

  override render() {
    return html`<div class="denhaag-case-card">
      <div class="denhaag-case-card__wrapper">
        <div class="denhaag-case-card__background"></div>

        <div>
          <p class="nl-paragraph denhaag-case-card__title"><slot name="title"></slot></p>

          <p class="nl-paragraph denhaag-case-card__subtitle"><slot name="subtitle"></slot></p>
        </div>

        <div class="denhaag-case-card__footer">
          <div class="denhaag-case-card__context">
            <slot name="context"></slot>
          </div>

          <a class="nl-link denhaag-case-card__action" href="#" aria-label="Aanvraag subsidie geluidsisolatie">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="1em"
              height="1em"
              fill="none"
              viewBox="0 0 24 24"
              class="denhaag-icon denhaag-case-card__arrow"
              focusable="false"
              aria-hidden="true"
              shape-rendering="auto"
            >
              <path
                fill="currentColor"
                d="M12.293 5.293a1 1 0 0 1 1.414 0l6 6a1 1 0 0 1 0 1.414l-6 6a1 1 0 0 1-1.414-1.414L16.586 13H5a1 1 0 1 1 0-2h11.586l-4.293-4.293a1 1 0 0 1 0-1.414"
              ></path>
            </svg>
          </a>
        </div>
      </div>
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'theme-wizard-case-card': ThemeWizardCaseCard;
  }
}
