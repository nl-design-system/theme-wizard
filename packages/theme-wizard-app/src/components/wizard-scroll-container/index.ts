import { html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import styles from './styles';

const tag = 'wizard-scroll-container';

declare global {
  interface HTMLElementTagNameMap {
    [tag]: WizardScrollContainer;
  }
}

/**
 * @cssproperty [--wizard-scroll-container-scrollbar-color]  - set the `scrollbar-color` property
 * @cssproperty [--wizard-scroll-container-scrollbar-width]  - set the `scrollbar-width` property
 * @cssproperty [--wizard-scroll-container-max-size]         - How big the scroll container can become
 * @cssproperty [--wizard-scroll-container-shadow-size]      - How big the shadow is once shown
 * @cssproperty [--wizard-scroll-container-shadow-color]     - Shadow color; A good idea to use a semi-transparent color
 */
@customElement(tag)
export class WizardScrollContainer extends LitElement {
  static override readonly styles = [styles];

  override render() {
    return html`
      <div class="wizard-scroll-container">
        <slot></slot>
      </div>
    `;
  }
}
