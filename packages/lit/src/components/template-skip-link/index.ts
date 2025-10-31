import skipLinkCss from '@nl-design-system-candidate/skip-link-css/skip-link.css?inline';
import { LitElement, html, unsafeCSS } from 'lit';
import { customElement } from 'lit/decorators.js';
import styles from './styles';

@customElement('template-skip-link')
export class TemplateSkipLink extends LitElement {
  static override readonly styles = [unsafeCSS(skipLinkCss), styles];

  override render() {
    return html` <a href="#main" class="nl-skip-link nl-skip-link--visible-on-focus">
      <slot></slot>
    </a>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'template-skip-link': TemplateSkipLink;
  }
}
