import buttonCss from '@nl-design-system-candidate/button-css/button.css?inline';
import Download from '@tabler/icons/outline/download.svg?raw';
import { LitElement, html, nothing, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import styles from './styles';

const tag = 'wizard-download-link';

declare global {
  interface HTMLElementTagNameMap {
    [tag]: WizardDownloadLink;
  }
}

/**
 * Renders a styled anchor as a download button using a `data:` URL built from
 * the `content` property. Renders nothing when `content` is empty.
 *
 * @element wizard-download-link
 */
@customElement(tag)
export class WizardDownloadLink extends LitElement {
  static override readonly styles = [unsafeCSS(buttonCss), styles];

  @property({ type: String })
  content = '';

  @property({ reflect: true, type: String })
  filename = 'tokens.json';

  @property({ attribute: 'content-type', reflect: true, type: String })
  contentType = 'application/json';

  override render() {
    if (!this.content) {
      return nothing;
    }
    return html`
      <a
        href=${`data:${this.contentType};charset=utf-8,${encodeURIComponent(this.content)}`}
        download=${this.filename}
        class="nl-button nl-button--secondary"
      >
        <span class="nl-button__icon-start">${unsafeSVG(Download)}</span>
        <slot></slot>
      </a>
    `;
  }
}
