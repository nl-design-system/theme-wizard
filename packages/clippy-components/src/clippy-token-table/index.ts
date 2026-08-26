import buttonStyles from '@nl-design-system-candidate/button-css/button.css?inline';
import codeCss from '@nl-design-system-candidate/code-css/code.css?inline';
import dataBadgeCss from '@nl-design-system-candidate/data-badge-css/data-badge.css?inline';
import '../clippy-color-sample';
import '../clippy-modal';
import '../clippy-token-detail';
import { BaseDesignToken, getTokenSubtype, stringifyToken } from '@nl-design-system-community/design-tokens-schema';
import { safeCustomElement } from '@src/lib/decorators';
import { getTokenDimensionSpaceConcept, getTokenPath } from '@src/lib/tokens';
import { LitElement, html, nothing, unsafeCSS } from 'lit';
import { property, query } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import '../clippy-color-sample';
import '../clippy-token-sample-spacing';
import '../clippy-token-sample-text';
import '../clippy-token-sample-border';
import '../clippy-graph-paper';
import '../clippy-token-detail';
import { ClippyModal } from '../clippy-modal';
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
  static override readonly styles = [
    unsafeCSS(buttonStyles),
    unsafeCSS(dataBadgeCss),
    unsafeCSS(codeCss),
    styles,
    srOnly,
  ];

  @query('clippy-modal')
  dialog?: ClippyModal;

  @property({ type: Object })
  tokens?: BaseDesignToken[];

  @property({ attribute: 'example-label', type: String }) exampleLabel = 'Example';
  @property({ attribute: 'token-id-label', type: String }) tokenIdLabel = 'Token ID';
  @property({ attribute: 'value-label', type: String }) valueLabel = 'Value';
  @property({ attribute: 'details-label', type: String }) detailsLabel = 'Details';
  @property({ attribute: 'show-details-label', type: String }) showDetailsLabel = 'Show details';

  // TODO: fix prop-drilling with composition. These are passed down to the `clippy-token-detail` component.
  @property({ attribute: 'reference-title-label', type: String }) referenceTitleLabel = 'Where is this token used?';
  @property({ attribute: 'reference-empty-label', type: String }) referenceEmptyLabel = 'This token is not used.';
  @property({ attribute: 'copy-to-clipboard-label', type: String }) copyToClipboardLabel = 'Copy to clipboard: ';

  #currentToken?: BaseDesignToken = undefined;

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
          reference-title-label="${this.referenceTitleLabel}"
          reference-empty-label="${this.referenceEmptyLabel}"
          copy-to-clipboard-label="${this.copyToClipboardLabel}"
        >
        </clippy-token-detail>
      </clippy-modal>
    `;
  }

  #renderTokenExample({ token }: { token: BaseDesignToken }) {
    if (!token) {
      return nothing;
    }
    switch (token.$type) {
      case 'color':
        return html`<clippy-color-sample color=${stringifyToken(token)}></clippy-color-sample>`;
      case 'dimension': {
        // dimensions have a lot of different subtypes
        const subType = getTokenSubtype(token);
        switch (subType) {
          case 'font-size':
            return html`<clippy-token-sample-text
              font-size=${stringifyToken(token)}
              truncate
            ></clippy-token-sample-text>`;
          case 'space-block':
          case 'space-inline':
          case 'space-text':
          case 'space-column':
          case 'space-row':
            return html`<clippy-token-sample-spacing
              size=${stringifyToken(token)}
              concept=${getTokenDimensionSpaceConcept(token)}
            ></clippy-token-sample-spacing>`;
          case 'border-width':
            return html`<clippy-token-sample-border
              border-width=${stringifyToken(token)}
            ></clippy-token-sample-border>`;
          case 'border-radius':
            return html`<clippy-token-sample-border
              border-radius=${stringifyToken(token)}
            ></clippy-token-sample-border>`;
          default:
            return nothing;
        }
      }
      // TODO: Google fonts?
      case 'fontFamily':
        return html`<clippy-token-sample-text
          font-family=${stringifyToken(token)}
          font-size="var(--basis-text-font-size-xl)"
          truncate
        ></clippy-token-sample-text>`;
      case 'number': {
        const subType = getTokenSubtype(token);
        switch (subType) {
          case 'font-weight':
            return html`<clippy-token-sample-text
              font-weight=${stringifyToken(token)}
              font-size="var(--basis-text-font-size-xl)"
              truncate
            ></clippy-token-sample-text>`;
          case 'line-height':
            return html`<clippy-token-sample-text
              line-height=${stringifyToken(token)}
              font-size="var(--basis-text-font-size-xl)"
              truncate
            ></clippy-token-sample-text>`;
          default:
            return nothing;
        }
      }
      default:
        return nothing;
    }
  }

  override connectedCallback() {
    super.connectedCallback();
    this.#currentToken = this.tokens?.[0];
  }

  override render() {
    return html`
      <div role="table" class="clippy-token-table__table">
        <div role="row" class="clippy-token-table__header">
          <span role="columnheader" class="clippy-token-table__cell clippy-token-table__head">
            ${this.exampleLabel}
          </span>
          <span role="columnheader" class="clippy-token-table__cell clippy-token-table__head">
            ${this.tokenIdLabel}
          </span>
          <span role="columnheader" class="clippy-token-table__cell clippy-token-table__head">${this.valueLabel}</span>
          <span role="columnheader" class="clippy-token-table__cell clippy-token-table__head">
            ${this.detailsLabel}
          </span>
        </div>
        <div role="rowgroup" class="clippy-token-table__body">
          ${this.tokens?.map((token) => {
            const subType = getTokenSubtype(token);
            return html`
              <div role="row" class="clippy-token-table__row">
                <div class="clippy-token-table__cell">
                  <span aria-hidden="true" class="clippy-token-table__head clippy-token-table__head--visual-small">
                    ${this.exampleLabel}
                  </span>
                  <clippy-graph-paper
                    class=${classMap({
                      'clippy-token-table__example': true,
                      'clippy-token-table__example--clean': subType === 'line-height',
                    })}
                  >
                    ${this.#renderTokenExample({ token })}
                  </clippy-graph-paper>
                </div>
                <div class="clippy-token-table__cell">
                  <span aria-hidden="true" class="clippy-token-table__head clippy-token-table__head--visual-small">
                    ${this.tokenIdLabel}
                  </span>
                  <span class="nl-data-badge">${getTokenPath(token)}</span>
                </div>
                <div class="clippy-token-table__cell">
                  <span aria-hidden="true" class="clippy-token-table__head clippy-token-table__head--visual-small">
                    ${this.valueLabel}
                  </span>
                  <code class="nl-code">${stringifyToken(token)}</code>
                </div>
                <div class="clippy-token-table__cell">
                  <span aria-hidden="true" class="clippy-token-table__head clippy-token-table__head--visual-small">
                    ${this.detailsLabel}
                  </span>
                  <button
                    type="button"
                    class="clippy-token-table__details-button | nl-button nl-button--subtle"
                    @click=${() => this.#openDialog({ token })}
                  >
                    ${this.showDetailsLabel}<span class="sr-only">: ${getTokenPath(token)}</span>
                  </button>
                </div>
              </div>
            `;
          })}
        </div>
      </div>
      ${this.#renderDialog()}
    `;
  }
}
