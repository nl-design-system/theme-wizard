import paragraphCss from '@nl-design-system-candidate/paragraph-css/paragraph.css?inline';
import { LitElement, unsafeCSS, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('theme-wizard-paragraph')
export class ThemeWizardParagraph extends LitElement {
  @property() lead = false;

  static override readonly styles = [unsafeCSS(paragraphCss)];

  override render() {
    return html`<p class="nl-paragraph ${this.lead ? 'nl-paragraph--lead' : ''}"><slot></slot></p>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'theme-wizard-paragraph': ThemeWizardParagraph;
  }
}
