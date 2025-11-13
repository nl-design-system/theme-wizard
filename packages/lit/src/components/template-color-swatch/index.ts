import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import styles from './styles';

@customElement('template-color-swatch')
export class TemplateColorSwatch extends LitElement {
  @property({ attribute: 'reference' }) reference = '';
  @property({ type: Object }) tokens: Record<string, unknown> = {};

  static override readonly styles = [styles];

  override render() {
    const cssCustomProperty = `--${this.reference.replaceAll('.', '-')}`;
    const backgroundStyle = `background-color: var(${cssCustomProperty})`;
    const formattedReference = this.reference
      .split('.')
      .map((segment, index, array) => (index < array.length - 1 ? html`${segment}.<wbr />` : html`${segment}`));

    return html`<div class="template-color-swatch__container">
      <div role="presentation" class="theme-color-swatch" style=${backgroundStyle} title=${this.reference}></div>
      <p class="theme-reference">${formattedReference}</p>
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'template-color-swatch': TemplateColorSwatch;
  }
}
