import { LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";

const tag = 'clippy-combobox';

declare global {
  interface HTMLElementTagNameMap {
    [tag]: ClippyCombobox;
  }
}

@customElement(tag)
export class ClippyCombobox extends LitElement {
  @property() value = ''
}
