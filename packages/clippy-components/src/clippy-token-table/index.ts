import { safeCustomElement } from '@src/lib/decorators';
import '../clippy-color-sample';
import '../clippy-modal';
import '../clippy-token-detail';
import { LitElement, html } from 'lit';
import srOnly from '../lib/sr-only';
import styles from './styles';

const tag = 'clippy-token-table';

declare global {
  interface HTMLElementTagNameMap {
    [tag]: ClippyTokenTable;
  }
}

@safeCustomElement(tag)
export class ClippyTokenTable extends LitElement {
  static override readonly styles = [styles, srOnly];

  override render() {
    return html`<mark>Hello world</mark>`;
  }
}
