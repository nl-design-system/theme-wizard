import { safeCustomElement } from '@src/lib/decorators';
import tableCss from '@utrecht/table-css/dist/index.css?inline';
import { LitElement, html, unsafeCSS } from 'lit';
import { property } from 'lit/decorators.js';
import '../clippy-color-sample';
import type { ColorGroup } from './types';
import srOnly from '../lib/sr-only';
import styles from './styles';

export type { ColorGroup } from './types';

const tag = 'clippy-token-table-color';

declare global {
  interface HTMLElementTagNameMap {
    [tag]: ClippyTokenTableColor;
  }
}

@safeCustomElement(tag)
export class ClippyTokenTableColor extends LitElement {
  static override readonly styles = [unsafeCSS(tableCss), styles, srOnly];

  @property({ type: Array })
  groups: ColorGroup[] = [];

  override render() {
    return html`<div class="utrecht-table-container utrecht-table-container--overflow-inline">
      <table class="utrecht-table">
        <thead class="utrecht-table__header">
          <tr class="utrecht-table__row" aria-hidden>
            <th></th>
            <th class="utrecht-table__header-cell" aria-hidden colspan="5">
              <span class="clippy-token-table-color__mastheader">Achtergrond</span>
            </th>
            <th class="utrecht-table__header-cell" aria-hidden colspan="4">
              <span class="clippy-token-table-color__mastheader">Kaders & lijnen</span>
            </th>
            <th class="utrecht-table__header-cell" aria-hidden colspan="5">
              <span class="clippy-token-table-color__mastheader">Voorgrond</span>
            </th>
          </tr>
          <tr class="utrecht-table__row">
            <th class="clippy-token-table-color__header-cell | utrecht-table__header-cell"></th>
            <th class="clippy-token-table-color__header-cell | utrecht-table__header-cell" scope="col">
              <span class="sr-only">background-</span>document
            </th>
            <th class="clippy-token-table-color__header-cell | utrecht-table__header-cell" scope="col">
              <span class="sr-only">background-</span>subtle
            </th>
            <th class="clippy-token-table-color__header-cell | utrecht-table__header-cell" scope="col">
              <span class="sr-only">background-</span>default
            </th>
            <th class="clippy-token-table-color__header-cell | utrecht-table__header-cell" scope="col">
              <span class="sr-only">background-</span>hover
            </th>
            <th class="clippy-token-table-color__header-cell | utrecht-table__header-cell" scope="col">
              <span class="sr-only">background-</span>active
            </th>

            <th class="clippy-token-table-color__header-cell | utrecht-table__header-cell" scope="col">
              <span class="sr-only">border-</span>subtle
            </th>
            <th class="clippy-token-table-color__header-cell | utrecht-table__header-cell" scope="col">
              <span class="sr-only">border-</span>default
            </th>
            <th class="clippy-token-table-color__header-cell | utrecht-table__header-cell" scope="col">
              <span class="sr-only">border-</span>hover
            </th>
            <th class="clippy-token-table-color__header-cell | utrecht-table__header-cell" scope="col">
              <span class="sr-only">border-</span>active
            </th>

            <th class="clippy-token-table-color__header-cell | utrecht-table__header-cell" scope="col">
              <span class="sr-only">color-</span>subtle
            </th>
            <th class="clippy-token-table-color__header-cell | utrecht-table__header-cell" scope="col">
              <span class="sr-only">color-</span>default
            </th>
            <th class="clippy-token-table-color__header-cell | utrecht-table__header-cell" scope="col">
              <span class="sr-only">color-</span>hover
            </th>
            <th class="clippy-token-table-color__header-cell | utrecht-table__header-cell" scope="col">
              <span class="sr-only">color-</span>active
            </th>
            <th class="clippy-token-table-color__header-cell | utrecht-table__header-cell" scope="col">
              <span class="sr-only">color-</span>document
            </th>
          </tr>
        </thead>
        <tbody class="utrecht-table__body">
          ${this.groups.map(
            ({ colorEntries, key: groupName }) =>
              html`<tr class="utrecht-table__row">
                <th class="clippy-token-table-color__header-cell | utrecht-table__header-cell" scope="row">
                  ${groupName}
                </th>
                ${colorEntries.map(
                  (entry) =>
                    html`<td class="clippy-token-table-color__cell | utrecht-table__cell">
                      <clippy-color-sample color="${entry.displayValue}"></clippy-color-sample>
                      <span class="sr-only">${entry.tokenId}</span>
                    </td>`,
                )}
              </tr>`,
          )}
        </tbody>
      </table>
    </div>`;
  }
}
