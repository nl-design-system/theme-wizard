import buttonCss from '@nl-design-system-candidate/button-css/button.css?inline';
import { LitElement, html, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import styles from './styles';

@customElement('clippy-copy-to-clipboard-button')
export class ClippyCopyToClipBoardButton extends LitElement {
  static override readonly styles = [styles, unsafeCSS(buttonCss)];

  @property({ type: String })
  content = '';

  @property({ type: String })
  label = '';

  override render() {
    return html`<button
      @click=${() => navigator.clipboard.writeText(this.content)}
      class="nl-button nl-button--icon-only"
    >
      <span class="nl-button__icon-start">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M9 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h3m9 -9v-5a2 2 0 0 0 -2 -2h-2" />
          <path
            d="M13 17v-1a1 1 0 0 1 1 -1h1m3 0h1a1 1 0 0 1 1 1v1m0 3v1a1 1 0 0 1 -1 1h-1m-3 0h-1a1 1 0 0 1 -1 -1v-1"
          />
          <path d="M9 5a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2" />
        </svg>
      </span>
      <span class="nl-button__label">${this.label}</span>
    </button>`;
  }
}
