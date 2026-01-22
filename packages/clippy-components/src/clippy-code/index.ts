import codeCss from '@nl-design-system-candidate/code-css/code.css?inline';
import { LitElement, html, unsafeCSS } from 'lit';
const tag = 'clippy-code';

export class ClippyCode extends LitElement {
  static override readonly styles = [unsafeCSS(codeCss)];

  override render() {
    return html`<code class="nl-code"><slot></slot></code>`;
  }
}

const registry = globalThis.customElements;
if (registry && !registry.get(tag)) {
  registry.define(tag, ClippyCode);
}

declare global {
  interface HTMLElementTagNameMap {
    [tag]: ClippyCode;
  }
}
