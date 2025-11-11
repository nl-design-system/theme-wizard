import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import styles from './styles';

@customElement('template-color-swatch')
export class TemplateColorSwatch extends LitElement {
  @property({ attribute: 'reference' }) reference = '';
  @property({ type: Object }) tokens: Record<string, unknown> = {};

  static override readonly styles = [styles];

  override render() {
    const referenceToken = this.reference.replaceAll('.', '-');
    const backgroundStyle = `background-color: var(--${referenceToken})`;

    return html`<div class="template-color-swatch__container">
      <div role="presentation" class="template-color-swatch" style=${backgroundStyle}></div>
      <p class="reference">${this.reference}</p>
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'template-color-swatch': TemplateColorSwatch;
  }
}
