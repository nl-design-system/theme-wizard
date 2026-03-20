import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import styles from './styles';

const tag = 'wizard-scraper-loader';

declare global {
  interface HTMLElementTagNameMap {
    [tag]: WizardScraperLoader;
  }
}

@customElement(tag)
export class WizardScraperLoader extends LitElement {
  static override readonly styles = [styles];

  @property() emoji?: string;
  @property() text?: string;
  @property() heading?: string;

  override render() {
    return html`
      <div class="wizard-scraper-loader">
        <clippy-heading class="wizard-scraper-loader__heading">
          ${this.heading}
          <span class="wizard-scraper-loader__ellipsis-wrapper">
            <span class="wizard-scraper-loader__ellipsis">.</span>
            <span class="wizard-scraper-loader__ellipsis">.</span>
            <span class="wizard-scraper-loader__ellipsis">.</span>
          </span>
        </clippy-heading>
        <p class="nl-paragraph" class="wizard-scraper-loader__text">${this.text}</p>
        <div aria-hidden="true" class="wizard-scraper-loader__emoji">
          <span class="wizard-scraper-loader__emoji-icon">${this.emoji}</span>
        </div>
      </div>
    `;
  }
}
