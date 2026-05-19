import { ClippyElement } from '@lib/clippy-element';
import headingCss from '@nl-design-system-candidate/heading-css/heading.css?inline';
import { unsafeCSS } from 'lit';
import { property } from 'lit/decorators.js';
import { html, unsafeStatic } from 'lit/static-html.js';

const tag = 'clippy-heading';

/**
 * ClippyHeading
 * @element clippy-heading
 * @slot - Slot to place the text in
 */
export class ClippyHeading extends ClippyElement {
  @property({ type: Number }) level = 1;

  static override readonly tagName = tag;

  static override readonly styles = [unsafeCSS(headingCss)];

  override render() {
    const safeLevel = Math.min(6, Math.max(1, Number(this.level) || 1));
    const tag = unsafeStatic(`h${safeLevel}`);
    return html`<${tag} class="nl-heading nl-heading--level-${safeLevel}"><slot></slot></${tag}>`;
  }
}

ClippyHeading.define();
declare global {
  interface HTMLElementTagNameMap {
    [tag]: ClippyHeading;
  }
}
