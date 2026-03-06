import paragraphStyles from '@nl-design-system-candidate/paragraph-css/paragraph.css?inline';
import { LitElement, css, html, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';

const tag = 'wizard-font-sample';

declare global {
  interface HTMLElementTagNameMap {
    [tag]: WizardFontSample;
  }
}

const styles = css`
  .nl-paragraph {
    overflow: clip;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
  }
`;

@customElement(tag)
export class WizardFontSample extends LitElement {
  static override readonly styles = [unsafeCSS(paragraphStyles), styles];

  @property({ type: String }) size: string = '';
  @property({ type: String }) family: string = '';

  override render() {
    const fontStyles = [
      this.size && `--nl-paragraph-font-size: ${this.size}`,
      this.family && `--nl-paragraph-font-family: ${this.family}`,
    ]
      .filter(Boolean)
      .join(';');

    return html`
      <clippy-html-image>
        <p class="nl-paragraph" style="${fontStyles}">
          <slot>Op brute wijze ving de schooljuf de quasi-kalme lynx.</slot>
        </p>
      </clippy-html-image>
    `;
  }
}
