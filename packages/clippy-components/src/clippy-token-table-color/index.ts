import codeCss from '@nl-design-system-candidate/code-css/code.css?inline';
import dataBadgeCss from '@nl-design-system-candidate/data-badge-css/data-badge.css?inline';
import { safeCustomElement } from '@src/lib/decorators';
import tableCss from '@utrecht/table-css/dist/index.css?inline';
import Color from 'colorjs.io';
import { LitElement, html, unsafeCSS } from 'lit';
import '../clippy-color-sample';
import '../clippy-modal';
import { property, query } from 'lit/decorators.js';
import type { ColorEntry, ColorGroup } from './types';
import { ClippyModal } from '../clippy-modal';
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
  static override readonly styles = [unsafeCSS(dataBadgeCss), unsafeCSS(codeCss), unsafeCSS(tableCss), styles, srOnly];

  @query('clippy-modal')
  dialog?: ClippyModal;

  @property({ type: Array })
  groups: ColorGroup[] = [];

  #currentColorEntry?: ColorEntry = undefined;

  /**
   * Labels for titles, labels, buttons, etc. Consumers can override these,
   * e.g. with localized strings.
   */
  @property({ attribute: 'example-label', type: String }) exampleLabel = 'Example';
  @property({ attribute: 'value-label', type: String }) valueLabel = 'Value';
  @property({ attribute: 'reference-title-label', type: String }) referenceTitleLabel = 'Where is this token used?';
  @property({ attribute: 'reference-empty-label', type: String }) referenceEmptyLabel = 'This token is not used.';
  @property({ attribute: 'background-label', type: String }) backgroundLabel = 'Background';
  @property({ attribute: 'border-label', type: String }) borderLabel = 'Borders and lines';
  @property({ attribute: 'foreground-label', type: String }) foregroundLabel = 'Foreground';

  #openDialog({ entry }: { entry: ColorEntry }) {
    this.#currentColorEntry = entry;
    this.requestUpdate();

    if (!this.dialog) return;
    this.dialog.open();
  }

  #renderDialog() {
    const entry = this.#currentColorEntry;
    if (!entry) return html``;

    const color = new Color(entry.displayValue);
    return html`
      <clippy-modal title="${entry.tokenId}" actions="none">
        <clippy-heading level=${3} data-testid="example-label">${this.exampleLabel}</clippy-heading>
        <clippy-color-sample color=${entry.displayValue}></clippy-color-sample>
        <dl>
          <dt>Token type</dt>
          <dd>
            <code class="nl-code">color</code>
          </dd>
          <dt>Token ID</dt>
          <dd>
            <span class="nl-data-badge">${entry.tokenId}</span>
          </dd>
          <dt>CSS Variable</dt>
          <dd>
            <code class="nl-code">${`--${entry.tokenId.replaceAll('.', '-')}`}</code>
          </dd>
          <dt data-testid="value-label">${this.valueLabel}</dt>
          <dd>
            <code class="nl-code">${entry.displayValue}</code>
          </dd>
          <dt>OKLCH</dt>
          <dd>
            <code class="nl-code">${color.toString({ format: 'oklch' })}</code>
          </dd>
          <dt>P3 Color</dt>
          <dd>
            <code class="nl-code">${color.toString({ format: 'color' })}</code>
          </dd>
          <dt>RGB</dt>
          <dd>
            <code class="nl-code">${color.toString({ format: 'rgb' })}</code>
          </dd>
        </dl>

        <clippy-heading level=${3}>
          <span data-testid="reference-title-label">${this.referenceTitleLabel}</span>
          <data>(${entry.usage.length}&times;)</data>
        </clippy-heading>

        ${
          entry.usage.length > 0
            ? html`
                <ul>
                  ${entry.usage.map(
                    (referrer) => html`
                      <li>
                        <span class="nl-data-badge">${referrer}</span>
                      </li>
                    `,
                  )}
                </ul>
              `
            : html`
                <utrecht-paragraph data-testid="reference-empty-label">${this.referenceEmptyLabel}</utrecht-paragraph>
              `
        }
      </clippy-modal>
    `;
  }

  override connectedCallback() {
    super.connectedCallback();
    this.#currentColorEntry = this.groups[0].colorEntries[0];
  }

  override render() {
    return html`<div class="utrecht-table-container utrecht-table-container--overflow-inline">
        <table class="utrecht-table">
          <thead class="utrecht-table__header">
            <tr class="utrecht-table__row" aria-hidden>
              <th></th>
              <th class="utrecht-table__header-cell" aria-hidden colspan="5">
                <span class="clippy-token-table-color__mastheader" data-testid="background-label"
                  >${this.backgroundLabel}</span
                >
              </th>
              <th class="utrecht-table__header-cell" aria-hidden colspan="4">
                <span class="clippy-token-table-color__mastheader" data-testid="border-label">${this.borderLabel}</span>
              </th>
              <th class="utrecht-table__header-cell" aria-hidden colspan="5">
                <span class="clippy-token-table-color__mastheader" data-testid="foreground-label"
                  >${this.foregroundLabel}</span
                >
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
                  ${colorEntries.map((entry) => {
                    return html`<td class="clippy-token-table-color__cell | utrecht-table__cell">
                      <button
                        class="clippy-token-table-color__button-sample"
                        type="button"
                        @click=${() => this.#openDialog({ entry })}
                      >
                        <clippy-color-sample color="${entry.displayValue}"></clippy-color-sample>
                        <span class="sr-only">${entry.tokenId}</span>
                      </button>
                    </td>`;
                  })}
                </tr>`,
            )}
          </tbody>
        </table>
      </div>

      ${this.#renderDialog()} `;
  }
}
