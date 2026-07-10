import { safeCustomElement } from '@src/lib/decorators';
import tableCss from '@utrecht/table-css/dist/index.css?inline';
import { LitElement, html, unsafeCSS } from 'lit';
import srOnly from '../lib/sr-only';
import '../clippy-color-sample';
import styles from './styles';

const tag = 'clippy-color-table';

declare global {
  interface HTMLElementTagNameMap {
    [tag]: ClippyColorTable;
  }
}

@safeCustomElement(tag)
export class ClippyColorTable extends LitElement {
  static override readonly styles = [unsafeCSS(tableCss), styles, srOnly];

  override render() {
    return html`<table class="utrecht-table">
      <thead>
        <tr class="utrecht-table__row" aria-hidden>
          <th></th>
          <th class="utrecht-table__header-cell" aria-hidden colspan="5">Achtergrond</th>
          <th class="utrecht-table__header-cell" aria-hidden>Voorgrond</th>
          <th class="utrecht-table__header-cell" aria-hidden>Kaders & lijnen</th>
        </tr>
        <tr class="utrecht-table__row">
          <th class="utrecht-table__header-cell"></th>
          <th class="utrecht-table__header-cell"><span class="sr-only">background-</span>document</th>
          <th class="utrecht-table__header-cell"><span class="sr-only">background-</span>subtle</th>
          <th class="utrecht-table__header-cell"><span class="sr-only">background-</span>default</th>
          <th class="utrecht-table__header-cell"><span class="sr-only">background-</span>hover</th>
          <th class="utrecht-table__header-cell"><span class="sr-only">background-</span>active</th>

          <th class="utrecht-table__header-cell">color-X</th>
          <th class="utrecht-table__header-cell">border-X</th>
        </tr>
      </thead>
      <tbody>
        <tr class="utrecht-table__row">
          <th class="utrecht-table__header-cell">default</th>
          <td class="utrecht-table__cell"><clippy-color-sample color="red"></clippy-color-sample></td>
          <td class="utrecht-table__cell"><clippy-color-sample color="green"></clippy-color-sample></td>
          <td class="utrecht-table__cell"><clippy-color-sample color="blue"></clippy-color-sample></td>
          <td class="utrecht-table__cell"><clippy-color-sample color="purple"></clippy-color-sample></td>
          <td class="utrecht-table__cell"><clippy-color-sample color="orange"></clippy-color-sample></td>

          <td class="utrecht-table__cell"><mark>color</mark></td>
          <td class="utrecht-table__cell"><mark>border</mark></td>
        </tr>
      </tbody>
    </table>`;
  }
}
