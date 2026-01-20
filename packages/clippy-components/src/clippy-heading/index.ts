import headingCss from '@nl-design-system-candidate/heading-css/heading.css?inline';
import { LitElement, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { html, unsafeStatic } from 'lit/static-html.js';

@customElement('clippy-heading')
export class TemplateHeading extends LitElement {
  @property({ type: Number }) level = 1;

  static override readonly styles = [unsafeCSS(headingCss)];

  override render() {
    const safeLevel = Math.min(6, Math.max(1, Number(this.level) || 1));
    const tag = unsafeStatic(`h${safeLevel}`);
    return html`<${tag} class="nl-heading nl-heading--level-${safeLevel}"><slot></slot></${tag}>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'clippy-heading': TemplateHeading;
  }
}
