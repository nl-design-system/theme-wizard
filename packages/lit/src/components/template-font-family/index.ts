import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('template-font-family')
export class TemplateFontFamily extends LitElement {
  @property({ attribute: 'reference' }) reference = '';
  @property({ type: Object }) tokens: Record<string, unknown> = {};

  override render() {
    const cssCustomProperty = `--${this.reference.replaceAll('.', '-')}`;
    const backgroundStyle = `font-family: var(${cssCustomProperty})`;
    const formattedReference = this.reference
      .split('.')
      .map((segment, index, array) => (index < array.length - 1 ? html`${segment}.<wbr />` : html`${segment}`));

    return html`<div class="template-color-swatch__container">
      <div role="presentation" class="template-color-swatch" style=${backgroundStyle} title=${this.reference}></div>
      <p class="reference">${formattedReference}</p>
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'template-font-family': TemplateFontFamily;
  }
}
