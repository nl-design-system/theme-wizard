import codeCss from '@nl-design-system-candidate/code-css/code.css?inline';
import dataBadgeCss from '@nl-design-system-candidate/data-badge-css/data-badge.css?inline';
import { BaseDesignToken } from '@nl-design-system-community/design-tokens-schema';
import { safeCustomElement } from '@src/lib/decorators';
import { getTokenPath, stringifyTokenValue } from '@src/lib/tokens';
import tableCss from '@utrecht/table-css/dist/index.css?inline';
import '../clippy-color-sample';
import '../clippy-modal';
import '../clippy-token-detail';
import { LitElement, html, nothing, unsafeCSS } from 'lit';
import { property, query } from 'lit/decorators.js';
import type { TokenCollection } from './types';
import { ClippyModal } from '../clippy-modal';
import srOnly from '../lib/sr-only';
import styles from './styles';

const tag = 'clippy-token-table-color';

const BACKGROUND_COLUMNS = ['bg-document', 'bg-subtle', 'bg-default', 'bg-hover', 'bg-active'];
const BORDER_COLUMNS = ['border-subtle', 'border-default', 'border-hover', 'border-active'];
const FOREGROUND_COLUMNS = ['color-subtle', 'color-default', 'color-hover', 'color-active', 'color-document'];
const COLUMNS = [...BACKGROUND_COLUMNS, ...BORDER_COLUMNS, ...FOREGROUND_COLUMNS];

const getTokenName = (token: BaseDesignToken) => getTokenPath(token).split('.').at(-1);

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
  collection: TokenCollection = [];

  #currentToken?: BaseDesignToken = undefined;

  /**
   * Labels for titles, labels, buttons, etc. Consumers can override these,
   * e.g. with localized strings.
   */
  @property({ attribute: 'background-label', type: String }) backgroundLabel = 'Background';
  @property({ attribute: 'border-label', type: String }) borderLabel = 'Borders and lines';
  @property({ attribute: 'foreground-label', type: String }) foregroundLabel = 'Foreground';

  // TODO: fix prop-drilling with composition. These are passed down to the `clippy-token-detail` component.
  @property({ attribute: 'example-label', type: String }) exampleLabel = 'Example';
  @property({ attribute: 'value-label', type: String }) valueLabel = 'Value';
  @property({ attribute: 'reference-to-label', type: String }) referenceToLabel = 'Reference to';
  @property({ attribute: 'reference-title-label', type: String }) referenceTitleLabel = 'Where is this token used?';
  @property({ attribute: 'reference-empty-label', type: String }) referenceEmptyLabel = 'This token is not used.';
  @property({ attribute: 'copy-to-clipboard-label', type: String }) copyToClipboardLabel = 'Copy to clipboard: ';

  #openDialog({ token }: { token: BaseDesignToken }) {
    this.#currentToken = token;
    this.requestUpdate();

    if (!this.dialog) return;
    this.dialog.open();
  }

  #renderDialog() {
    const token = this.#currentToken;
    if (!token) {
      return html``;
    }

    const tokenPath = getTokenPath(token);
    return html`
      <clippy-modal title="${tokenPath}" actions="none">
        <clippy-token-detail
          .token=${token}
          example-label="${this.exampleLabel}"
          value-label="${this.valueLabel}"
          reference-to-label="${this.referenceToLabel}"
          reference-title-label="${this.referenceTitleLabel}"
          reference-empty-label="${this.referenceEmptyLabel}"
          copy-to-clipboard-label="${this.copyToClipboardLabel}"
        >
        </clippy-token-detail>
      </clippy-modal>
    `;
  }

  override connectedCallback() {
    super.connectedCallback();
    this.#currentToken = this.collection[0].tokens[0];
  }

  override render() {
    if (this.collection.length === 0) return nothing;
    return html`<div class="utrecht-table-container utrecht-table-container--overflow-inline">
        <table class="utrecht-table">
          <thead class="utrecht-table__header">
            <tr class="utrecht-table__row" aria-hidden>
              <th></th>
              <th class="utrecht-table__header-cell" aria-hidden colspan="${BACKGROUND_COLUMNS.length}">
                <span class="clippy-token-table-color__mastheader" data-testid="background-label"
                  >${this.backgroundLabel}</span
                >
              </th>
              <th class="utrecht-table__header-cell" aria-hidden colspan="${BORDER_COLUMNS.length}">
                <span class="clippy-token-table-color__mastheader" data-testid="border-label">${this.borderLabel}</span>
              </th>
              <th class="utrecht-table__header-cell" aria-hidden colspan="${FOREGROUND_COLUMNS.length}">
                <span class="clippy-token-table-color__mastheader" data-testid="foreground-label"
                  >${this.foregroundLabel}</span
                >
              </th>
            </tr>
            <tr class="utrecht-table__row">
              <th class="clippy-token-table-color__header-cell | utrecht-table__header-cell"></th>
              ${COLUMNS.map((column) => {
                const [prefix, ...rest] = column.split('-');
                const srPrefix = prefix === 'bg' ? 'background' : prefix;
                return html`
                  <th class="clippy-token-table-color__header-cell | utrecht-table__header-cell" scope="col">
                    <span class="sr-only">${srPrefix}-</span>${rest.join('-')}
                  </th>
                `;
              })}
            </tr>
          </thead>
          <tbody class="utrecht-table__body">
            ${this.collection.map(
              ({ name, tokens }) =>
                html`<tr class="utrecht-table__row">
                  <th class="clippy-token-table-color__header-cell | utrecht-table__header-cell" scope="row">
                    ${name.split('.').at(-1)}
                  </th>
                  ${COLUMNS.map((column) => {
                    const token = tokens.find((token) => getTokenName(token) === column);
                    if (!token) {
                      return html`<td class="clippy-token-table-color__cell | utrecht-table__cell"></td>`;
                    }
                    return html`<td class="clippy-token-table-color__cell | utrecht-table__cell">
                      <button
                        class="clippy-token-table-color__button-sample"
                        type="button"
                        @click=${() => this.#openDialog({ token })}
                      >
                        <clippy-color-sample color="${stringifyTokenValue(token)}"></clippy-color-sample>
                        <span class="sr-only">${getTokenPath(token)}</span>
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
