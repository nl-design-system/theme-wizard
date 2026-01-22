import linkCss from '@nl-design-system-candidate/link-css/link.css?inline';
import { html, LitElement, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('template-link')
export class TemplateLink extends LitElement {
  @property() href: string = '';

  static override readonly styles = [unsafeCSS(linkCss)];

  override render() {
    return html`
      <a class="nl-link" href=${this.href}>
        <slot></slot>
      </a>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'template-link': TemplateLink;
  }
}
