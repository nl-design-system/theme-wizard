import headingCss from '@nl-design-system-candidate/heading-css/heading.css?inline';
import { LitElement, unsafeCSS } from 'lit';
import { property } from 'lit/decorators.js';
import { html, unsafeStatic } from 'lit/static-html.js';

const tag = 'clippy-heading';

export class ClippyHeading extends LitElement {
  @property({ type: Number }) level = 1;

  static override readonly styles = [unsafeCSS(headingCss)];

  override render() {
    const safeLevel = Math.min(6, Math.max(1, Number(this.level) || 1));
    const tag = unsafeStatic(`h${safeLevel}`);
    return html`<${tag} class="nl-heading nl-heading--level-${safeLevel}"><slot></slot></${tag}>`;
  }
}

const registry = globalThis.customElements;
if (registry && !registry.get(tag)) {
  registry.define(tag, ClippyHeading);
}

declare global {
  interface HTMLElementTagNameMap {
    [tag]: ClippyHeading;
  }
}
