import headingCss from '@nl-design-system-candidate/heading-css/heading.css?inline';
import { LitElement, html, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('template-heading')
export class TemplateHeading extends LitElement {
  @property() level = 1;

  static override readonly styles = [unsafeCSS(headingCss)];

  override render() {
    return html`<h${this.level} class="nl-heading nl-heading--level-${this.level}"><slot></slot></h${this.level}>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'template-heading': TemplateHeading;
  }
}
