import { safeCustomElement } from '@src/lib/decorators';
import { LitElement, html, unsafeCSS } from 'lit';
import styles from './styles';

const tag = 'clippy-color-table';

declare global {
  interface HTMLElementTagNameMap {
    [tag]: ClippyColorTable;
  }
}

@safeCustomElement(tag)
export class ClippyColorTable extends LitElement {
  static override readonly styles = [unsafeCSS(styles)];

  override render() {
    return html`<table>
      <tr>
        <th>header</th>
      </tr>
      <tr>
        <td>content</td>
      </tr>
    </table>`;
  }
}
